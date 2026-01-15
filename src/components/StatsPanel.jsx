function StatsPanel({ stats }) {
  return (
    <div 
      className="rounded-2xl shadow-lg p-8"
      style={{ backgroundColor: 'var(--color-bg-2)' }}
    >
      <h2 
        className="text-3xl font-bold mb-6"
        style={{
          fontFamily: 'Jua, cursive',
          color: 'var(--color-text-header)',
        }}
      >
        Your Stats
      </h2>
      
      <div className="space-y-4">
        <div>
          <p style={{ fontFamily: 'Sour Gummy, sans-serif', color: 'var(--color-text-muted)' }}>
            Total Cookies
          </p>
          <p 
            className="text-4xl font-bold"
            style={{ fontFamily: 'Jua, cursive', color: 'var(--color-text-header)' }}
          >
            🍪 {stats?.totalCookies ?? 0}
          </p>
        </div>

        <div>
          <p style={{ fontFamily: 'Sour Gummy, sans-serif', color: 'var(--color-text-muted)' }}>
            Display Name
          </p>
          <p 
            className="text-xl"
            style={{ fontFamily: 'Sour Gummy, sans-serif', color: 'var(--color-text-body)' }}
          >
            {stats?.displayName ?? 'Unknown'}
          </p>
        </div>

        <div>
          <p style={{ fontFamily: 'Sour Gummy, sans-serif', color: 'var(--color-text-muted)' }}>
            Total Devlog Time
          </p>
          <p 
            className="text-xl"
            style={{ fontFamily: 'Sour Gummy, sans-serif', color: 'var(--color-text-body)' }}
          >
            {Math.floor((stats?.devlogSecondsTotal ?? 0) / 3600)}h {Math.floor(((stats?.devlogSecondsTotal ?? 0) % 3600) / 60)}m
          </p>
        </div>

        <div>
          <p style={{ fontFamily: 'Sour Gummy, sans-serif', color: 'var(--color-text-muted)' }}>
            Today's Devlog Time
          </p>
          <p 
            className="text-xl"
            style={{ fontFamily: 'Sour Gummy, sans-serif', color: 'var(--color-text-body)' }}
          >
            {Math.floor((stats?.devlogSecondsToday ?? 0) / 3600)}h {Math.floor(((stats?.devlogSecondsToday ?? 0) % 3600) / 60)}m
          </p>
        </div>
      </div>
    </div>
  )
}

export default StatsPanel
