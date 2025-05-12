// components/Leaderboard.tsx
import { useState, useEffect } from 'react';
import LoginModal from './LoginModal';

const Leaderboard = () => {
  const [user, setUser] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const checkLogin = async () => {
      const res = await fetch('/api/auth/me', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    };

    checkLogin();
  }, []);

  const handleSubmitScore = async (score: number) => {
    if (!user) {
      setModalOpen(true); // Open login modal if not logged in
      return;
    }

    // Proceed with score submission...
    // Make an API call to submit the score
  };

  return (
    <div>
      <button onClick={() => handleSubmitScore(1234)}>Submit Score</button>

      <LoginModal
        open={isModalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export default Leaderboard;
