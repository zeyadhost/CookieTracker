function StatsPanel() {
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
    </div>
  )
}

export default StatsPanel
