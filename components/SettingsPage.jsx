'use client'

import { useState, useRef } from 'react'

const SKILLS = [
  'JavaScript', 'React', 'Python', 'Figma', 'SQL',
  'Node.js', 'Marketing', 'Excel', 'Java', 'Management',
  'AI/ML', 'NoCode', 'Sales', 'Leadership', 'CSS'
]

export default function SettingsPage({ profile, onSave, onBack }) {
  const [name, setName]     = useState(profile.name || '')
  const [role, setRole]     = useState(profile.role || '')
  const [bio, setBio]       = useState(profile.bio || '')
  const [skills, setSkills] = useState(profile.skills || [])
  const [photo, setPhoto]   = useState(profile.photo || null)
  const [saved, setSaved]   = useState(false)
  const [customSkill, setCustomSkill] = useState('')

  const fileInputRef = useRef(null)

  function toggleSkill(skill) {
    if (skills.includes(skill)) {
      setSkills(skills.filter(s => s !== skill))
    } else if (skills.length < 10) {
      setSkills([...skills, skill])
    }
  }

  function handleAddCustomSkill() {
    const trimmed = customSkill.trim()
    if (!trimmed) return
    if (skills.includes(trimmed)) return  
    if (skills.length >= 10) {
      alert('Maximum 10 skills.')
      return
    }
    setSkills([...skills, trimmed])
    setCustomSkill('')
  }

  function handlePhotoUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Image too large. Max 5MB.')
      return
    }
    const reader = new FileReader()
    reader.onload = (event) => {
      setPhoto(event.target.result)
    }
    reader.readAsDataURL(file)
  }

