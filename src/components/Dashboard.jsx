import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchCookieStats } from '../services/api';
import StatsPanel from './StatsPanel';
import LaptopVisualization from './LaptopVisualization';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = localStorage.getItem('flavortown_user_id');

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
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-4 h-4 rounded-full"
              style={{
                backgroundColor: 'var(--color-brown-400)',
                animation: `bounce 1.4s infinite ease-in-out both`,
                animationDelay: `${i * 0.16}s`,
              }}
            />
          ))}
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
    <motion.div 
      className="grid lg:grid-cols-2 gap-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <StatsPanel stats={stats} />
      <LaptopVisualization milestones={stats?.milestones || []} />
    </motion.div>
  );
}

export default Dashboard;
