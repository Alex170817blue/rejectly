'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Landing from '@/components/Landing'
import ProfileForm from '@/components/ProfileForm'
import JobBoard from '@/components/JobBoard'
import JobDetail from '@/components/JobDetail'
import Inbox from '@/components/Inbox'
import EmailView from '@/components/EmailView'
import BadgesPage from '@/components/BadgesPage'
import SettingsPage from '@/components/SettingsPage'

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [screen, setScreen]               = useState('landing')
  const [profile, setProfile]             = useState(null)
  const [selectedJob, setSelectedJob]     = useState(null)
  const [selectedEmail, setSelectedEmail] = useState(null)
  const [inbox, setInbox]                 = useState([])
  const [appliedJobs, setAppliedJobs]     = useState([])
  const [stats, setStats]                 = useState({
    applied: 0, rejected: 0, ghosted: 0, absurd: 0, brutal: 0,
  })

useEffect(() => {
  if (status === 'unauthenticated') {
    setScreen('landing')
  }

  if (status === 'authenticated' && session?.user) {
    // Carica profilo completo dal database
    loadUserProfile(session.user.id)
  }
}, [status, session])

async function loadUserProfile(userId) {
  try {
    const res = await fetch(`/api/user?id=${userId}`)
    const data = await res.json()

    if (data.error || !data.user) {
      // Utente non trovato o non ha completato il profilo
      setScreen('profile')
      return
    }

    const user = data.user

    if (!user.onboarded) {
      // Ha un account ma non ha completato il profilo
      setScreen('profile')
      return
    }

    // Profilo completo — carica tutto
    setProfile({
      id:         user.id,
      name:       user.name,
      email:      user.email,
      role:       user.role,
      experience: user.experience,
      bio:        user.bio,
      photo:      user.photo,
      skills:     user.skills || [],
    })

    // Carica anche le stats
    if (user.stats) {
      setStats({
        applied:  user.stats.applied,
        rejected: user.stats.rejected,
        ghosted:  user.stats.ghosted,
        absurd:   user.stats.absurd,
        brutal:   user.stats.brutal,
      })
    }

    const emailRes = await fetch(`/api/emails?userId=${userId}`)
    const emailData = await emailRes.json()

    if (emailData.emails) {
      const loadedEmails = emailData.emails.map(e => ({
          id:       e.id,
          dbId:     e.id,
          company:  e.company,
          jobTitle: e.jobTitle,
          subject:  e.subject,
          preview:  (e.body || 'No response received.').substring(0, 80) + '...',
          body:     e.body || '',
          type:     e.type,
          time:     new Date(e.createdAt).toLocaleTimeString('en-US', {
            hour: '2-digit', minute: '2-digit'
          }),
          read: e.read,
        }))
        setInbox(loadedEmails)
      }

    setScreen('jobs')

  } catch (err) {
    console.error('Load profile error:', err)
    setScreen('profile')
  }
}

  // Loading
  if (status === 'loading') {
    return (
      <div style={styles.loadingScreen}>
        <div style={styles.spinner} />
        <p style={styles.loadingText}>Loading...</p>
      </div>
    )
  }


  // --- Funzioni ---

  async function handleProfileSave(profileData) {
    try {
      const res = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...profileData,
          id: session?.user?.id,
        }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setProfile({ ...profileData, id: data.user.id })
      setScreen('jobs')
    } catch (err) {
      console.error('Profile save error:', err)
      setProfile(profileData)
      setScreen('jobs')
    }
  }

