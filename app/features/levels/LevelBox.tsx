import React from "react";
import "./levels.css";

interface LevelBoxProps {
  level: number;
  onClick: () => void;
}

const LevelBox: React.FC<LevelBoxProps> = ({ level, onClick }) => {
  return (
    <button className="level-box" onClick={onClick}>
      Level {level}
    </button>
  );
};

export default LevelBox;
