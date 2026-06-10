import { motion } from 'framer-motion'
import { CreditCard, Download, Check, Zap, ArrowUpRight, Calendar, DollarSign } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuthStore } from '@/store/auth.store'
import { PLANS } from '@/constants'
import { formatCurrency, formatDate } from '@/lib/utils'

const INVOICES = [
  { id: 'INV-001', date: '2024-01-01', amount: 290, status: 'paid' },
  { id: 'INV-002', date: '2024-02-01', amount: 290, status: 'paid' },
  { id: 'INV-003', date: '2024-03-01', amount: 290, status: 'paid' },
  { id: 'INV-004', date: '2024-04-01', amount: 290, status: 'open' },
]

export default function BillingPage() {
  const { user } = useAuthStore()
  const plan = PLANS[user?.plan || 'free']

  return (
    <div>
      <PageHeader title="Billing & Plans" description="Manage your subscription and payment methods." />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Current plan */}
        <div className="lg:col-span-2 space-y-5">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card gradient>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Current Plan</CardTitle>
                    <CardDescription>Your subscription details</CardDescription>
                  </div>
                  <Badge variant="success">{user?.plan?.toUpperCase() || 'FREE'}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-3xl font-bold">{formatCurrency(plan.price.yearly)}<span className="text-sm font-normal text-muted-foreground">/yr</span></p>
                    <p className="text-xs text-muted-foreground mt-0.5">Renews April 1, 2025</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Cancel plan</Button>
                    <Button variant="glow" size="sm" className="gap-1.5">
                      <ArrowUpRight className="h-3.5 w-3.5" />
                      Upgrade
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                  {[
                    { label: 'Projects',    value: user?.plan === 'free' ? '3/3' : '∞' },
                    { label: 'Members',     value: user?.plan === 'enterprise' ? '∞' : '10/10' },
                    { label: 'Storage',     value: '12 GB used' },
                    { label: 'API calls',   value: '48.2K/mo' },
                  ].map(({ label, value }) => (
                    <div key={label} className="text-center">
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="text-sm font-semibold mt-0.5">{value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Invoices */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardHeader>
                <CardTitle>Invoice History</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-white/5">
                  {INVOICES.map((inv) => (
                    <div key={inv.id} className="flex items-center justify-between px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{inv.id}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(inv.date)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-semibold">{formatCurrency(inv.amount)}</span>
                        <Badge variant={inv.status === 'paid' ? 'success' : 'warning'}>{inv.status}</Badge>
                        <button className="text-muted-foreground hover:text-foreground transition-colors">
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Payment method & upgrade */}
        <div className="space-y-5">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 p-3 rounded-xl border border-white/10 bg-white/5 mb-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-nexus-500/20 to-purple-500/20">
                    <CreditCard className="h-4 w-4 text-nexus-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">•••• •••• •••• 4242</p>
                    <p className="text-xs text-muted-foreground">Expires 12/26</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">Manage via Stripe</Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Upgrade CTA */}
          {user?.plan !== 'enterprise' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <Card className="border-nexus-500/20 bg-gradient-to-b from-nexus-500/5 to-transparent">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-nexus-500/50 to-transparent rounded-t-2xl" />
                <CardContent className="pt-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-nexus-500/10 mb-3">
                    <Zap className="h-5 w-5 text-nexus-400" fill="currentColor" />
                  </div>
                  <h4 className="font-semibold mb-1.5">Upgrade to Enterprise</h4>
                  <p className="text-xs text-muted-foreground mb-4">Unlimited everything, dedicated support, and a 99.99% uptime SLA.</p>
                  <ul className="space-y-1.5 mb-5">
                    {['Unlimited members', 'SSO / SAML', 'Custom integrations', 'Audit logs'].map(f => (
                      <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Check className="h-3 w-3 text-nexus-400" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button variant="glow" size="sm" className="w-full">Upgrade now</Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
