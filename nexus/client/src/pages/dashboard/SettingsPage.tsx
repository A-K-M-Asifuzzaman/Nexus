import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { User, Lock, Bell, Palette, Globe, Shield, Trash2, Camera } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuthStore } from '@/store/auth.store'
import { useUIStore } from '@/store/ui.store'
import { getInitials } from '@/lib/utils'
import { cn } from '@/lib/utils'

const TABS = [
  { id: 'profile',       label: 'Profile',       icon: User },
  { id: 'security',      label: 'Security',      icon: Lock },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'appearance',    label: 'Appearance',    icon: Palette },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')
  const { user } = useAuthStore()
  const { addToast, theme, setTheme } = useUIStore()

  const { register, handleSubmit } = useForm({
    defaultValues: { name: user?.name || '', email: user?.email || '' }
  })

  const onSave = () => {
    addToast({ type: 'success', title: 'Settings saved', description: 'Your changes have been saved.' })
  }

  return (
    <div>
      <PageHeader title="Settings" description="Manage your account preferences and security." />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tab sidebar */}
        <div className="lg:w-56 shrink-0">
          <nav className="space-y-1">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                  activeTab === id
                    ? 'bg-nexus-500/10 text-nexus-400 border border-nexus-500/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'profile' && (
              <div className="space-y-5">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Picture</CardTitle>
                    <CardDescription>Your profile photo is visible to team members.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-5">
                      <div className="relative">
                        <Avatar className="h-16 w-16 ring-2 ring-nexus-500/20">
                          <AvatarImage src={user?.avatar} />
                          <AvatarFallback className="text-xl">{getInitials(user?.name || 'U')}</AvatarFallback>
                        </Avatar>
                        <button className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-nexus-500 text-white">
                          <Camera className="h-2.5 w-2.5" />
                        </button>
                      </div>
                      <div>
                        <Button variant="outline" size="sm">Upload photo</Button>
                        <p className="mt-1 text-xs text-muted-foreground">PNG or JPG, max 2MB</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your name and contact details.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit(onSave)} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1.5">Full name</label>
                          <Input {...register('name')} placeholder="Jane Smith" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1.5">Email address</label>
                          <Input {...register('email')} type="email" placeholder="jane@company.com" disabled />
                        </div>
                      </div>
                      <Button type="submit" variant="glow" size="sm">Save changes</Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-5">
                <Card>
                  <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>Your Firebase account password is managed separately.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Current password</label>
                      <Input type="password" placeholder="••••••••" icon={<Lock className="h-4 w-4" />} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">New password</label>
                      <Input type="password" placeholder="Min. 8 characters" icon={<Lock className="h-4 w-4" />} />
                    </div>
                    <Button variant="glow" size="sm">Update password</Button>
                  </CardContent>
                </Card>

                <Card className="border-destructive/20">
                  <CardHeader>
                    <CardTitle className="text-destructive">Danger Zone</CardTitle>
                    <CardDescription>These actions are permanent and cannot be undone.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="destructive" size="sm" className="gap-2">
                      <Trash2 className="h-4 w-4" />
                      Delete account
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'notifications' && (
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Control when and how you receive notifications.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { label: 'Email notifications',       desc: 'Receive updates via email' },
                      { label: 'Push notifications',        desc: 'Browser push notifications' },
                      { label: 'Project activity',          desc: 'When someone updates a project' },
                      { label: 'Team invitations',          desc: 'When someone invites you' },
                      { label: 'Billing & invoices',        desc: 'Payment and subscription updates' },
                      { label: 'Product announcements',     desc: 'New features and updates from Nexus' },
                    ].map(({ label, desc }, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                        <div>
                          <p className="text-sm font-medium">{label}</p>
                          <p className="text-xs text-muted-foreground">{desc}</p>
                        </div>
                        <input type="checkbox" defaultChecked={i < 4} className="h-4 w-4 rounded accent-nexus-500" />
                      </div>
                    ))}
                  </div>
                  <Button variant="glow" size="sm" className="mt-4" onClick={onSave}>Save preferences</Button>
                </CardContent>
              </Card>
            )}

            {activeTab === 'appearance' && (
              <Card>
                <CardHeader>
                  <CardTitle>Appearance</CardTitle>
                  <CardDescription>Choose how Nexus looks to you.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {(['dark', 'light'] as const).map(t => (
                      <button
                        key={t}
                        onClick={() => setTheme(t)}
                        className={cn(
                          'flex flex-col items-center gap-2 rounded-xl border p-4 transition-all',
                          theme === t ? 'border-nexus-500/50 bg-nexus-500/10' : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                        )}
                      >
                        <div className={cn('h-16 w-full rounded-lg border', t === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200')} />
                        <span className="text-sm font-medium capitalize">{t}</span>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
