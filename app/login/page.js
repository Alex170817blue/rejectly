'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'

export default function LoginPage() {
  const [mode, setMode]       = useState('login') // 'login' | 'register'
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [name, setName]       = useState('')
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    setError('')
    setLoading(true)

    try {
      if (mode === 'register') {
        // Prima registra
        const res = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name }),
        })
        const data = await res.json()
        if (data.error) { setError(data.error); setLoading(false); return }
      }

      // Poi fai login
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid email or password')
      } else {
        window.location.href = '/jobs'
      }
    } catch (err) {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setLoading(true)
    await signIn('google', { callbackUrl: '/jobs' })
  }

  return (
    <div style={styles.container}>

      <div style={styles.header}>
        <h1 style={styles.logo}>
          reject<span style={{ color: '#41b7e6' }}>ly</span>
        </h1>
        <p style={styles.tagline}>
          {mode === 'login' ? 'Welcome back. Still unemployed?' : 'Join the unemployment club.'}
        </p>
      </div>

      <div style={styles.form}>

        {mode === 'register' && (
          <>
            <label style={styles.label}>Full name</label>
            <input
              style={styles.input}
              type="text"
              placeholder="Franz Kafka"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </>
        )}

        <label style={styles.label}>Email</label>
        <input
          style={styles.input}
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <label style={styles.label}>Password</label>
        <input
          style={styles.input}
          type="password"
          placeholder={mode === 'register' ? 'At least 6 characters' : '••••••••'}
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
        />

        {error && (
          <div style={styles.errorBox}>{error}</div>
        )}

        <button
          style={{ ...styles.submitBtn, opacity: loading ? 0.6 : 1 }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Loading...' : mode === 'login' ? 'Sign in' : 'Create account'}
        </button>

        <div style={styles.divider}>
          <div style={styles.dividerLine} />
          <span style={styles.dividerText}>or</span>
          <div style={styles.dividerLine} />
        </div>

        <button style={styles.googleBtn} onClick={handleGoogle} disabled={loading}>
          <span style={{ fontSize: '18px' }}>G</span>
          Continue with Google
        </button>

        <p style={styles.switchText}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            style={styles.switchBtn}
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}
          >
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </p>

      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#ffffff',
    paddingBottom: '40px',
  },
  header: {
    background: '#252756',
    padding: '48px 24px 32px',
    textAlign: 'center',
  },
  logo: {
    fontSize: '36px',
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: '-0.5px',
    marginBottom: '8px',
  },
  tagline: {
    fontSize: '14px',
    color: '#B7EBF4',
    opacity: 0.8,
  },
  form: {
    padding: '32px 24px',
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#4E7D9A',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    marginTop: '16px',
    marginBottom: '6px',
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    fontSize: '15px',
    border: '1.5px solid #E5E7EB',
    borderRadius: '10px',
    fontFamily: 'inherit',
    color: '#373333',
    outline: 'none',
    background: '#ffffff',
  },
  errorBox: {
    marginTop: '12px',
    padding: '10px 14px',
    background: '#FEF2F2',
    border: '1px solid #FECACA',
    borderRadius: '8px',
    fontSize: '13px',
    color: '#991B1B',
  },
  submitBtn: {
    marginTop: '24px',
    padding: '16px',
    fontSize: '16px',
    fontWeight: '700',
    background: '#252756',
    color: '#ffffff',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    margin: '24px 0',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    background: '#E5E7EB',
  },
  dividerText: {
    fontSize: '13px',
    color: '#6B7280',
  },
  googleBtn: {
    width: '100%',
    padding: '14px',
    fontSize: '15px',
    fontWeight: '600',
    background: '#ffffff',
    color: '#373333',
    border: '1.5px solid #E5E7EB',
    borderRadius: '12px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
  },
  switchText: {
    textAlign: 'center',
    marginTop: '24px',
    fontSize: '14px',
    color: '#6B7280',
  },
  switchBtn: {
    background: 'none',
    border: 'none',
    color: '#252756',
    fontWeight: '700',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: '14px',
  },
}