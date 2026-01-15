import { useState, useEffect } from 'react';
import { fetchCookieStats } from '../services/api';
import StatsPanel from './StatsPanel';
import LaptopVisualization from './LaptopVisualization';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = import.meta.env.VITE_USER_ID;

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        const data = await fetchCookieStats(userId);
        setStats(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
    const interval = setInterval(loadStats, 60000);
    return () => clearInterval(interval);
  }, [userId]);

  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: 'var(--color-bg)' }}
      >
        <div 
          className="text-2xl"
          style={{ fontFamily: 'Jua, cursive', color: 'var(--color-text-header)' }}
        >
          Loading...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: 'var(--color-bg)' }}
      >
        <div 
          className="text-xl"
          style={{ fontFamily: 'Jua, cursive', color: 'var(--color-red-500)' }}
        >
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <StatsPanel stats={stats} />
      <LaptopVisualization milestones={stats?.milestones || []} />
    </div>
  );
}

export default Dashboard;
