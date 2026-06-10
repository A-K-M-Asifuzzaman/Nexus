import dotenv from 'dotenv'
dotenv.config()

export const config = {
  port:       process.env.PORT       || 5000,
  nodeEnv:    process.env.NODE_ENV   || 'development',
  mongoUri:   process.env.MONGO_URI  || 'mongodb://localhost:27017/nexus',
  clientUrl:  process.env.CLIENT_URL || 'http://localhost:3000',

  stripe: {
    secretKey:     process.env.STRIPE_SECRET_KEY     || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
    prices: {
      proMonthly:        process.env.STRIPE_PRICE_PRO_MONTHLY    || '',
      proYearly:         process.env.STRIPE_PRICE_PRO_YEARLY     || '',
      enterpriseMonthly: process.env.STRIPE_PRICE_ENT_MONTHLY    || '',
      enterpriseYearly:  process.env.STRIPE_PRICE_ENT_YEARLY     || '',
    },
  },

  firebase: {
    projectId:     process.env.FIREBASE_PROJECT_ID     || '',
    clientEmail:   process.env.FIREBASE_CLIENT_EMAIL   || '',
    privateKey:    (process.env.FIREBASE_PRIVATE_KEY   || '').replace(/\\n/g, '\n'),
  },

  smtp: {
    host:  process.env.SMTP_HOST  || 'smtp.gmail.com',
    port:  parseInt(process.env.SMTP_PORT || '587'),
    user:  process.env.SMTP_USER  || '',
    pass:  process.env.SMTP_PASS  || '',
    from:  process.env.FROM_NAME  || 'Nexus',
  },
}
