import { useEffect, useState } from 'react';
import './App.css';
import BombRain from './components/BombRain.js';
import fotoLuva from './assets/luva.png'
import { criaMatriz, sorteiaMinas, atualizaContagemMinas, imprimeMatriz, sorteiaExposto, abreCelula } from './components/Campo.js'

function App() {

  const [matriz, setMatriz] = useState([])
  const [resultado, setResultado] = useState("Jogo não finalizado")
  const [gameOver, setGameOver] = useState(false);
  const [counter, setCounter] = useState(1)

  function abreCelula(row, col) {
    const novaMatriz = structuredClone(matriz);
    const celula = novaMatriz[row][col];

    console.log(`Contador: ` + counter)
    if (celula.hasMine) {
      celula.state = "opened";
      setResultado("Você perdeu!")
      setGameOver(true); // jogador perdeu
    } else {
      celula.state = "opened";
      setCounter(counter + 1)
    }

    if(gameOver == false && counter == 10) {
      setResultado("Você venceu!")
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
    const base = criaMatriz(6, 6)
    const gabarito = structuredClone(base);
    sorteiaMinas(gabarito, 14)
    atualizaContagemMinas(gabarito)
    sorteiaExposto(gabarito, 12)
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
