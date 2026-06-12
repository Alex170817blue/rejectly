'use client'

import { useState, useEffect } from 'react'
import JobCard from './JobCard'

export default function JobBoard({ profile, onSelectJob, onGoToInbox, onGoToBadges, inboxCount }) {

  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await fetch('/api/generate-job', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(profile),
        })
        const data = await res.json()
        if (data.error) throw new Error(data.error)
        // Protezione: se jobs non è un array, usa []
        setJobs(Array.isArray(data.jobs) ? data.jobs : [])
      } catch (err) {
        console.error('fetchJobs error:', err)
        setError(err.message || 'Failed to load jobs. Even the AI rejected you.')
      } finally {
        setLoading(false)
      }
    }
    fetchJobs()
  }, [])

  // Protezione extra: se per qualsiasi motivo jobs non è un array
  const safeJobs = Array.isArray(jobs) ? jobs : []

  return (
    <div style={styles.container}>

      <div style={styles.header}>
        <div>
          <div style={styles.greeting}>Hi, {profile.name} </div>
          <div style={styles.subtitle}>Here are today's opportunities</div>
        </div>
      </div>

      {!loading && !error && (
        <div style={styles.statsBar}>
          <div style={styles.statItem}>
            <span style={styles.statNum}>{safeJobs.length}</span>
            <span style={styles.statLabel}>jobs</span>
          </div>
          <div style={styles.statDivider} />
          <div style={styles.statItem}>
            <span style={styles.statNum}>0%</span>
            <span style={styles.statLabel}>success rate</span>
          </div>
          <div style={styles.statDivider} />
          <div style={styles.statItem}>
            <span style={styles.statNum}>{inboxCount}</span>
            <span style={styles.statLabel}>rejections</span>
          </div>
        </div>
      )}

      <div style={styles.list}>
        {loading && (
          <div style={styles.loadingBox}>
            <div style={styles.spinner} />
            <p style={styles.loadingText}>Finding jobs you won't get...</p>
          </div>
        )}

        {error && (
          <div style={styles.errorBox}>
            <p style={{ marginBottom: '8px' }}>⚠️ {error}</p>
            <p style={{ fontSize: '12px', color: '#4E7D9A' }}>
              Make sure Ollama is running: <code>ollama run llama3.2</code>
            </p>
          </div>
        )}

        {!loading && !error && safeJobs.length === 0 && (
          <div style={styles.errorBox}>
            Even AI can't find jobs for you
          </div>
        )}

        {!loading && !error && safeJobs.map(job => (
          <JobCard
            key={job.id}
            job={job}
            onClick={() => onSelectJob(job)}
          />
        ))}
      </div>

      <div style={styles.bottomNav}>
        <button style={{ ...styles.navBtn, ...styles.navBtnActive }}>
          <img
            src="/images/jobsearch.svg"
            alt="jobs board"
            style={{
              width: '40%',
              height: '40%',
            }}
          />
        </button>
        <button style={styles.navBtn} onClick={onGoToInbox}>
          <img
            src="/images/inbox.svg"
            alt="inbox"
            style={{
              width: '40%',
              height: '40%',
            }}
          />
        </button>
        <button style={styles.navBtn} onClick={onGoToBadges}>
          <img
            src="/images/profile.svg"
            alt="profile"
            style={{
              width: '40%',
              height: '40%',
            }}
          />
        </button>
      </div>

    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#F8FAFC',
    paddingBottom: '80px',
  },
  header: {
    background: '#252756',
    padding: '48px 20px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  greeting: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: '13px',
    color: '#B7EBF4',
    marginTop: '2px',
  },
  
  statsBar: {
    background: '#ffffff',
    margin: '16px',
    borderRadius: '14px',
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    border: '1.5px solid #E5E7EB',
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2px',
  },
  statNum: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#252756',
  },
  statLabel: {
    fontSize: '11px',
    color: '#4E7D9A',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  statDivider: {
    width: '1px',
    height: '30px',
    background: '#E5E7EB',
  },
  list: {
    padding: '0 16px',
  },
  loadingBox: {
    textAlign: 'center',
    padding: '48px 0',
  },
  spinner: {
    width: '32px',
    height: '32px',
    border: '3px solid #E5E7EB',
    borderTopColor: '#252756',
    borderRadius: '50%',
    margin: '0 auto 16px',
    animation: 'spin 0.8s linear infinite',
  },
  loadingText: {
    fontSize: '14px',
    color: '#4E7D9A',
  },
  errorBox: {
    textAlign: 'center',
    padding: '32px',
    color: '#E24B4A',
    fontSize: '14px',
  },
  bottomNav: {
    position: 'fixed',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100%',
    maxWidth: '480px',
    background: '#ffffff',
    borderTop: '1px solid #E5E7EB',
    display: 'flex',
    zIndex: 100,
  },
  navBtn: {
    flex: 1,
    padding: '14px 0',
    border: 'none',
    background: 'transparent',
    fontSize: '12px',
    color: '#4E7D9A',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    fontFamily: 'inherit',
    fontWeight: '500',
  },
  navBtnActive: {
    color: '#252756',
    fontWeight: '700',
  },
  badge: {
    background: '#E24B4A',
    color: '#ffffff',
    fontSize: '10px',
    fontWeight: '700',
    padding: '2px 6px',
    borderRadius: '100px',
  },
}