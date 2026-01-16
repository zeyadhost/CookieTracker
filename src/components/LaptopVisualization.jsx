import { getProxiedImageUrl } from '../utils/imageProxy';

function LaptopVisualization({ targetItem, totalCookies }) {
  const targetCost = targetItem?.totalCost || targetItem?.ticket_cost?.base_cost || 0;
  const progress = targetCost > 0 ? Math.min((totalCookies / targetCost) * 100, 100) : 0;
  const accessories = targetItem?.accessories || [];

  return (
    <div 
      className="rounded-2xl shadow-lg p-6 flex flex-col h-full"
      style={{ backgroundColor: 'var(--color-bg-2)' }}
    >
      <h2 
        className="text-2xl font-bold mb-4 text-center"
        style={{
          fontFamily: 'Jua, cursive',
          color: 'var(--color-text-header)',
        }}
      >
        The Rig
      </h2>

      {targetItem ? (
        <div className="flex flex-col items-center flex-1">
          <div 
            className="relative w-full flex-1 min-h-[200px] max-h-[300px] rounded-xl overflow-hidden mb-4 flex items-center justify-center"
            style={{ backgroundColor: 'var(--color-bg)' }}
          >
            {targetItem.image_url ? (
              <>
                <img 
                  src={getProxiedImageUrl(targetItem.image_url)} 
                  alt={targetItem.name}
                  className="max-w-full max-h-full object-contain transition-all duration-500 p-4"
                  style={{
                    filter: progress < 100 ? `grayscale(${Math.max(0, 80 - progress * 0.8)}%)` : 'none',
                  }}
                />
                
                {/* Progress overlay - fills from bottom */}
                <div 
                  className="absolute bottom-0 left-0 right-0 pointer-events-none transition-all duration-700"
                  style={{
                    height: `${100 - progress}%`,
                    background: 'linear-gradient(to bottom, transparent 0%, rgba(var(--color-bg-rgb), 0.7) 30%)',
                  }}
                />

                {/* Progress percentage badge */}
                <div 
                  className="absolute bottom-3 right-3 px-3 py-1 rounded-full text-sm font-bold"
                  style={{
                    fontFamily: 'Jua, cursive',
                    backgroundColor: progress >= 100 ? 'var(--color-green-500)' : 'var(--color-brown-500)',
                    color: 'white',
                  }}
                >
                  {progress >= 100 ? '✓ Done!' : `${progress.toFixed(0)}%`}
                </div>
              </>
            ) : (
              <div className="text-6xl opacity-30">📦</div>
            )}

            {progress >= 100 && (
              <div 
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{ backgroundColor: 'rgba(34, 197, 94, 0.2)' }}
              >
                <span 
                  className="text-6xl"
                  style={{ animation: 'bounce 1s infinite' }}
                >
                  🎉
                </span>
              </div>
            )}
          </div>

          <h3 
            className="text-xl text-center"
            style={{ fontFamily: 'Jua, cursive', color: 'var(--color-text-header)' }}
          >
            {targetItem.name}
          </h3>
          
          <p 
            className="text-center mt-1 text-sm"
            style={{ fontFamily: 'Sour Gummy, sans-serif', color: 'var(--color-text-muted)' }}
          >
            {progress >= 100 
              ? "🎊 You've earned this!" 
              : `${totalCookies.toLocaleString()} / ${targetCost.toLocaleString()} cookies`
            }
          </p>

          {/* Show selected accessories */}
          {accessories.length > 0 && (
            <div className="mt-4 w-full">
              <p 
                className="text-xs text-center mb-2"
                style={{ fontFamily: 'Sour Gummy, sans-serif', color: 'var(--color-text-muted)' }}
              >
                + {accessories.length} upgrade{accessories.length > 1 ? 's' : ''}
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {accessories.map(acc => (
                  <div 
                    key={acc.id}
                    className="flex items-center gap-1 px-2 py-1 rounded-full text-xs"
                    style={{ 
                      backgroundColor: 'var(--color-bg)',
                      fontFamily: 'Sour Gummy, sans-serif',
                      color: 'var(--color-text-body)',
                    }}
                  >
                    {acc.image_url && (
                      <img src={getProxiedImageUrl(acc.image_url)} alt="" className="w-4 h-4 object-contain" />
                    )}
                    {acc.name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center flex-1 py-8">
          <div 
            className="text-6xl mb-4"
            style={{ opacity: 0.3 }}
          >
            🎯
          </div>
          <p 
            className="text-center text-sm"
            style={{ fontFamily: 'Sour Gummy, sans-serif', color: 'var(--color-text-muted)' }}
          >
            Select a target item to start tracking
          </p>
        </div>
      )}
    </div>
  )
}

export default LaptopVisualization
