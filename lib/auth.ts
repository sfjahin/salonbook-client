import { betterAuth } from "better-auth";
import { APIError } from "better-auth/api";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { admin } from "better-auth/plugins"

const globalForMongo = globalThis as unknown as {
  mongoClient?: MongoClient;
};

const mongoClient =
  globalForMongo.mongoClient ??
  new MongoClient(process.env.MONGODB_URI as string);

// Reuse the same connection across Next.js dev hot reloads.
if (process.env.NODE_ENV !== "production") {
  globalForMongo.mongoClient = mongoClient;
}

const db = mongoClient.db(process.env.MONGODB_DB ?? "salonbookdb");

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [
    admin({
      defaultRole: "user",
      adminRoles: ["admin"],
    }),
  ],
  user: {
    additionalFields: {
      phone: {
        type: "string",
        required: false,
        input: true,
      },
    },
  },
  database: mongodbAdapter(db, {
    client: mongoClient,
  }),
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const email =
            typeof user.email === "string" ? user.email.toLowerCase() : "";
          const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
          const isReservedAdmin = Boolean(adminEmail) && email === adminEmail;
          const isAdminSeed = process.env.ADMIN_SEED === "true";

          // The administrator account can only be created by the seed script.
          if (isReservedAdmin && !isAdminSeed) {
            throw new APIError("FORBIDDEN", {
              message:
                "This email is reserved for the SalonBook administrator.",
            });
          }

          // Never trust a role coming from a public sign-up request.
          return {
            data: {
              ...user,
              role: isReservedAdmin && isAdminSeed ? "admin" : "user",
            },
          };
        },
        after: async (user) => {
          try {
            console.log("[auth] sign-up saved to MongoDB:", {
              id: user.id,
              name: user.name,
              email: user.email,
              phone: user.phone,
              emailVerified: user.emailVerified,
              createdAt: user.createdAt,
            });
          } catch (error) {
            console.error("[auth] failed to log sign-up:", error);
          }
        },
      },
    },
    session: {
      create: {
        after: async (session, context) => {
          try {
            const user = await context?.context.internalAdapter.findUserById(
              session.userId
            );

            console.log("[auth] sign-in saved to MongoDB:", {
              sessionId: session.id,
              userId: session.userId,
              name: user?.name,
              email: user?.email,
              ipAddress: session.ipAddress,
              userAgent: session.userAgent,
              expiresAt: session.expiresAt,
              createdAt: session.createdAt,
            });
          } catch (error) {
            console.error("[auth] failed to log sign-in:", error);
          }
        },
      },
    },
  },
});
