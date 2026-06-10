import { Schema, model, Document, Types } from 'mongoose'

export interface ISubscription extends Document {
  userId:                Types.ObjectId
  plan:                  'free' | 'pro' | 'enterprise'
  status:                'active' | 'trialing' | 'past_due' | 'canceled' | 'incomplete'
  stripeCustomerId:      string
  stripeSubscriptionId?: string
  stripePriceId?:        string
  currentPeriodStart?:   Date
  currentPeriodEnd?:     Date
  cancelAtPeriodEnd:     boolean
  trialEnd?:             Date
  createdAt:             Date
  updatedAt:             Date
}

const SubscriptionSchema = new Schema<ISubscription>(
  {
    userId:               { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    plan:                 { type: String, enum: ['free', 'pro', 'enterprise'], default: 'free' },
    status:               { type: String, enum: ['active', 'trialing', 'past_due', 'canceled', 'incomplete'], default: 'active' },
    stripeCustomerId:     { type: String, required: true },
    stripeSubscriptionId: { type: String },
    stripePriceId:        { type: String },
    currentPeriodStart:   { type: Date },
    currentPeriodEnd:     { type: Date },
    cancelAtPeriodEnd:    { type: Boolean, default: false },
    trialEnd:             { type: Date },
  },
  { timestamps: true }
)

export const Subscription = model<ISubscription>('Subscription', SubscriptionSchema)
