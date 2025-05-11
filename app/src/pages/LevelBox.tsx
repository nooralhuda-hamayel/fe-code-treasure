
import React from "react";
import "./levelsPage.css";

interface LevelBoxProps {
  levelData: {
    id: number;
    name: string;
    unlocked: boolean;
    completed: boolean;
    bestTime?: number;
    bestScore?: number;
    difficulty?: string;
  };
  onClick: () => void;
  isCurrent?: boolean;
}

const LevelBox: React.FC<LevelBoxProps> = ({ 
  levelData, 
  onClick, 
  isCurrent = false 
}) => {
  const {
    id,
    name,
    unlocked,
    completed,
    bestTime,
    bestScore,
    difficulty
  } = levelData;

  return (
    <div 
      className={`level-box ${isCurrent ? "current" : ""} ${
        !unlocked ? "locked" : ""
      }`}
      onClick={unlocked ? onClick : undefined}
    >
      <div className="level-header">
        <h3 className="level-title">{name}</h3>
        {difficulty && (
          <span className={`difficulty-badge ${difficulty.toLowerCase()}`}>
            {difficulty}
          </span>
        )}
      </div>

      {unlocked ? (
        <div className="level-stats">
          {bestTime && <p>⏱️ {bestTime}s</p>}
          {bestScore && <p>⭐ {bestScore}</p>}
        </div>
      ) : (
        <div className="locked-overlay">
          <span>🔒</span>
        </div>
      )}

      {completed && (
        <div className="completed-badge">
          <span>✅</span>
        </div>
      )}

      {isCurrent && unlocked && !completed && (
        <button className="start-button" onClick={onClick}>
          Start
        </button>
      )}
    </div>
  );
};

export default LevelBox;