import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import Setup from './components/Setup';

function App() {
  const [isSetup, setIsSetup] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiKey = localStorage.getItem('flavortown_api_key');
    const userId = localStorage.getItem('flavortown_user_id');
    setIsSetup(!!apiKey && !!userId);
    setLoading(false);
  }, []);

  const handleSetupComplete = () => {
    setIsSetup(true);
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
          className="text-6xl text-center mb-12"
          style={{
            fontFamily: 'Jua, cursive',
            color: 'var(--color-text-header)',
          }}
        >
          🍪 Cookie Tracker
        </h1>
        <Dashboard />
      </main>
    </div>
  )
}

export default App