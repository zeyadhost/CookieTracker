import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchUserProfile } from '../services/api';

function Setup({ onComplete }) {
  const [step, setStep] = useState(1);
  const [apiKey, setApiKey] = useState('');
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleValidate = async () => {
    if (!apiKey.trim() || !userId.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const profile = await fetchUserProfile(userId, apiKey);
      
      localStorage.setItem('flavortown_api_key', apiKey);
      localStorage.setItem('flavortown_user_id', userId);
      localStorage.setItem('flavortown_display_name', profile.display_name);
      
      onComplete();
    } catch (err) {
      setError('Invalid API key or User ID. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <motion.div
        className="w-full max-w-md rounded-2xl shadow-lg p-8"
        style={{ backgroundColor: 'var(--color-bg-2)' }}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-center mb-8">
          <h1 
            className="text-4xl mb-2 whitespace-nowrap"
            style={{ fontFamily: 'Jua, cursive', color: 'var(--color-text-header)' }}
          >
            🍪 Cookie Tracker
          </h1>
          <p style={{ fontFamily: 'Sour Gummy, sans-serif', color: 'var(--color-text-body)' }}>
            Let's get you set up
          </p>
        </div>

        <AnimatePresence mode="wait" custom={step}>
          {step === 1 && (
            <motion.div
              key="step1"
              custom={1}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <label 
                  className="block mb-2 text-sm font-bold"
                  style={{ fontFamily: 'Sour Gummy, sans-serif', color: 'var(--color-text-header)' }}
                >
                  FlavorTown API Key
                </label>
                <input
                  type="text"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="ft_sk_..."
                  className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-opacity-100 transition-colors"
                  style={{
                    fontFamily: 'Sour Gummy, sans-serif',
                    backgroundColor: 'var(--color-bg)',
                    borderColor: 'var(--color-brown-400)',
                    color: 'var(--color-text-body)',
                  }}
                />
                <p 
                  className="mt-2 text-xs"
                  style={{ fontFamily: 'Sour Gummy, sans-serif', color: 'var(--color-text-muted)' }}
                >
                  Get your API key from FlavorTown settings
                </p>
              </div>

              <motion.button
                onClick={() => setStep(2)}
                disabled={!apiKey.trim()}
                className="w-full py-3 rounded-lg font-bold transition-opacity disabled:opacity-50"
                style={{
                  fontFamily: 'Jua, cursive',
                  backgroundColor: 'var(--color-green-500)',
                  color: 'white',
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Next
              </motion.button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              custom={2}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <label 
                  className="block mb-2 text-sm font-bold"
                  style={{ fontFamily: 'Sour Gummy, sans-serif', color: 'var(--color-text-header)' }}
                >
                  User ID
                </label>
                <input
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="1"
                  className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-opacity-100 transition-colors"
                  style={{
                    fontFamily: 'Sour Gummy, sans-serif',
                    backgroundColor: 'var(--color-bg)',
                    borderColor: 'var(--color-brown-400)',
                    color: 'var(--color-text-body)',
                  }}
                />
                <p 
                  className="mt-2 text-xs"
                  style={{ fontFamily: 'Sour Gummy, sans-serif', color: 'var(--color-text-muted)' }}
                >
                  Find your User ID in your FlavorTown profile
                </p>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 rounded-lg"
                  style={{
                    backgroundColor: 'var(--color-red-500)',
                    color: 'white',
                    fontFamily: 'Sour Gummy, sans-serif',
                    fontSize: '0.875rem',
                  }}
                >
                  {error}
                </motion.div>
              )}

              <div className="flex gap-3">
                <motion.button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 rounded-lg font-bold"
                  style={{
                    fontFamily: 'Jua, cursive',
                    backgroundColor: 'var(--color-brown-400)',
                    color: 'white',
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Back
                </motion.button>

                <motion.button
                  onClick={handleValidate}
                  disabled={loading || !userId.trim()}
                  className="flex-1 py-3 rounded-lg font-bold transition-opacity disabled:opacity-50"
                  style={{
                    fontFamily: 'Jua, cursive',
                    backgroundColor: 'var(--color-green-500)',
                    color: 'white',
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? 'Validating...' : 'Complete Setup'}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8 flex justify-center gap-2">
          <div
            className="w-2 h-2 rounded-full transition-all"
            style={{
              backgroundColor: step === 1 ? 'var(--color-green-500)' : 'var(--color-brown-400)',
              opacity: step === 1 ? 1 : 0.3,
            }}
          />
          <div
            className="w-2 h-2 rounded-full transition-all"
            style={{
              backgroundColor: step === 2 ? 'var(--color-green-500)' : 'var(--color-brown-400)',
              opacity: step === 2 ? 1 : 0.3,
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}

export default Setup;
