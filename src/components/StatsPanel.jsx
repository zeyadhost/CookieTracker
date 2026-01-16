function StatsPanel({ stats, targetItem }) {
  const targetCost = targetItem?.totalCost || targetItem?.ticket_cost?.base_cost || 0;
  const currentCookies = stats?.totalCookies ?? 0;
  const progress = targetCost > 0 ? Math.min((currentCookies / targetCost) * 100, 100) : 0;
  const remaining = Math.max(targetCost - currentCookies, 0);
  const accessoryCount = targetItem?.accessories?.length || 0;

  return (
    <div 
      className="rounded-2xl shadow-lg p-6"
      style={{ backgroundColor: 'var(--color-bg-2)' }}
    >
      <h2 
        className="text-2xl font-bold mb-4"
        style={{
          fontFamily: 'Jua, cursive',
          color: 'var(--color-text-header)',
        }}
      >
        Your Stats
      </h2>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm" style={{ fontFamily: 'Sour Gummy, sans-serif', color: 'var(--color-text-muted)' }}>
            Total Cookies
          </p>
          <p 
            className="text-3xl font-bold"
            style={{ fontFamily: 'Jua, cursive', color: 'var(--color-text-header)' }}
          >
            🍪 {currentCookies.toLocaleString()}
          </p>
        </div>

        {targetItem && (
          <>
            <div>
              <p className="text-sm" style={{ fontFamily: 'Sour Gummy, sans-serif', color: 'var(--color-text-muted)' }}>
                Progress to {targetItem.name}{accessoryCount > 0 ? ` + ${accessoryCount} upgrade${accessoryCount > 1 ? 's' : ''}` : ''}
              </p>
              <div className="mt-2">
                <div 
                  className="w-full h-3 rounded-full overflow-hidden"
                  style={{ backgroundColor: 'var(--color-bg)' }}
                >
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${progress}%`,
                      backgroundColor: progress >= 100 ? 'var(--color-green-500)' : 'var(--color-brown-500)',
                    }}
                  />
                </div>
                <p 
                  className="text-xs mt-1"
                  style={{ fontFamily: 'Sour Gummy, sans-serif', color: 'var(--color-text-muted)' }}
                >
                  {currentCookies.toLocaleString()} / {targetCost.toLocaleString()} ({progress.toFixed(1)}%)
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm" style={{ fontFamily: 'Sour Gummy, sans-serif', color: 'var(--color-text-muted)' }}>
                Cookies Remaining
              </p>
              <p 
                className="text-xl font-bold"
                style={{ fontFamily: 'Jua, cursive', color: remaining === 0 ? 'var(--color-green-500)' : 'var(--color-text-header)' }}
              >
                {remaining === 0 ? '🎉 Goal Reached!' : `🍪 ${remaining.toLocaleString()}`}
              </p>
            </div>
          </>
        )}

        <div>
          <p className="text-sm" style={{ fontFamily: 'Sour Gummy, sans-serif', color: 'var(--color-text-muted)' }}>
            Display Name
          </p>
          <p 
            className="text-lg"
            style={{ fontFamily: 'Sour Gummy, sans-serif', color: 'var(--color-text-body)' }}
          >
            {stats?.displayName ?? 'Unknown'}
          </p>
        </div>

        <div>
          <p className="text-sm" style={{ fontFamily: 'Sour Gummy, sans-serif', color: 'var(--color-text-muted)' }}>
            Total Devlog Time
          </p>
          <p 
            className="text-lg"
            style={{ fontFamily: 'Sour Gummy, sans-serif', color: 'var(--color-text-body)' }}
          >
            {Math.floor((stats?.devlogSecondsTotal ?? 0) / 3600)}h {Math.floor(((stats?.devlogSecondsTotal ?? 0) % 3600) / 60)}m
          </p>
        </div>

        <div>
          <p className="text-sm" style={{ fontFamily: 'Sour Gummy, sans-serif', color: 'var(--color-text-muted)' }}>
            Today's Devlog Time
          </p>
          <p 
            className="text-lg"
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
