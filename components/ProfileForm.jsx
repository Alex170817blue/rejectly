'use client'

import { useState } from 'react'

const SKILLS = [
  'Team Work','Time Management', 'JavaScript', 'React', 'Python', 'Figma', 'SQL',
  'Node.js', 'Marketing', 'Excel', 'Java', 'Management', 
  'AI/ML', 'NoCode', 'Sales', 'Leadership', 'CSS'
]

export default function ProfileForm({ onSave }) {
  const [name, setName]      = useState('')
  const [role, setRole]      = useState('')
  const [experience, setExp] = useState('2')
  const [bio, setBio]        = useState('')
  const [skills, setSkills]  = useState([])
  const [customSkill, setCustomSkill] = useState('')

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
  if (skills.includes(trimmed)) return // evita duplicati
  if (skills.length >= 10) return      // rispetta il limite
  setSkills([...skills, trimmed])
  setCustomSkill('')                   // svuota l'input
}

  function handleSubmit() {
    if (!name.trim() || !role.trim()) return
    onSave({ name, role, experience, bio, skills })
  }

  const isValid = name.trim() && role.trim()

  return (
    <div style={styles.container}>

      <div style={styles.header}>
        <h2 style={styles.title}>Create your profile</h2>
        <p style={styles.subtitle}>We'll use this to personalize your rejections.</p>
      </div>

      <div style={styles.form}>

        <label style={styles.label}>Your name</label>
        <input
          style={styles.input}
          type="text"
          placeholder="Franz Kafka"
          value={name}
          onChange={e => setName(e.target.value)}
          maxLength={50}
        />

        <label style={styles.label}>Desired role</label>
        <input
          style={styles.input}
          type="text"
          placeholder="Junior Developer"
          value={role}
          onChange={e => setRole(e.target.value)}
          maxLength={60}
        />

        <label style={styles.label}>Years of experience</label>
        <select
          style={styles.input}
          value={experience}
          onChange={e => setExp(e.target.value)}
        >
          <option value="0">No experience</option>
          <option value="1">1 year</option>
          <option value="2">2–3 years</option>
          <option value="5">5+ years</option>
          <option value="10">10+ years (overqualified)</option>
        </select>

        <label style={styles.label}>
          Your skills{' '}
          <span style={{ color: '#4E7D9A', fontWeight: 400 }}>
            ({skills.length}/5)
          </span>
        </label>

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

        <label style={styles.label}>About you (optional)</label>
        <textarea
          style={{ ...styles.input, height: '80px', resize: 'none' }}
          placeholder="Tell us about yourself"
          value={bio}
          onChange={e => setBio(e.target.value)}
          maxLength={200}
        />

        <button
          style={{
            ...styles.submitBtn,
            opacity: isValid ? 1 : 0.4,
            cursor:  isValid ? 'pointer' : 'not-allowed',
          }}
          onClick={handleSubmit}
          disabled={!isValid}
        >
          Start getting rejected →
        </button>

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
    color: '#ffffff',
  },
  title: {
    fontSize: '26px',
    fontWeight: '700',
    marginBottom: '8px',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: '14px',
    opacity: 0.7,
    lineHeight: '1.5',
    color: '#ffffff',
  },
  form: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
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

  submitBtn: {
    marginTop: '32px',
    padding: '16px',
    fontSize: '16px',
    fontWeight: '700',
    background: '#252756',
    color: '#ffffff',
    border: 'none',
    borderRadius: '12px',
    fontFamily: 'inherit',
    transition: 'opacity 0.2s',
  },
}