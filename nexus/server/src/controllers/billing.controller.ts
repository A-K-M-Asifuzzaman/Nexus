import { Request, Response } from 'express'
import Stripe from 'stripe'
import { config } from '../config'
import { User } from '../models/User'
import { Subscription } from '../models/Subscription'
import { AuthRequest } from '../middleware/firebaseAuth'

const stripe = new Stripe(config.stripe.secretKey, { apiVersion: '2023-10-16' })

const PRICE_MAP: Record<string, Record<string, string>> = {
  pro:        { monthly: config.stripe.prices.proMonthly,        yearly: config.stripe.prices.proYearly },
  enterprise: { monthly: config.stripe.prices.enterpriseMonthly, yearly: config.stripe.prices.enterpriseYearly },
}

export async function createCheckout(req: AuthRequest, res: Response) {
  try {
    const { plan, interval } = req.body as { plan: 'pro' | 'enterprise'; interval: 'monthly' | 'yearly' }
    const user = await User.findById(req.user!._id)
    if (!user) return res.status(404).json({ success: false, message: 'User not found' })

    const priceId = PRICE_MAP[plan]?.[interval]
    if (!priceId) return res.status(400).json({ success: false, message: 'Invalid plan' })

    const session = await stripe.checkout.sessions.create({
      customer:            user.stripeCustomerId,
      payment_method_types:['card'],
      line_items:          [{ price: priceId, quantity: 1 }],
      mode:                'subscription',
      success_url:         `${config.clientUrl}/dashboard/billing?success=1`,
      cancel_url:          `${config.clientUrl}/dashboard/billing?canceled=1`,
      subscription_data:   { trial_period_days: 14 },
      metadata:            { userId: req.user!._id, plan, interval },
    })

    return res.json({ success: true, data: { url: session.url } })
  } catch (err) {
    console.error('checkout error:', err)
    return res.status(500).json({ success: false, message: 'Billing error' })
  }
}

export async function createPortalSession(req: AuthRequest, res: Response) {
  try {
    const user = await User.findById(req.user!._id)
    if (!user) return res.status(404).json({ success: false, message: 'User not found' })

    const session = await stripe.billingPortal.sessions.create({
      customer:   user.stripeCustomerId!,
      return_url: `${config.clientUrl}/dashboard/billing`,
    })

    return res.json({ success: true, data: { url: session.url } })
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Portal error' })
  }
}

export async function getInvoices(req: AuthRequest, res: Response) {
  try {
    const user = await User.findById(req.user!._id)
    if (!user?.stripeCustomerId) return res.json({ success: true, data: [] })

    const invoices = await stripe.invoices.list({ customer: user.stripeCustomerId, limit: 20 })

    const mapped = invoices.data.map((inv) => ({
      _id:        inv.id,
      amount:     inv.amount_paid / 100,
      currency:   inv.currency.toUpperCase(),
      status:     inv.status,
      invoiceUrl: inv.hosted_invoice_url,
      pdfUrl:     inv.invoice_pdf,
      createdAt:  new Date(inv.created * 1000).toISOString(),
    }))

    return res.json({ success: true, data: mapped })
  } catch {
    return res.status(500).json({ success: false, message: 'Failed to fetch invoices' })
  }
}

export async function handleWebhook(req: Request, res: Response) {
  const sig = req.headers['stripe-signature'] as string

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, config.stripe.webhookSecret)
  } catch {
    return res.status(400).json({ error: 'Invalid signature' })
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const userId  = session.metadata?.userId
      const plan    = session.metadata?.plan as 'pro' | 'enterprise'
      if (userId && plan) {
        await User.findByIdAndUpdate(userId, { plan })
        await Subscription.findOneAndUpdate(
          { userId },
          {
            plan,
            status:                'trialing',
            stripeSubscriptionId:  session.subscription as string,
            stripeCustomerId:      session.customer as string,
          },
          { upsert: true }
        )
      }
      break
    }
    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      await Subscription.findOneAndUpdate(
        { stripeSubscriptionId: sub.id },
        { status: 'canceled', plan: 'free' }
      )
      const dbSub = await Subscription.findOne({ stripeSubscriptionId: sub.id })
      if (dbSub) await User.findByIdAndUpdate(dbSub.userId, { plan: 'free' })
      break
    }
  }

  return res.json({ received: true })
}
