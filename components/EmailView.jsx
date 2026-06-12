'use client'

const TYPE_LABELS = {
  ghost: 'Ghosted',
  polite: 'Polite rejection',
  brutal: 'Brutally honest',
  absurd: 'Absurd rejection',
  fake: 'Fake positive',
}

const TYPE_COLORS = {
  ghost:  { bg: '#F3F4F6', color: '#6B7280' },
  polite: { bg: '#EFF6FF', color: '#1A3465' },
  brutal: { bg: '#FEF2F2', color: '#991B1B' },
  absurd: { bg: '#FFF7ED', color: '#92400E' },
  fake:   { bg: '#F0FDF4', color: '#166534' },
}

export default function EmailView({ email, onBack }) {
  const typeStyle = TYPE_COLORS[email.type] || TYPE_COLORS.polite

  return (
    <div style={styles.container}>

      <div style={styles.header}>
        <button style={styles.backBtn} onClick={onBack}>← Back</button>
        <div style={styles.headerTitle}>Email</div>
        <div style={{ width: '60px' }} />
      </div>

      <div style={styles.body}>

        {/* Badge tipo rifiuto */}
        <div style={{
          ...styles.typeBadge,
          background: typeStyle.bg,
          color: typeStyle.color,
        }}>
          {TYPE_LABELS[email.type] || 'Rejection'}
        </div>

        {/* Info email */}
        <div style={styles.emailMeta}>
          <div style={styles.companyCircle}>
            {email.company.charAt(0)}
          </div>
          <div>
            <div style={styles.fromCompany}>{email.company}</div>
            <div style={styles.jobTitle}>Re: {email.jobTitle}</div>
          </div>
          <div style={styles.emailTime}>{email.time}</div>
        </div>

        <div style={styles.subject}>{email.subject}</div>

        <div style={styles.divider} />

        {/* Corpo email */}
        {email.type === 'ghost' ? (
          <div style={styles.ghostBox}>
            <div style={styles.ghostIcon}>
              <img 
                src='/images/ghost.svg'
                alt='ghost'
                style={{
                  width: '30%',
                  height: '30%'
                }}
                />
            </div>
            <p style={styles.ghostText}>No response received.</p>
            <p style={styles.ghostSubtext}>
              They opened your application and never replied.
              Classic.
            </p>
          </div>
        ) : (
          <div style={styles.emailBody}>
            {email.body}
          </div>
        )}

      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#ffffff',
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
  typeBadge: {
    display: 'inline-block',
    fontSize: '12px',
    fontWeight: '600',
    padding: '6px 14px',
    borderRadius: '100px',
    marginBottom: '20px',
  },
  emailMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px',
  },
  companyCircle: {
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    background: '#B7EBF4',
    color: '#252756',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: '700',
    flexShrink: 0,
  },
  fromCompany: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#252756',
  },
  jobTitle: {
    fontSize: '12px',
    color: '#4E7D9A',
    marginTop: '2px',
  },
  emailTime: {
    marginLeft: 'auto',
    fontSize: '11px',
    color: '#6B7280',
    flexShrink: 0,
  },
  subject: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#252756',
    marginBottom: '16px',
    lineHeight: '1.3',
  },
  divider: {
    height: '1px',
    background: '#E5E7EB',
    marginBottom: '20px',
  },
  emailBody: {
    fontSize: '15px',
    color: '#373333',
    lineHeight: '1.8',
    whiteSpace: 'pre-wrap',
  },
  ghostBox: {
    textAlign: 'center',
    padding: '40px 0',
  },
  ghostIcon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  ghostText: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#252756',
    marginBottom: '8px',
  },
  ghostSubtext: {
    fontSize: '14px',
    color: '#6B7280',
    lineHeight: '1.6',
  },
}