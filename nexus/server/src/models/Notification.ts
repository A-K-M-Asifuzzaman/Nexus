import { Schema, model, Document, Types } from 'mongoose'

export interface INotification extends Document {
  userId:     Types.ObjectId
  title:      string
  message:    string
  type:       'info' | 'success' | 'warning' | 'error'
  read:       boolean
  actionUrl?: string
  createdAt:  Date
}

const NotificationSchema = new Schema<INotification>(
  {
    userId:    { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title:     { type: String, required: true },
    message:   { type: String, required: true },
    type:      { type: String, enum: ['info', 'success', 'warning', 'error'], default: 'info' },
    read:      { type: Boolean, default: false },
    actionUrl: { type: String },
  },
  { timestamps: true }
)

export const Notification = model<INotification>('Notification', NotificationSchema)
