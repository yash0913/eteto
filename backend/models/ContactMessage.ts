import mongoose, { Schema, models, model } from "mongoose"

export interface IContactMessage extends mongoose.Document {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  createdAt: Date
}

const ContactMessageSchema = new Schema<IContactMessage>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  {
    collection: "contact_messages",
    timestamps: true,
  }
)

const ContactMessage = models.ContactMessage || model<IContactMessage>("ContactMessage", ContactMessageSchema)
export default ContactMessage
