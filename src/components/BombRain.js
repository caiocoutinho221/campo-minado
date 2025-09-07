import { useEffect, useState } from "react";
import './bombRain.css';

function BombRain({ active, count = 20 }) {
  const [bombs, setBombs] = useState([]);

  useEffect(() => {
    if (!active) return;

    const newBombs = Array.from({ length: count }).map(() => ({
      id: Math.random(),
      left: Math.random() * 100,       // posição horizontal (%)
      delay: Math.random() * 11,        // atraso para cair
      duration: 3 + Math.random() * 2, // duração da animação
    }));

    setBombs(newBombs);
  }, [active, count]);

  const handleAnimationEnd = ((id) => {
        setBombs((prev) => prev.filter((b) => b.id !== id));

  })

  return (
    <div className="bomb-rain-container">
      {bombs.map((b) => (
        <span
          key={b.id}
          className="bomb"
          style={{
            left: `${b.left}%`,
            animationDelay: `${b.delay}s`,
            animationDuration: `${b.duration}s`,
          }}

          onAnimationEnd={() => handleAnimationEnd(b.id)}
        >
          💣
        </span>
      ))}
    </div>
  );
}

export default BombRain;
