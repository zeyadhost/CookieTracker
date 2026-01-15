import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Dashboard from './components/Dashboard';
import Setup from './components/Setup';
import StoreSelector from './components/StoreSelector';

function App() {
  const [isSetup, setIsSetup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showStore, setShowStore] = useState(false);
  const [targetItem, setTargetItem] = useState(null);

  useEffect(() => {
    const apiKey = localStorage.getItem('flavortown_api_key');
    const userId = localStorage.getItem('flavortown_user_id');
    const savedTarget = localStorage.getItem('flavortown_target_item');
    
    setIsSetup(!!apiKey && !!userId);
    if (savedTarget) {
      setTargetItem(JSON.parse(savedTarget));
    }
    setLoading(false);
  }, []);

  const handleSetupComplete = () => {
    setIsSetup(true);
    setShowStore(true);
  };

  const handleSelectTarget = (item) => {
    setTargetItem(item);
    setShowStore(false);
  };

  if (loading) {
    return null;
  }

  if (!isSetup) {
    return <Setup onComplete={handleSetupComplete} />;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      <main className="container mx-auto px-4 py-12 max-w-6xl">
        <h1 
          className="text-6xl text-center mb-4"
          style={{
            fontFamily: 'Jua, cursive',
            color: 'var(--color-text-header)',
          }}
        >
          🍪 Cookie Tracker
        </h1>

        {targetItem && (
          <div className="text-center mb-8">
            <button
              onClick={() => setShowStore(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full transition-all hover:opacity-80"
              style={{
                fontFamily: 'Sour Gummy, sans-serif',
                backgroundColor: 'var(--color-bg-2)',
                color: 'var(--color-text-body)',
                border: '2px solid var(--color-brown-400)',
              }}
            >
              <span>Target:</span>
              <span style={{ fontFamily: 'Jua, cursive', color: 'var(--color-text-header)' }}>
                {targetItem.name}
              </span>
              <span style={{ color: 'var(--color-yellow-500)' }}>
                🍪 {targetItem.ticket_cost?.base_cost || 0}
              </span>
              <span className="text-sm opacity-60">• Change</span>
            </button>
          </div>
        )}

        {!targetItem && (
          <div className="text-center mb-8">
            <button
              onClick={() => setShowStore(true)}
              className="px-6 py-3 rounded-lg font-bold transition-all hover:opacity-80"
              style={{
                fontFamily: 'Jua, cursive',
                backgroundColor: 'var(--color-green-500)',
                color: 'white',
              }}
            >
              🎯 Choose Your Target Item
            </button>
          </div>
        )}

        <Dashboard targetItem={targetItem} />
      </main>

      <AnimatePresence>
        {showStore && (
          <StoreSelector
            onSelect={handleSelectTarget}
            onClose={() => setShowStore(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default App