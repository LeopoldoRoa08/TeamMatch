import { useState, useEffect } from "react";

export function usePlayerLevel(initialEventsCount = 0) {
  const initialXp = initialEventsCount * 120; // 120 XP por evento

  const [experience, setExperience] = useState(0);
  const [level, setLevel] = useState(1);

  // Inicializar nivel y XP en base a los eventos reales asistidos
  useEffect(() => {
    if (initialXp > 0) {
      let currentLevel = 1;
      let remainingXp = initialXp;
      let needed = Math.floor(100 * Math.pow(currentLevel, 1.5));
      while (remainingXp >= needed) {
        remainingXp -= needed;
        currentLevel += 1;
        needed = Math.floor(100 * Math.pow(currentLevel, 1.5));
      }
      setLevel(currentLevel);
      setExperience(remainingXp);
    } else {
      setLevel(1);
      setExperience(0);
    }
  }, [initialEventsCount]);

  const xpNextLevel = Math.floor(100 * Math.pow(level, 1.5));
  const progressPercentage = Math.min(100, Math.max(0, Math.floor((experience / xpNextLevel) * 100)));

  const addExperience = (amount: number) => {
    setExperience((prevXp) => {
      let newXp = prevXp + amount;
      let currentLevel = level;
      let needed = Math.floor(100 * Math.pow(currentLevel, 1.5));

      while (newXp >= needed) {
        newXp -= needed;
        currentLevel += 1;
        needed = Math.floor(100 * Math.pow(currentLevel, 1.5));
      }

      setLevel(currentLevel);
      return newXp;
    });
  };

  return {
    level,
    experience,
    xpNextLevel,
    progressPercentage,
    addExperience,
  };
}
