import React, { useState, useEffect } from "react";
import useAuth  from "../hooks/useAuth";
import { fetchLevels } from "../api/levelApi";
import type { LevelWithProgress } from "../api/types/levelTypes";
import type { Level } from '../api/types/levelTypes';
import LevelBox from "./LevelBox";
import "./levelsPage.css";

const LevelsPage = () => {
  const { user } = useAuth();
  const [levels, setLevels] = useState<LevelWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<LevelWithProgress | null>(null);


  useEffect(() => {
    const loadLevels = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const allLevels = await fetchLevels();
        const levelsWithProgress = allLevels.map((level, index) => ({
          ...level,
          unlocked: index === 0 || (user?.progress?.unlockedLevels || 0) >= level.id,
          completed: (user?.progress?.completedLevels || []).includes(level.id),
          bestTime: user?.progress?.bestTimes?.[level.id],
          bestScore: user?.progress?.bestScores?.[level.id]
        }));
        
        setLevels(levelsWithProgress);
      } catch (err) {
        console.error("Failed to load levels", err);
        setError("Failed to load levels. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadLevels();
  }, [user]);
   const handleLevelClick = (level: LevelWithProgress) => {
    setSelectedLevel(level);
  };
  // const LevelModal = () => (
  //   <div className="modal-overlay">
  //     <div className="modal-content">
  //       <h2>{selectedLevel?.name}</h2>
  //       <p>Best Time: {selectedLevel?.bestTime}</p>
  //       <button onClick={() => setSelectedLevel(null)}>Close</button>
  //     </div>
  //   </div>
  // );
  const LevelModal = () => (
    <div className="modal-overlay" onClick={() => setSelectedLevel(null)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{selectedLevel?.name}</h2>
        <div className="modal-stats">
          <p>⏱️ Best Time: <span>{selectedLevel?.bestTime || '--:--'}</span></p>
          <p>⭐ Best Score: <span>{selectedLevel?.bestScore || '0'}</span></p>
          <p>🔓 Status: <span>{selectedLevel?.completed ? 'Completed' : 'In Progress'}</span></p>
        </div>
        <button 
          onClick={() => setSelectedLevel(null)}
          className="close-button"
        >
          Close
        </button>
        <button
          onClick={() => {
            // ابدأ المستوى هنا
            console.log('Starting level', selectedLevel?.id);
          }}
          className="start-button"
        >
          Play Level
        </button>
      </div>
    </div>
  );

  if (loading) return <div className="loading">Loading levels...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="levels-container">
            {selectedLevel && <LevelModal />}
      <h1 className="page-title">Game Levels</h1>
      <div className="levels-grid">
        {levels.map((level) => (
          <LevelBox
            key={level.id}
            levelData={level}
            onClick={() => handleLevelClick(level)}
            isCurrent={!level.completed && level.unlocked}
          />
        ))}
      </div>
    </div>
  );
};

export default LevelsPage;
