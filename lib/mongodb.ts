import { MongoClient, type Db } from "mongodb"

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

const uri = process.env.MONGODB_URI
if (!uri) {
  throw new Error("Missing MONGODB_URI. Add it in Project Settings or .env.")
}
const dbName = process.env.MONGODB_DB || "auth_app"

let clientPromise: Promise<MongoClient>
if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise!
} else {
  const client = new MongoClient(uri)
  clientPromise = client.connect()
}

export async function getDb(): Promise<Db> {
  const client = await clientPromise
  return client.db(dbName)
}
