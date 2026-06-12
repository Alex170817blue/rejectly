'use client'

export default function JobCard({ job, onClick }) {
  return (
    <div style={styles.card} onClick={onClick}>

      <div style={styles.topRow}>
        <div style={styles.companyInitial}>
          {job.company.charAt(0)}
        </div>
        <div>
          <div style={styles.company}>{job.company}</div>
          <div style={styles.location}>{job.location}</div>
        </div>
        <div style={styles.type}>{job.type}</div>
      </div>

      <div style={styles.title}>{job.title}</div>

      <div style={styles.bottomRow}>
        <span style={styles.salary}>{job.salary}</span>
        <span style={styles.arrow}>→</span>
      </div>

    </div>
  )
}

const styles = {
  card: {
    background: '#ffffff',
    border: '1.5px solid #E5E7EB',
    borderRadius: '16px',
    padding: '16px',
    cursor: 'pointer',
    transition: 'border-color 0.15s, transform 0.15s',
    marginBottom: '12px',
  },
  topRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '10px',
  },
  companyInitial: {
    width: '38px',
    height: '38px',
    borderRadius: '10px',
    background: '#B7EBF4',
    color: '#252756',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    fontWeight: '700',
    flexShrink: 0,
  },
  company: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#252756',
  },
  location: {
    fontSize: '11px',
    color: '#4E7D9A',
    marginTop: '1px',
  },
  type: {
    marginLeft: 'auto',
    fontSize: '11px',
    fontWeight: '600',
    background: '#F0F9FF',
    color: '#4E7D9A',
    padding: '4px 10px',
    borderRadius: '100px',
    border: '1px solid #B7EBF4',
  },
  title: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#373333',
    lineHeight: '1.3',
    marginBottom: '12px',
  },
  bottomRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  salary: {
    fontSize: '13px',
    color: '#4E7D9A',
    fontWeight: '500',
  },
  arrow: {
    fontSize: '16px',
    color: '#252756',
  },
}