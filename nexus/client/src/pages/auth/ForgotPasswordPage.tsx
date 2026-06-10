import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, ArrowLeft, Zap, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useUIStore } from '@/store/ui.store'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { fadeInUp } from '@/animations/variants'
import { APP_NAME } from '@/constants'

const schema = z.object({ email: z.string().email('Invalid email address') })
type FormData = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [sent, setSent]       = useState(false)
  const { addToast } = useUIStore()

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async ({ email }: FormData) => {
    setLoading(true)
    try {
      await sendPasswordResetEmail(auth, email)
      setSent(true)
    } catch {
      addToast({ type: 'error', title: 'Error', description: 'Failed to send reset email. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="w-full max-w-sm">
        <Link to="/" className="flex items-center gap-2.5 mb-8">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-nexus-500 to-purple-600">
            <Zap className="h-4 w-4 text-white" fill="currentColor" />
          </div>
          <span className="text-lg font-bold font-[Syne]">{APP_NAME}</span>
        </Link>

        {sent ? (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10 text-green-400">
              <CheckCircle className="h-7 w-7" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Check your inbox</h1>
            <p className="text-sm text-muted-foreground mb-6">
              We sent a password reset link. It may take a minute to arrive.
            </p>
            <Link to="/login" className="inline-flex items-center gap-2 text-sm text-nexus-400 hover:text-nexus-300 transition-colors font-medium">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to sign in
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-2xl font-bold mb-1.5">Reset your password</h1>
              <p className="text-sm text-muted-foreground">Enter your email and we'll send a reset link.</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Email</label>
                <Input {...register('email')} type="email" placeholder="you@company.com" icon={<Mail className="h-4 w-4" />} error={errors.email?.message} />
              </div>
              <Button type="submit" variant="glow" className="w-full" loading={loading}>
                Send reset link
              </Button>
            </form>
            <div className="mt-6 text-center">
              <Link to="/login" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to sign in
              </Link>
            </div>
          </>
        )}
      </motion.div>
    </div>
  )
}
