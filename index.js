import { Aspirador } from './Aspirador.js';

const aspirador = new Aspirador();
const TEMPO_DE_ATUALIZACAO = 1000;

let posicaoParada = {
    x: 0,
    y: 0,
}

let tudoLimpo = false;

// let quarto = [
//     [true, false, true, false, false, true],
//     [false, true, true, true, false, true],
//     [false, true, false, true, false, true],
//     [true, false, true, true, false, true],
//     [false, false, false, true, false, true],
//     [true, false, true, false, false, true],
//     [false, false, true, false, false, true],
//     [true, false, false, false, false, true],
// ];

let quarto = [
    [true, false, true, false],
    [false, true, true, true],
    [false, true, false, true],
    [true, false, true, true],
];

function mostrarStatusDoAspirador() {
    console.log(`
        Espaço disponível na bolsa: ${aspirador.bolsa.espacoDisponivel}
        Sujeira coletada: ${aspirador.bolsa.sujeiraColetada}
        Energia: ${aspirador.energia}
    `)
}

let direcao = 'BAIXO';
let virarDireita = false;

let voltandoAoInicio = false;
let voltandoParaPosicaoParada = false;

function voltarParaPosicaoParada() {
    const [posX, posY] = [aspirador.posicaoAtual.x, aspirador.posicaoAtual.y];
    const [paradaX, paradaY] = [posicaoParada.x, posicaoParada.y];
    const chegouNaLinhaParada = posY === paradaY;
    const chegouNaColunaParada = posX === paradaX;

    if (!chegouNaLinhaParada) {
        aspirador.mover().baixo();
    }

    if (chegouNaLinhaParada && !chegouNaColunaParada) {
        aspirador.mover().direita();
    }

    if (posX === paradaX && posY === paradaY) {
        voltandoParaPosicaoParada = false;
        return;
    }

    console.log("A bolsa está vazia novamente, a limpeza deve continuar de onde parou!");
    console.log('Voltando ao local parado...');
}

function voltarAoInicio() {
    const [posX, posY] = [aspirador.posicaoAtual.x, aspirador.posicaoAtual.y];
    const estaNaUltimaColuna = posX === 0;

    if (posX === 0 && posY === 0) {
        aspirador.esvaziarBolsa();
        voltandoAoInicio = false;
        voltandoParaPosicaoParada = true;
        return;
    }

    console.log("A bolsa está cheia, é necessário voltar para esvaziar!");
    console.log('Voltando ao início...');

    if (estaNaUltimaColuna) {
        aspirador.mover().cima();
        return;
    }

    aspirador.mover().esquerda();
}


function limparQuarto () {

    // Iniciando a limpeza
    aspirador.ligar(quarto);
    aspirador.mostrarEstrutura();
    aspirador.mostrarPosicaoAtual();
    mostrarStatusDoAspirador();

    if (voltandoAoInicio) {
        voltarAoInicio();
        return;
    }

    if (voltandoParaPosicaoParada) {
        voltarParaPosicaoParada();
        return;
    }

    // Posições x e y antes do próximo movimento ser feito.
    const [posX, posY] = [aspirador.posicaoAtual.x, aspirador.posicaoAtual.y];
    const chegouAoFinal = posY === 0 && posX === aspirador.estruturaParaLimpar[posY].length - 1;

    if (aspirador.estruturaParaLimpar[posY][posX] === false) {
        if (aspirador.verificarBolsa().bolsaCheia) {
            posicaoParada = {
                x: posX,
                y: posY
            }

            voltandoAoInicio = true;

            return;
        }

        console.log('limpando...');
        aspirador.limpar();
    }

    if (virarDireita) {
        aspirador.mover().direita();
        virarDireita = false;
        return;
    }

    switch (direcao) {
        case 'BAIXO': {
            aspirador.mover().baixo();
            break;
        }

        case 'CIMA': {
            aspirador.mover().cima();
            break;
        }
        default: 
            return;
    }

    const [x, y] = [aspirador.posicaoAtual.x, aspirador.posicaoAtual.y];
    const chegouLimiteProfundidade = y === aspirador.estruturaParaLimpar.length - 1;
    const chegouLimiteAltura = y === 0;
    
    if (chegouLimiteProfundidade) {
        direcao = 'CIMA';

        virarDireita = true;
    }
    else if (chegouLimiteAltura) {
        direcao = 'BAIXO';

        virarDireita = true;
    }

    if (chegouAoFinal) {
        tudoLimpo = true;
        voltarAoInicio();
    }
}


const interval = setInterval(() => {

    console.clear();

    limparQuarto();

    // if (tudoLimpo) {
    //     voltarAoInicio();
    //     const [posX, posY] = [aspirador.posicaoAtual.x, aspirador.posicaoAtual.y];

    //     // if (posX === 0 && posY === 0) {
    //     //     setTimeout(() => {
    //     //         console.clear();
    //     //         aspirador.mostrarEstrutura();
    //     //         aspirador.mostrarPosicaoAtual();
    //     //         mostrarStatusDoAspirador();
    //     //         clearInterval(interval);
    //     //     }, TEMPO_DE_ATUALIZACAO)
    //     // }

        
    // }

}, TEMPO_DE_ATUALIZACAO);

// O aspirador possuí inicialmente 100 pontos de energia, cada ação custa 1 energia.
// O aspirador possui uma bolsa com a capacidade máxima para sugar somente 10 sujeiras.
// Após cada aspiração o agenete (aspirador) deve verficar sua bolsa,
// Se a bolsa estiver cheia o agente deve retornar ao inicio, esvaziar a bolsa e aspirar novamente.