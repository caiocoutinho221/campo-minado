export function criaMatriz(linhas, colunas) {
    let m = []
    for(let i = 0; i < linhas; i++) {
        m[i] = []
        for(let j = 0; j < colunas; j++) {
            m[i][j] = {
                row: i,
                column: j,
                state: "closed", //Pode ser: closed, opened, flagged
                hasMine: false,
                nearMines: 0, //Número de minas em volta
            }
        }
    }
    return m
}

export function sorteiaMinas(matriz, quantMinas) {
    let linhas_length = matriz.length
    let colun_lenght = matriz[0].length

    while(quantMinas > 0) {
        let random_linha = Math.floor(Math.random() * linhas_length)    
        let random_colun = Math.floor(Math.random() * colun_lenght)

        if(matriz[random_linha][random_colun].hasMine == false) {
            matriz[random_linha][random_colun].hasMine = true
            quantMinas--;
        }
    }
}

export function sorteiaExposto(matriz, quantExpostas) {
    let linhas_length = matriz.length
    let colun_lenght = matriz[0].length

    while(quantExpostas > 0) {
        let random_linha = Math.floor(Math.random() * linhas_length)    
        let random_colun = Math.floor(Math.random() * colun_lenght)

        if(matriz[random_linha][random_colun].hasMine == false) {
            matriz[random_linha][random_colun].state = 'opened'
            quantExpostas--;
        }
    }
}

export function contaMinasProximas(matriz, linha, col) {
    let linhas_length = matriz.length
    let colun_lenght = matriz[0].length

    let possiveis_posicoes = [{x: 0, y: -1}, {x: -1, y: 0}, {x: -1, y: -1}, {x: 1, y: 0}, {x: 1, y: 1}, {x: 0, y: 1}, {x: -1, y: 1}, {x: 1, y: -1}]
    let contadorMinas = 0

    for(let ele of possiveis_posicoes) {
        const newRow = linha + ele.x;
        const newCol = col + ele.y;

        if(newRow >= 0 && newRow < linhas_length &&
           newCol >= 0 && newCol < colun_lenght &&
           matriz[newRow][newCol].hasMine) {
            contadorMinas++;
        }
    }
    matriz[linha][col].nearMines = contadorMinas;
}

export function atualizaContagemMinas(matriz) {
    for (let i = 0; i < matriz.length; i++) {
        for (let j = 0; j < matriz[0].length; j++) {
            contaMinasProximas(matriz, i, j);
        }
    }
}

export function imprimeMatriz(matriz) {
    for (let i = 0; i < matriz.length; i++) {
        let linhaStr = "";
        for (let j = 0; j < matriz[0].length; j++) {
            const celula = matriz[i][j];

            if (celula.hasMine) {
                linhaStr += "💣";
            } else if (celula.nearMines > 0) {
                linhaStr += `${celula.nearMines}`;
            } else {
                linhaStr += 0;
            }
        }
        console.log(linhaStr);
    }
}


