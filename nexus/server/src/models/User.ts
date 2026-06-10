import { Schema, model, Document } from 'mongoose'

export interface IUser extends Document {
  firebaseUid:     string
  name:            string
  email:           string
  avatar?:         string
  role:            'admin' | 'moderator' | 'user'
  plan:            'free' | 'pro' | 'enterprise'
  isEmailVerified: boolean
  stripeCustomerId?: string
  settings: {
    notifications: { email: boolean; push: boolean; marketing: boolean }
    theme:         'dark' | 'light' | 'system'
    language:      string
    timezone:      string
  }
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    firebaseUid:     { type: String, required: true, unique: true, index: true },
    name:            { type: String, required: true, trim: true },
    email:           { type: String, required: true, unique: true, lowercase: true, trim: true },
    avatar:          { type: String },
    role:            { type: String, enum: ['admin', 'moderator', 'user'], default: 'user' },
    plan:            { type: String, enum: ['free', 'pro', 'enterprise'],  default: 'free' },
    isEmailVerified: { type: Boolean, default: false },
    stripeCustomerId:{ type: String },
    settings: {
      notifications: {
        email:     { type: Boolean, default: true },
        push:      { type: Boolean, default: true },
        marketing: { type: Boolean, default: false },
      },
      theme:    { type: String, enum: ['dark', 'light', 'system'], default: 'dark' },
      language: { type: String, default: 'en' },
      timezone: { type: String, default: 'UTC' },
    },
  },
  { timestamps: true }
)

export const User = model<IUser>('User', UserSchema)
