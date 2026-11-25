/**
 * Bootstraps the SalonBook administrator account.
 *
 * Run with: npm run seed:admin
 *
 * The script is idempotent:
 * - creates the admin user through Better Auth when missing,
 * - promotes an existing user with the same email,
 * - keeps the credential password in sync with ADMIN_PASSWORD,
 * - marks the account as verified and assigns the "admin" role.
 *
 * Credentials are read from the server-only .env file and are never
 * included in the client bundle.
 */
import { MongoClient } from "mongodb"
import { hashPassword } from "better-auth/crypto"

import { auth } from "../lib/auth"

const mongoUri = process.env.MONGODB_URI
const email = process.env.ADMIN_EMAIL?.trim().toLowerCase()
const password = process.env.ADMIN_PASSWORD
const name = process.env.ADMIN_NAME?.trim() || "SalonBook Admin"

if (!mongoUri) {
  console.error("Missing MONGODB_URI in the environment.")
  process.exit(1)
}

if (!email || !password) {
  console.error("Missing ADMIN_EMAIL or ADMIN_PASSWORD in the environment.")
  process.exit(1)
}

if (password.length < 8) {
  console.error("ADMIN_PASSWORD must be at least 8 characters long.")
  process.exit(1)
}

// Allows the database hook to create the reserved administrator email.
process.env.ADMIN_SEED = "true"

const client = new MongoClient(mongoUri)
await client.connect()

const db = client.db(process.env.MONGODB_DB ?? "salonbookdb")
const users = db.collection("user")
const accounts = db.collection("account")

try {
  let user = await users.findOne({ email })

  if (user) {
    console.log(`[seed-admin] Found existing user ${email}; promoting it.`)
  } else {
    await auth.api.signUpEmail({
      body: { name, email, password },
    })

    console.log(`[seed-admin] Created administrator ${email}.`)
  }

  // Re-read after sign-up so we always have the adapter's real `_id`
  // (the Mongo adapter stores related userId values as ObjectId).
  user = await users.findOne({ email })

  if (!user) {
    throw new Error("Administrator user could not be created.")
  }

  // Guarantee the role and verification state, even for older accounts.
  await users.updateOne(
    { _id: user._id },
    {
      $set: {
        name,
        role: "admin",
        emailVerified: true,
        updatedAt: new Date(),
      },
    }
  )

  // Keep the password hash in sync with the configured password so the
  // documented administrator credentials always work.
  const passwordHash = await hashPassword(password)
  const credentialAccount = await accounts.findOne({
    userId: user._id,
    providerId: "credential",
  })

  if (credentialAccount) {
    await accounts.updateOne(
      { _id: credentialAccount._id },
      { $set: { password: passwordHash, updatedAt: new Date() } }
    )
  } else {
    const now = new Date()
    await accounts.insertOne({
      accountId: String(user._id),
      providerId: "credential",
      userId: user._id,
      password: passwordHash,
      createdAt: now,
      updatedAt: now,
    })
  }

  console.log("[seed-admin] Administrator is ready:")
  console.log(`  email: ${email}`)
  console.log("  role:  admin")
} finally {
  await client.close()
}

// Better Auth keeps its own Mongo connection open; exit explicitly.
process.exit(0)
