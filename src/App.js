import { useEffect, useState } from 'react';
import './App.css';
import BombRain from './components/BombRain.js';
import fotoLuva from './assets/luva.png'
import { criaMatriz, sorteiaMinas, atualizaContagemMinas, imprimeMatriz, sorteiaExposto, abreCelula } from './components/Campo.js'

function App() {

  const [matriz, setMatriz] = useState([])
  const [resultado, setResultado] = useState("Jogo não finalizado")
  const [gameOver, setGameOver] = useState(false);

  function checkVictory(matriz) {
  for (let i = 0; i < matriz.length; i++) {
    for (let j = 0; j < matriz[0].length; j++) {
      const celula = matriz[i][j];
      if (!celula.hasMine && celula.state !== "opened") {
        return false; // ainda tem célula segura fechada
      }
    }
  }
  return true;
}


function abreCelula(row, col) {
  const novaMatriz = structuredClone(matriz);

  function abrirRecursivo(r, c) {
    if (r < 0 || r >= novaMatriz.length || c < 0 || c >= novaMatriz[0].length) return;

    const celula = novaMatriz[r][c];
    if (celula.state === "opened" || celula.state === "flagged") return;

    celula.state = "opened";

    if (celula.hasMine) {
      setResultado("Você perdeu!");
      setGameOver(true);
      return;
    }

    if (celula.nearMines === 0) {
      const direcoes = [
        { x: -1, y: -1 }, { x: -1, y: 0 }, { x: -1, y: 1 },
        { x: 0, y: -1 },                 { x: 0, y: 1 },
        { x: 1, y: -1 }, { x: 1, y: 0 }, { x: 1, y: 1 }
      ];
      for (let d of direcoes) {
        abrirRecursivo(r + d.x, c + d.y);
      }
    }
  }

  abrirRecursivo(row, col);

  // checa vitória
  if (!gameOver && checkVictory(novaMatriz)) {
    setResultado("Você venceu!");
    setGameOver(true);
  }

  setMatriz(novaMatriz);
}


  function marcaBandeira(row, col) {
  const novaMatriz = structuredClone(matriz);
  const celula = novaMatriz[row][col];

  if (celula.state === "closed") {
    celula.state = "flagged";
  } else if (celula.state === "flagged") {
    celula.state = "closed";
  }

  setMatriz(novaMatriz);
}


  useEffect(() => {
    const base = criaMatriz(10, 10)
    const gabarito = structuredClone(base);
    sorteiaMinas(gabarito, 22)
    atualizaContagemMinas(gabarito)
    sorteiaExposto(gabarito, 20)
    imprimeMatriz(gabarito)

    setMatriz(gabarito)
  }, [])

  return (
    <div className='main'>
      <h1>CAMPO MINADO</h1>
      <h2>{resultado}</h2>
      <div className="campo-minado-grid">
        {matriz.flat().map((celula, idx) => (
          <button
            key={idx}
            className={`
              square
              ${celula.state}
              ${celula.hasMine ? "mine" : ""}
              ${gameOver && celula.hasMine ? "explode" : ""}`}
            onClick={() => !gameOver && abreCelula(celula.row, celula.column)}
             onContextMenu={(e) => {
              e.preventDefault();
              if (!gameOver) marcaBandeira(celula.row, celula.column);
            }}
          >
            {
              celula.state === "flagged"
                ? "📍" :
                celula.state === "closed"
                  ? ""
                  : celula.hasMine
                    ? "💣"
                    : celula.nearMines}
          </button>
        ))}
      </div>
      <BombRain active={gameOver} count={999} />
      <img src={fotoLuva} id='luva' hidden={!gameOver}></img>
    </div>

  );
}

export default App;