async function handleSave() {
  if (!name.trim() || !role.trim()) return

  const updatedProfile = {
    ...profile,
    name: name.trim(),
    role: role.trim(),
    bio: bio.trim(),
    skills,
    photo,
  }

  try {
    // Chiama l'API solo se l'utente ha un id
    if (profile?.id) {
      const res = await fetch('/api/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: profile.id,
          name: updatedProfile.name,
          role: updatedProfile.role,
          bio: updatedProfile.bio,
          photo: updatedProfile.photo,
          skills: updatedProfile.skills,
        }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
    }

    // Aggiorna lo stato nel parent
    onSave(updatedProfile)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)

  } catch (err) {
    console.error('Settings save error:', err)
    alert('Error saving settings. Try again.')
  }
}

  const isValid = name.trim() && role.trim()

  return (
    <div style={styles.container}>

      <div style={styles.header}>
        <button style={styles.backBtn} onClick={onBack}>← Back</button>
        <div style={styles.headerTitle}>Settings</div>
        <div style={{ width: '60px' }} />
      </div>

      <div style={styles.body}>

        {/* Foto profilo */}
        <div style={styles.photoSection}>
          <div style={styles.photoCircle} onClick={() => fileInputRef.current.click()}>
            {photo ? (
              <img src={photo} alt="Profile" style={styles.photoImg} />
            ) : (
              <span style={styles.photoInitial}>
                {name.charAt(0).toUpperCase() || '?'}
              </span>
            )}
            <div style={styles.photoOverlay}>📷</div>
          </div>
          <p style={styles.photoHint}>Tap to change photo</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handlePhotoUpload}
          />
          {photo && (
            <button style={styles.removePhotoBtn} onClick={() => setPhoto(null)}>
              Remove photo
            </button>
          )}
        </div>

        {/* Nome */}
        <label style={styles.label}>Full name</label>
        <input
          style={styles.input}
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          maxLength={50}
          placeholder="John Doe"
        />

        {/* Ruolo */}
        <label style={styles.label}>Desired role</label>
        <input
          style={styles.input}
          type="text"
          value={role}
          onChange={e => setRole(e.target.value)}
          maxLength={60}
          placeholder="e.g. Junior Developer"
        />

        {/* Bio */}
        <label style={styles.label}>Bio</label>
        <textarea
          style={{ ...styles.input, height: '100px', resize: 'none' }}
          value={bio}
          onChange={e => setBio(e.target.value)}
          maxLength={200}
          placeholder="A passionate professional who..."
        />
        <p style={styles.charCount}>{bio.length}/200</p>

        <label style={styles.label}>
          Skills{' '}
          <span style={{ color: '#4E7D9A', fontWeight: 400 }}>
            ({skills.length}/10)
          </span>
        </label>

        {/* Skill predefinite */}
        <div style={styles.skillGrid}>
          {SKILLS.map(skill => {
            const selected = skills.includes(skill)
            return (
              <button
                key={skill}
                onClick={() => toggleSkill(skill)}
                style={{
                  ...styles.skillTag,
                  background:  selected ? '#1A3465' : 'transparent',
                  color:       selected ? '#B7EBF4' : '#4E7D9A',
                  borderColor: selected ? '#1A3465' : '#4E7D9A',
                }}
              >
                {skill}
              </button>
            )
          })}
        </div>

        {/* Skill personalizzate già aggiunte */}
        {skills.filter(s => !SKILLS.includes(s)).length > 0 && (
          <div style={{ ...styles.skillGrid, marginTop: '8px' }}>
            {skills.filter(s => !SKILLS.includes(s)).map(skill => (
              <button
                key={skill}
                onClick={() => toggleSkill(skill)}
                style={{
                  ...styles.skillTag,
                  background: '#1A3465',
                  color: '#B7EBF4',
                  borderColor: '#1A3465',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                {skill} <span style={{ fontSize: '10px' }}>✕</span>
              </button>
            ))}
          </div>
        )}

        {/* Input per aggiungere skill custom */}
        <div style={styles.customSkillRow}>
          <input
            style={{ ...styles.input, flex: 1, marginTop: 0 }}
            type="text"
            placeholder="Add custom skill..."
            value={customSkill}
            onChange={e => setCustomSkill(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') handleAddCustomSkill()
            }}
            maxLength={30}
          />
          <button
            style={styles.addSkillBtn}
            onClick={handleAddCustomSkill}
            disabled={!customSkill.trim()}
          >
            + Add
          </button>
        </div>


        {/* Salva */}
        <button
          style={{
            ...styles.saveBtn,
            opacity: isValid ? 1 : 0.4,
            cursor: isValid ? 'pointer' : 'not-allowed',
            background: saved ? '#1A3465' : '#252756',
          }}
          onClick={handleSave}
          disabled={!isValid}
        >
          {saved ? '✓ Saved!' : 'Save changes'}
        </button>

      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#F8FAFC',
    paddingBottom: '40px',
  },
  header: {
    background: '#252756',
    padding: '48px 20px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    background: 'transparent',
    border: 'none',
    color: '#B7EBF4',
    fontSize: '15px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    padding: 0,
    width: '60px',
  },
  headerTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#ffffff',
  },
  body: {
    padding: '24px 20px',
  },
  photoSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '28px',
  },
  photoCircle: {
    width: '90px',
    height: '90px',
    borderRadius: '50%',
    background: '#4E7D9A',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
    border: '3px solid #B7EBF4',
  },
  photoImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  photoInitial: {
    fontSize: '36px',
    fontWeight: '700',
    color: '#ffffff',
  },
  photoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'rgba(0,0,0,0.45)',
    textAlign: 'center',
    fontSize: '16px',
    padding: '4px 0',
  },
  photoHint: {
    fontSize: '12px',
    color: '#4E7D9A',
    marginTop: '8px',
  },
  removePhotoBtn: {
    marginTop: '6px',
    background: 'transparent',
    border: 'none',
    color: '#E24B4A',
    fontSize: '12px',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  label: {
    display: 'block',
    fontSize: '11px',
    fontWeight: '600',
    color: '#4E7D9A',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    marginTop: '20px',
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
  charCount: {
    fontSize: '11px',
    color: '#6B7280',
    textAlign: 'right',
    marginTop: '4px',
  },
  skillGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '4px',
  },
  skillTag: {
    padding: '7px 16px',
    fontSize: '13px',
    border: '1.5px solid',
    borderRadius: '100px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'all 0.15s',
  },
  saveBtn: {
    marginTop: '32px',
    width: '100%',
    padding: '16px',
    fontSize: '16px',
    fontWeight: '700',
    color: '#ffffff',
    border: 'none',
    borderRadius: '12px',
    fontFamily: 'inherit',
    transition: 'all 0.2s',
  },

  customSkillRow: {
  display: 'flex',
  gap: '8px',
  marginTop: '12px',
  alignItems: 'center',
  },

  addSkillBtn: {
    padding: '12px 16px',
    fontSize: '13px',
    fontWeight: '700',
    background: '#252756',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    whiteSpace: 'nowrap',
  },
}