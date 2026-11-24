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
  const existing = await users.findOne({ email })
  let userId: string

  if (existing) {
    userId = String(existing._id)
    console.log(`[seed-admin] Found existing user ${email}; promoting it.`)
  } else {
    const result = await auth.api.signUpEmail({
      body: { name, email, password },
    })

    userId = result.user.id
    console.log(`[seed-admin] Created administrator ${email}.`)
  }

  // Guarantee the role and verification state, even for older accounts.
  await users.updateOne(
    { email },
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
    userId,
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
      accountId: userId,
      providerId: "credential",
      userId,
      password: passwordHash,
      createdAt: now,
      updatedAt: now,
    })
  }

  console.log("[seed-admin] Administrator is ready:")
  console.log(`  email: ${email}`)
  console.log('  role:  admin')
} finally {
  await client.close()
}

// Better Auth keeps its own Mongo connection open; exit explicitly.
process.exit(0)
