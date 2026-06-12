'use client'

import { useEffect, useState } from 'react'

export default function Landing({ onStart }) {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    let frame

    const animate =()=> {
      setPhase(performance.now()*0.003)
      frame = requestAnimationFrame(animate)
      }
    

    animate()

    return () => cancelAnimationFrame(frame)
  }, [])

  const d = `
  M0,180
  C240,${180 + Math.sin(phase) * 25}
    480,${120 + Math.sin(phase + 1) * 25}
    720,180
  C960,${240 + Math.sin(phase + 2) * 25}
    1200,${120 + Math.sin(phase + 3) * 25}
    1440,180
  L1440,320
  L0,320
  Z
  `

  return (
    <div style={styles.container}>

      <div style={styles.topSection}>
        <h1 style={styles.title}>
          Are you<br />
          looking for<br />
          a job?
        </h1>
        <button
          style={styles.button}
          onClick={onStart}
          onMouseEnter={e => {
            e.target.style.background = '#252756'
            e.target.style.color = '#ffffff'
          }}
          onMouseLeave={e => {
            e.target.style.background = 'transparent'
            e.target.style.color = '#252756'
          }}
        >
          Get Rejected!
        </button>
      </div>

      <div style={styles.mascotteWrapper}>
        <img
          src="/images/miniman.svg"
          alt="Rejectly mascot"
          style={{ width: '260px', height: 'auto', zIndex:-1 }}
        />
      </div>

      <div style={styles.wave} >
        <svg
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          style={{
            width: '100%',
            height: '100%',
          }}
        >
          <path fill="#B7EBF4" d={d} />
        </svg>
      </div>
    </div>
  )
}

const styles = {
  container: {
    height: '100vh',
    background: '#ffffff',
    position: 'relative',
    overflow: 'hidden',
  },
  topSection: {
    position: 'absolute',
    top: '14%',
    right: '6%',
    textAlign: 'right',
    zIndex: 2,
  },
  title: {
    fontSize: '70px',
    fontWeight: '800',
    lineHeight: '1.15',
    color: '#252756',
    marginBottom: '28px',
  },
  button: {
    background: 'transparent',
    border: '2px solid #252756',
    borderRadius: '100px',
    padding: '12px 24px',
    fontSize: '15px',
    fontWeight: '600',
    color: '#252756',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  mascotteWrapper: {
    position: 'absolute',
    bottom: '15%',
    left: '-10px',
    zIndex: 1,
  },

  wave: {
  position: 'absolute',
  bottom: 0,
  left: 0,
  width: '100%',
  height: '50vh',
  minHeight: '20px',
  zIndex: 1,
  },
}