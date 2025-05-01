import React, { useState } from "react";
import "./levelsPage.css";

const totalLevels = 10;

const LevelsPage = () => {
  const [unlockedLevels, setUnlockedLevels] = useState(1);

  const handleStart = (levelNumber: number) => {
    console.log(`Starting level ${levelNumber}`);
    if (levelNumber === unlockedLevels && levelNumber < totalLevels) {
      setUnlockedLevels(unlockedLevels + 1);
    }
  };

  const renderLevelCard = (levelNumber: number) => {
    const isUnlocked = levelNumber <= unlockedLevels;
    const isCurrent = levelNumber === unlockedLevels;
    const isCompleted = levelNumber < unlockedLevels;

    return (
      <div className={`level-card ${isCurrent ? "current" : ""}`} key={levelNumber}>
        <h3>Level {levelNumber}</h3>

        {isUnlocked && (
          <>
            <p>Time: --</p>
            <p>Score: --</p>
          </>
        )}

        {isCurrent && (
          <button onClick={() => handleStart(levelNumber)} className="start-button">
            Start
          </button>
        )}

        {isCompleted && <p className="completed">✅ Completed</p>}

        {!isUnlocked && (
          <p className="locked">
            🔒 Locked
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="levels-container">
      <h2>Game Levels</h2>
      <div className="levels-grid">
        {Array.from({ length: totalLevels }, (_, i) => renderLevelCard(i + 1))}
      </div>
    </div>
  );
};

export default LevelsPage;
