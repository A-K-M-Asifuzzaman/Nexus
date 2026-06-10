import { Router, Request, Response } from 'express'
import { requireAuth } from '../middleware/firebaseAuth'
import { createCheckout, createPortalSession, getInvoices, handleWebhook } from '../controllers/billing.controller'

const router = Router()

// Stripe webhook must receive raw body
router.post('/webhook', handleWebhook)

router.use(requireAuth)
router.post('/checkout', createCheckout)
router.post('/portal',   createPortalSession)
router.get('/invoices',  getInvoices)

export default router
