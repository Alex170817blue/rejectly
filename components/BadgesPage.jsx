'use client'

const BADGES = [
  {
    id: 'first_apply',
    icon: '/images/target.svg',
    name: 'First Blood',
    desc: 'Applied to your first job',
    condition: (stats) => stats.applied >= 1,
  },
  {
    id: 'rejected_5',
    icon: '/images/heart.svg',
    name: 'Rejection Collector',
    desc: 'Received 5 rejections',
    condition: (stats) => stats.rejected >= 5,
  },
  {
    id: 'ghosted',
    icon: '/images/ghost.svg',
    name: 'Ghost Protocol',
    desc: 'Got ghosted at least once',
    condition: (stats) => stats.ghosted >= 1,
  },
  {
    id: 'ghosted_3',
    icon: '/images/invisible.svg',
    name: 'Professionally Invisible',
    desc: 'Got ghosted 3 times',
    condition: (stats) => stats.ghosted >= 3,
  },
  {
    id: 'absurd',
    icon: '/images/clown.svg',
    name: 'Clown Applications',
    desc: 'Received an absurd rejection',
    condition: (stats) => stats.absurd >= 1,
  },
  {
    id: 'brutal',
    icon: '/images/knife.svg',
    name: 'Brutally Honest',
    desc: 'Received a brutal rejection',
    condition: (stats) => stats.brutal >= 1,
  },
  {
    id: 'applied_10',
    icon: '/images/sprint.svg',
    name: 'Desperate Sprinter',
    desc: 'Applied to 10 jobs',
    condition: (stats) => stats.applied >= 10,
  },
  {
    id: 'overqualified',
    icon: '/images/brain.svg',
    name: 'Overqualified',
    desc: 'Applied to 3 junior roles',
    condition: (stats) => stats.applied >= 3,
  },
]

export default function BadgesPage({ profile, stats, onGoToJobs, onGoToInbox, onGoToSettings, inboxCount }) {

  const unlockedIds = BADGES
    .filter(b => b.condition(stats))
    .map(b => b.id)

  const unlockedCount = unlockedIds.length

  return (
    <div style={styles.container}>

      {/* Header */}
    <div style={styles.header}>
      <div style={styles.avatarBig} onClick={onGoToSettings} title="Edit profile">
        {profile.photo ? (
          <img
            src={profile.photo}
            alt="Profile"
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
          />
        ) : (
          profile.name.charAt(0).toUpperCase()
        )}
      </div>
      <div style={styles.profileInfo}>
        <div style={styles.profileName}>{profile.name}</div>
        <div style={styles.profileRole}>{profile.role}</div>
        {profile.bio && (
          <div style={styles.profileBio}>{profile.bio}</div>
        )}
      </div>
      <button style={styles.settingsBtn} onClick={onGoToSettings}>
        <img
          src="/images/settings.svg"
          alt='settings'
          style={{
            width:'100%',
            height:'100%',
          }}
          />
      </button>
    </div>

      {/* Stats grid */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <span style={styles.statNum}>{stats.applied}</span>
          <span style={styles.statLabel}>Applied</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statNum}>{stats.rejected}</span>
          <span style={styles.statLabel}>Rejected</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statNum}>{stats.ghosted}</span>
          <span style={styles.statLabel}>Ghosted</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statNum}>
            {stats.applied > 0
              ? Math.round((stats.rejected + stats.ghosted) / stats.applied * 100)
              : 0}%
          </span>
          <span style={styles.statLabel}>Rejection rate</span>
        </div>
      </div>

      {/* Motivational message — cambia in base alle stats */}
      <div style={styles.motivBox}>
        <p style={styles.motivText}>
          {stats.applied === 0 && "Start applying! The rejections won't collect themselves."}
          {stats.applied > 0 && stats.rejected === 0 && "Still waiting... they'll get back to you. Probably not."}
          {stats.rejected >= 1 && stats.rejected < 5 && "You're just getting started. The best rejections are yet to come."}
          {stats.rejected >= 5 && stats.rejected < 10 && "You're really getting the hang of this rejection thing!"}
          {stats.rejected >= 10 && "A true professional. Rejection is your middle name."}
        </p>
      </div>

      {/* Badge list */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Achievements</div>
        <div style={styles.badgeList}>
          {BADGES.map(badge => {
            const unlocked = unlockedIds.includes(badge.id)
            return (
              <div
                key={badge.id}
                style={{
                  ...styles.badgeItem,
                  opacity: unlocked ? 1 : 0.4,
                  borderColor: unlocked ? '#B7EBF4' : '#E5E7EB',
                  background: unlocked ? '#F0F9FF' : '#ffffff',
                }}
              >
                <div style={styles.badgeIcon}>
                  <img
                    src={badge.icon}
                    alt={badge.name}
                    style={{
                      width: '60%',
                      height: '50%',
                      objectFit: 'contain',
                    }}
                  />
                </div>
                <div style={styles.badgeInfo}>
                  <div style={styles.badgeName}>{badge.name}</div>
                  <div style={styles.badgeDesc}>{badge.desc}</div>
                </div>
                {unlocked && (
                  <div style={styles.unlockedPill}>✓</div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Bottom nav */}
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
        <button style={{ ...styles.navBtn, ...styles.navBtnActive }}>
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
    padding: '48px 20px 24px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  avatarBig: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    background: '#4E7D9A',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    fontWeight: '700',
    flexShrink: 0,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#ffffff',
  },
  profileRole: {
    fontSize: '13px',
    color: '#B7EBF4',
    marginTop: '2px',
  },
  badgeCount: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'left',
  },
  badgeNum: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#B7EBF4',
  },
  badgeLabel: {
    fontSize: '10px',
    color: '#B7EBF4',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '3px',
    padding: '3px',
  },
  statCard: {
    background: '#ffffff',
    borderRadius: '14px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'left',
    gap: '4px',
    border: '1.5px solid #E5E7EB',
  },
  statNum: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#252756',
  },
  statLabel: {
    fontSize: '11px',
    color: '#4E7D9A',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  motivBox: {
    margin: '0 16px 16px',
    background: '#252756',
    borderRadius: '14px',
    padding: '16px',
  },
  motivText: {
    fontSize: '14px',
    color: '#B7EBF4',
    lineHeight: '1.6',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  section: {
    padding: '0 16px',
  },
  sectionTitle: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#4E7D9A',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    marginBottom: '12px',
  },
  badgeList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  badgeItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '14px',
    borderRadius: '14px',
    border: '1.5px solid',
    transition: 'all 0.2s',
  },
  badgeIcon: {
    width: '100px',
    height:'50%',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'left',
    justifyContent: 'left',
  },
  badgeInfo: {
    flex: 1,
  },
  badgeName: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#252756',
  },
  badgeDesc: {
    fontSize: '12px',
    color: '#4E7D9A',
    marginTop: '2px',
  },
  unlockedPill: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    background: '#1A3465',
    color: '#B7EBF4',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: '700',
    flexShrink: 0,
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

    settingsBtn: {
    background: 'transparent',
    border: '1.5px solid #252756',
    borderRadius: '100%',
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    flexShrink: 0,
  },

  profileBio: {
    fontSize: '11px',
    color: '#B7EBF4',
    marginTop: '3px',
    opacity: 0.8,
  },
}