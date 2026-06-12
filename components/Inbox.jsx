'use client'

export default function Inbox({ emails, onSelectEmail, onGoToJobs, onGoToBadges }) {
  return (
    <div style={styles.container}>

      <div style={styles.header}>
        <div>
          <div style={styles.title}>Inbox</div>
          <div style={styles.subtitle}>{emails.length} rejection{emails.length !== 1 ? 's' : ''} received</div>
        </div>
        <div style={styles.headerIcon}>
          <img
            src='/images/inboxw.svg'
            alt='inbox icon'
            style={{
              width:'100%',
              height:'100%',
            }}
            />
        </div>
      </div>

      <div style={styles.list}>
        {emails.length === 0 && (
          <div style={styles.emptyBox}>
            <p style={styles.emptyIcon}>🦗</p>
            <p style={styles.emptyText}>No rejections yet.</p>
            <p style={styles.emptySubtext}>Apply to some jobs first!</p>
          </div>
        )}

        {emails.map(email => (
          <div
            key={email.id}
            style={{
              ...styles.emailItem,
              background: email.read ? '#ffffff' : '#F0F7FF',
              borderLeft: email.read ? '3px solid transparent' : '3px solid #4E7D9A',
            }}
            onClick={() => onSelectEmail(email)}
          >
            <div style={styles.emailTop}>
              <div style={styles.emailCompany}>{email.company}</div>
              <div style={styles.emailTime}>{email.time}</div>
            </div>
            <div style={styles.emailSubject}>{email.subject}</div>
            <div style={styles.emailPreview}>{email.preview}</div>
          </div>
        ))}
      </div>

      <div style={styles.bottomNav}>
        <button style={styles.navBtn} onClick={onGoToJobs}>
          <img
            src="/images/jobsearch.svg"
            alt="jobs board"
            style={{
              width: '40%',
              height: '40%',
            }}
          />
        </button>
        <button style={{ ...styles.navBtn, ...styles.navBtnActive }}>
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
  title: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: '13px',
    color: '#B7EBF4',
    marginTop: '2px',
  },
  headerIcon: {
    width:'50px',
    height:'100%'
  },
  list: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  emptyBox: {
    textAlign: 'center',
    padding: '64px 0',
  },
  emptyIcon: {
    fontSize: '40px',
    marginBottom: '12px',
  },
  emptyText: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#252756',
  },
  emptySubtext: {
    fontSize: '13px',
    color: '#4E7D9A',
    marginTop: '4px',
  },
  emailItem: {
    borderRadius: '14px',
    padding: '14px 16px',
    cursor: 'pointer',
    border: '1.5px solid #E5E7EB',
    transition: 'all 0.15s',
  },
  emailTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '4px',
  },
  emailCompany: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#252756',
  },
  emailTime: {
    fontSize: '11px',
    color: '#4E7D9A',
  },
  emailSubject: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#373333',
    marginBottom: '4px',
  },
  emailPreview: {
    fontSize: '12px',
    color: '#6B7280',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
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
}