function handleUpdateProfile(updatedProfile) {
  setProfile(updatedProfile)
  setScreen('badges')
}

  function handleSelectJob(job) {
    setSelectedJob(job)
    setScreen('job-detail')
  }

  async function handleApply(job) {
    if (appliedJobs.includes(job.id)) return
    setAppliedJobs(prev => [...prev, job.id])
    setStats(prev => ({ ...prev, applied: prev.applied + 1 }))

    if (profile?.id) {
      fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: profile.id,
          jobId: job.id,
          jobTitle: job.title,
          company: job.company,
        }),
      }).catch(err => console.error('Apply save error:', err))
    }

    const delay = Math.random() * 5000 + 3000
    setTimeout(async () => {
      try {
        const res = await fetch('/api/generate-rejection', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: profile.name,
            role: profile.role,
            jobTitle: job.title,
            company: job.company,
          }),
        })
        const data = await res.json()

        const isGhost = data.type === 'ghost' || !data.body
        const type = isGhost ? 'ghost'
          : data.type === 'brutal' ? 'brutal'
          : data.type === 'absurd' ? 'absurd'
          : data.type === 'fake'   ? 'fake'
          : 'polite'

        setStats(prev => ({
          ...prev,
          rejected: isGhost ? prev.rejected : prev.rejected + 1,
          ghosted:  isGhost ? prev.ghosted + 1 : prev.ghosted,
          absurd:   type === 'absurd' ? prev.absurd + 1 : prev.absurd,
          brutal:   type === 'brutal' ? prev.brutal + 1 : prev.brutal,
        }))

        const now = new Date()
        const time = now.toLocaleTimeString('en-US', {
          hour: '2-digit', minute: '2-digit',
        })

        const email = {
          id: `email-${Date.now()}`,
          company: job.company,
          jobTitle: job.title,
          subject: isGhost
            ? '(no subject)'
            : `Re: Your application for ${job.title}`,
          preview: isGhost
            ? 'No response received.'
            : (data.body || '').substring(0, 80) + '...',
          body: data.body || '',
          type,
          time,
          read: false,
        }

        if (profile?.id) {
          fetch('/api/emails', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: profile.id,
              company: job.company,
              jobTitle: job.title,
              subject: email.subject,
              body: email.body,
              type,
            }),
          }).catch(err => console.error('Email save error:', err))
        }

        setInbox(prev => [email, ...prev])
      } catch (err) {
        console.error('Rejection error:', err)
      }
    }, delay)
  }

  function handleSelectEmail(email) {
    setInbox(prev =>
      prev.map(e => e.id === email.id ? { ...e, read: true } : e)
    )
    if (email.dbId) {
      fetch('/api/emails', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailId: email.dbId }),
      }).catch(err => console.error('Mark read error:', err))
    }
    setSelectedEmail(email)
    setScreen('email')
  }

  const unreadCount = inbox.filter(e => !e.read).length

  // --- Render ---

  return (
    <>
      {screen === 'landing' && (
        <Landing onStart={() => router.push('/login')} />
      )}

      {screen === 'profile' && (
        <ProfileForm onSave={handleProfileSave} />
      )}

      {screen === 'jobs' && (
        <JobBoard
          profile={profile}
          onSelectJob={handleSelectJob}
          onGoToInbox={() => setScreen('inbox')}
          onGoToBadges={() => setScreen('badges')}
          inboxCount={unreadCount}
        />
      )}

      {screen === 'job-detail' && selectedJob && (
        <JobDetail
          job={selectedJob}
          profile={profile}
          onBack={() => setScreen('jobs')}
          onApply={() => handleApply(selectedJob)}
          hasApplied={appliedJobs.includes(selectedJob.id)}
        />
      )}

      {screen === 'inbox' && (
        <Inbox
          emails={inbox}
          onSelectEmail={handleSelectEmail}
          onGoToJobs={() => setScreen('jobs')}
          onGoToBadges={() => setScreen('badges')}
        />
      )}

      {screen === 'email' && selectedEmail && (
        <EmailView
          email={selectedEmail}
          onBack={() => setScreen('inbox')}
        />
      )}

      {screen === 'badges' && (
        <BadgesPage
          profile={profile}
          stats={stats}
          onGoToJobs={() => setScreen('jobs')}
          onGoToInbox={() => setScreen('inbox')}
          onGoToSettings={() => setScreen('settings')}
          inboxCount={unreadCount}
        />
      )}

      {screen === 'settings' && (
        <SettingsPage
          profile={profile}
          onSave={handleUpdateProfile}
          onBack={() => setScreen('badges')}
        />
      )}
    </>
  )
}

const styles = {
  loadingScreen: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#ffffff',
  },
  spinner: {
    width: '32px',
    height: '32px',
    border: '3px solid #E5E7EB',
    borderTopColor: '#252756',
    borderRadius: '50%',
    marginBottom: '12px',
    animation: 'spin 0.8s linear infinite',
  },
  loadingText: {
    fontSize: '14px',
    color: '#4E7D9A',
  },
}