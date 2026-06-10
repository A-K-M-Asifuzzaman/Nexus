import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Zap, Mail, Lock, User, Check, Github } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '@/store/auth.store'
import { useUIStore } from '@/store/ui.store'
import { authService } from '@/services/auth.service'
import { fadeInUp } from '@/animations/variants'
import { APP_NAME } from '@/constants'

const schema = z.object({
  name:     z.string().min(2, 'Name must be at least 2 characters'),
  email:    z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[0-9]/, 'Must contain a number'),
  agree:    z.literal<boolean>(true, { errorMap: () => ({ message: 'You must accept the terms' }) }),
})
type FormData = z.infer<typeof schema>

const PERKS = [
  'Free 14-day trial — no card required',
  'Unlimited projects on Pro tier',
  'Cancel anytime',
  '24/7 support included',
]

export default function SignupPage() {
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const { setUser, setIdToken } = useAuthStore()
  const { addToast } = useUIStore()
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const handleAuth = async (fn: () => Promise<{ user: import('@/types').User; token: string }>) => {
    setLoading(true)
    try {
      const { user, token } = await fn()
      setUser(user)
      setIdToken(token)
      addToast({ type: 'success', title: 'Account created!', description: 'Welcome to Nexus 🎉' })
      navigate('/onboarding')
    } catch (err: unknown) {
      const fbErr = err as { code?: string; message?: string }
      if (fbErr.code === 'auth/email-already-in-use') {
        addToast({
          type: 'warning',
          title: 'Email already registered',
          description: 'This email has an account. Please sign in instead.',
        })
        navigate('/login')
        return
      }
      const msg =
        fbErr.code === 'auth/weak-password'     ? 'Password must be at least 6 characters.' :
        fbErr.code === 'auth/invalid-email'     ? 'Invalid email address.' :
        fbErr.code === 'auth/network-request-failed' ? 'Network error — check your connection.' :
        fbErr.message || 'Registration failed. Please try again.'
      addToast({ type: 'error', title: 'Sign up failed', description: msg })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left - visuals */}
      <div className="hidden lg:flex flex-1 flex-col justify-center bg-gradient-to-br from-nexus-950 via-background to-background p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh" />
        <div className="absolute top-1/3 right-1/4 h-72 w-72 rounded-full bg-nexus-500/10 blur-3xl animate-blob" />
        <div className="relative z-10 max-w-sm">
          <Link to="/" className="flex items-center gap-2.5 mb-12">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-nexus-500 to-purple-600">
              <Zap className="h-4 w-4 text-white" fill="currentColor" />
            </div>
            <span className="text-xl font-bold font-[Syne]">{APP_NAME}</span>
          </Link>
          <h2 className="text-3xl font-bold mb-3">Join 50,000+ teams building the future</h2>
          <p className="text-muted-foreground mb-8">Everything you need to build, scale, and grow — in one platform.</p>
          <ul className="space-y-3">
            {PERKS.map((perk) => (
              <li key={perk} className="flex items-center gap-3 text-sm">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-nexus-500/20 text-nexus-400">
                  <Check className="h-3 w-3" />
                </div>
                {perk}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right - form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="w-full max-w-sm">
          <div className="lg:hidden mb-8">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-nexus-500 to-purple-600">
                <Zap className="h-4 w-4 text-white" fill="currentColor" />
              </div>
              <span className="text-lg font-bold font-[Syne]">{APP_NAME}</span>
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-1.5">Create your account</h1>
            <p className="text-muted-foreground text-sm">Start your 14-day free trial today</p>
          </div>

          {/* OAuth */}
          <div className="flex gap-3 mb-5">
            <button
              onClick={() => handleAuth(() => authService.loginWithGoogle())}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-sm font-medium disabled:opacity-50"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
            <button
              onClick={() => handleAuth(() => authService.loginWithGithub())}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-sm font-medium disabled:opacity-50"
            >
              <Github className="h-4 w-4" />
              GitHub
            </button>
          </div>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-muted-foreground">or with email</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <form
            onSubmit={handleSubmit((d) => handleAuth(() => authService.register(d.name, d.email, d.password)))}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium mb-1.5">Full name</label>
              <Input {...register('name')} placeholder="Jane Smith" icon={<User className="h-4 w-4" />} error={errors.name?.message} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Work email</label>
              <Input {...register('email')} type="email" placeholder="you@company.com" icon={<Mail className="h-4 w-4" />} error={errors.email?.message} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Password</label>
              <Input
                {...register('password')}
                type={showPwd ? 'text' : 'password'}
                placeholder="Min. 8 chars, 1 uppercase, 1 number"
                icon={<Lock className="h-4 w-4" />}
                rightIcon={
                  <button type="button" onClick={() => setShowPwd(!showPwd)} className="text-muted-foreground hover:text-foreground">
                    {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
                error={errors.password?.message}
              />
            </div>
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="agree"
                {...register('agree')}
                className="mt-0.5 h-4 w-4 rounded border-white/10 bg-white/5 accent-nexus-500"
              />
              <label htmlFor="agree" className="text-xs text-muted-foreground leading-relaxed">
                I agree to the{' '}
                <a href="#" className="text-nexus-400 hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-nexus-400 hover:underline">Privacy Policy</a>
              </label>
            </div>
            {errors.agree && <p className="text-xs text-destructive">{errors.agree.message}</p>}

            <Button type="submit" variant="glow" className="w-full" loading={loading}>
              Create free account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-nexus-400 hover:text-nexus-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
