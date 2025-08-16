import mongoose, { Schema, models, model } from "mongoose"

export interface IUser extends mongoose.Document {
  name: string
  email: string
  phone?: string
  passwordHash: string
  createdAt: Date
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  phone: { type: String },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
})

const User = models.User || model<IUser>("User", UserSchema)
export default User
