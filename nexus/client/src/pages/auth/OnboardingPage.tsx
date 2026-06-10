import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Building2, Briefcase, Users, ArrowRight, Check, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '@/store/auth.store'
import { APP_NAME } from '@/constants'
import { cn } from '@/lib/utils'

const STEPS = ['Welcome', 'About You', 'Team Size', 'Use Case']

const roles = ['Engineering', 'Product', 'Design', 'Marketing', 'Sales', 'Operations', 'Finance', 'Other']
const sizes = ['Just me', '2–10', '11–50', '51–200', '200+']
const useCases = [
  { icon: Building2, label: 'Project Management' },
  { icon: Briefcase, label: 'Analytics & Reporting' },
  { icon: Users,     label: 'Team Collaboration' },
  { icon: Zap,       label: 'Product Development' },
]

export default function OnboardingPage() {
  const [step, setStep]             = useState(0)
  const [orgName, setOrgName]       = useState('')
  const [role, setRole]             = useState('')
  const [size, setSize]             = useState('')
  const [useCase, setUseCase]       = useState('')
  const { user } = useAuthStore()
  const navigate = useNavigate()

  const next = () => {
    if (step < STEPS.length - 1) setStep(s => s + 1)
    else navigate('/dashboard')
  }

  const canContinue = () => {
    if (step === 1) return orgName.trim().length > 0 && role
    if (step === 2) return !!size
    if (step === 3) return !!useCase
    return true
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden p-4">
      <div className="absolute inset-0 bg-mesh" />
      <div className="absolute top-1/3 left-1/4 h-96 w-96 rounded-full bg-nexus-500/8 blur-[120px] animate-blob" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-all', i < step ? 'bg-nexus-500 text-white' : i === step ? 'border-2 border-nexus-500 text-nexus-400' : 'border border-white/10 text-muted-foreground')}>
                {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </div>
              {i < STEPS.length - 1 && <div className={cn('flex-1 h-px transition-all', i < step ? 'bg-nexus-500' : 'bg-white/10')} />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-8"
          >
            {step === 0 && (
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-nexus-500 to-purple-600 shadow-lg shadow-nexus-500/30">
                  <Zap className="h-7 w-7 text-white" fill="currentColor" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Welcome to {APP_NAME}!</h1>
                <p className="text-muted-foreground text-sm mb-2">
                  Hey <span className="text-foreground font-medium">{user?.name?.split(' ')[0]}</span> 👋 Let's set up your workspace in about 60 seconds.
                </p>
              </div>
            )}

            {step === 1 && (
              <div>
                <h2 className="text-xl font-bold mb-1">Tell us about your team</h2>
                <p className="text-sm text-muted-foreground mb-6">We'll personalize your experience.</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Organization name</label>
                    <Input value={orgName} onChange={e => setOrgName(e.target.value)} placeholder="Acme Corp" icon={<Building2 className="h-4 w-4" />} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Your role</label>
                    <div className="flex flex-wrap gap-2">
                      {roles.map(r => (
                        <button
                          key={r}
                          onClick={() => setRole(r)}
                          className={cn('rounded-full border px-3 py-1.5 text-xs font-medium transition-all', role === r ? 'border-nexus-500/50 bg-nexus-500/10 text-nexus-400' : 'border-white/10 text-muted-foreground hover:border-white/20 hover:text-foreground')}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-xl font-bold mb-1">How big is your team?</h2>
                <p className="text-sm text-muted-foreground mb-6">We'll optimize your workspace settings.</p>
                <div className="space-y-2">
                  {sizes.map(s => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={cn('flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium transition-all', size === s ? 'border-nexus-500/50 bg-nexus-500/10 text-nexus-400' : 'border-white/10 hover:border-white/20 hover:bg-white/5')}
                    >
                      <span>{s}</span>
                      {size === s && <Check className="h-4 w-4" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="text-xl font-bold mb-1">What will you use Nexus for?</h2>
                <p className="text-sm text-muted-foreground mb-6">Select your primary use case.</p>
                <div className="grid grid-cols-2 gap-3">
                  {useCases.map(({ icon: Icon, label }) => (
                    <button
                      key={label}
                      onClick={() => setUseCase(label)}
                      className={cn('flex flex-col items-center gap-3 rounded-xl border p-5 text-xs font-medium transition-all', useCase === label ? 'border-nexus-500/50 bg-nexus-500/10 text-nexus-400' : 'border-white/10 hover:border-white/20 hover:bg-white/5 text-muted-foreground hover:text-foreground')}
                    >
                      <Icon className="h-6 w-6" />
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between mt-5">
          {step > 0
            ? <button onClick={() => setStep(s => s - 1)} className="text-sm text-muted-foreground hover:text-foreground transition-colors">← Back</button>
            : <div />
          }
          <Button
            variant="glow"
            onClick={next}
            disabled={!canContinue()}
            className="gap-2"
          >
            {step === STEPS.length - 1 ? 'Go to Dashboard' : 'Continue'}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
