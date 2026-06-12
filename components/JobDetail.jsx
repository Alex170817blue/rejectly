'use client'

export default function JobDetail({ job, profile, onBack, onApply, hasApplied }) {
  return (
    <div style={styles.container}>

      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={onBack}>
          ← Back
        </button>
        <div style={styles.companyInitial}>
          {job.company.charAt(0)}
        </div>
      </div>

      {/* Job info */}
      <div style={styles.body}>

        <div style={styles.company}>{job.company}</div>
        <h1 style={styles.title}>{job.title}</h1>

        {/* Pills info */}
        <div style={styles.pillsRow}>
          <span style={styles.pill}>📍 {job.location}</span>
          <span style={styles.pill}>💼 {job.type}</span>
          <span style={{ ...styles.pill, ...styles.pillSalary }}>
            💰 {job.salary}
          </span>
        </div>

        {/* Description */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>About the role</h3>
          <p style={styles.description}>{job.description}</p>
        </div>

        {/* Requirements */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Requirements</h3>
          {job.requirements.map((req, i) => (
            <div key={i} style={styles.reqItem}>
              <span style={styles.reqDot}>•</span>
              <span>{req}</span>
            </div>
          ))}
        </div>

        {/* Warning satirica */}
        <div style={styles.warningBox}>
          <span style={styles.warningIcon}>⚠️</span>
          <p style={styles.warningText}>
            Applying does not guarantee a response. Or respect. Or anything, really.
          </p>
        </div>

      </div>

      {/* Bottom apply bar */}
      <div style={styles.applyBar}>
        {hasApplied ? (
          <div style={styles.appliedBtn}>
            ✓ Applied — now we wait (and suffer)
          </div>
        ) : (
          <button style={styles.applyBtn} onClick={onApply}>
            Apply now
          </button>
        )}
      </div>

    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#F8FAFC',
    paddingBottom: '90px',
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
  },
  companyInitial: {
    width: '42px',
    height: '42px',
    borderRadius: '10px',
    background: '#4E7D9A',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: '700',
  },
  body: {
    padding: '24px 20px',
  },
  company: {
    fontSize: '13px',
    color: '#4E7D9A',
    fontWeight: '600',
    marginBottom: '6px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  title: {
    fontSize: '22px',
    fontWeight: '800',
    color: '#252756',
    lineHeight: '1.3',
    marginBottom: '16px',
  },
  pillsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '24px',
  },
  pill: {
    fontSize: '12px',
    padding: '6px 12px',
    background: '#ffffff',
    border: '1.5px solid #E5E7EB',
    borderRadius: '100px',
    color: '#373333',
    fontWeight: '500',
  },
  pillSalary: {
    background: '#F0FDF4',
    borderColor: '#B7EBF4',
    color: '#1A3465',
  },
  section: {
    marginBottom: '24px',
  },
  sectionTitle: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#252756',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    marginBottom: '12px',
  },
  description: {
    fontSize: '15px',
    color: '#373333',
    lineHeight: '1.7',
  },
  reqItem: {
    display: 'flex',
    gap: '10px',
    fontSize: '14px',
    color: '#373333',
    lineHeight: '1.5',
    marginBottom: '10px',
    alignItems: 'flex-start',
  },
  reqDot: {
    color: '#E24B4A',
    flexShrink: 0,
    fontWeight: '700',
  },
  warningBox: {
    background: '#FFF7ED',
    border: '1.5px solid #FBBF24',
    borderRadius: '12px',
    padding: '14px',
    display: 'flex',
    gap: '10px',
    alignItems: 'flex-start',
    marginTop: '8px',
  },
  warningIcon: {
    fontSize: '16px',
    flexShrink: 0,
  },
  warningText: {
    fontSize: '13px',
    color: '#92400E',
    lineHeight: '1.5',
  },
  applyBar: {
    position: 'fixed',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100%',
    maxWidth: '480px',
    background: '#ffffff',
    borderTop: '1px solid #E5E7EB',
    padding: '16px 20px',
    zIndex: 100,
  },
  applyBtn: {
    width: '100%',
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
  appliedBtn: {
    width: '100%',
    padding: '16px',
    fontSize: '15px',
    fontWeight: '600',
    background: '#F0F9FF',
    color: '#4E7D9A',
    border: '1.5px solid #B7EBF4',
    borderRadius: '12px',
    textAlign: 'center',
  },
}