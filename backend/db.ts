import mongoose from "mongoose"

let isConnected = 0 as 0 | 1

export async function connectDB() {
  if (isConnected) return
  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error("MONGODB_URI is not set")

  if (mongoose.connection.readyState === 1) {
    isConnected = 1
    return
  }

  await mongoose.connect(uri, {
    dbName: process.env.MONGODB_DB || undefined,
  })
  isConnected = 1
}
