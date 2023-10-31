import { Aspirador } from './Aspirador.js';

export class Quarto {

    constructor(aspirador) {

        if (aspirador instanceof Aspirador) {
            this._aspirador = aspirador;
        }
        else {
            if (!aspirador) {
                throw new Error("Dependência da classe não foi passada.");
            }
            throw new Error("Dependência da classe está incorreta.");
        }
    }

    TEMPO_DE_ATUALIZACAO = 1000;

    posicaoParada = {
        x: 0,
        y: 0,
    }

    tudoLimpo = false;

    estrutura = [
        [true, false, true, false, false, true],
        [false, true, true, true, false, true],
        [false, true, false, true, false, true],
        [true, false, true, true, false, true],
        [false, false, false, true, false, true],
        [true, false, true, false, false, true],
    ];

    // estrutura = [
    //     [true, false, true, false],
    //     [false, true, true, true],
    //     [false, true, false, true],
    //     [true, false, true, true],
    // ];

    mostrarStatusDoAspirador() {
        console.log(`
            Espaço disponível na bolsa: ${this._aspirador.bolsa.espacoDisponivel}
            Sujeira coletada: ${this._aspirador.bolsa.sujeiraColetada}
            Energia: ${this._aspirador.energia}
        `)
    }

    direcao = 'BAIXO';
    virarDireita = false;
    voltandoParaPosicaoParada = false;
    bolsaCheia = false;

    voltarParaPosicaoParada() {
        const [posX, posY] = [this._aspirador.posicaoAtual.x, this._aspirador.posicaoAtual.y];
        const [paradaX, paradaY] = [this.posicaoParada.x, this.posicaoParada.y];
        const chegouNaLinhaParada = posY === paradaY;
        const chegouNaColunaParada = posX === paradaX;

        this.mostrarPosicaoAtual();

        if (!chegouNaLinhaParada) {
            this._aspirador.mover().baixo();
        }

        if (chegouNaLinhaParada && !chegouNaColunaParada) {
            this._aspirador.mover().direita();
        }

        if (posX === paradaX && posY === paradaY) {
            this.voltandoParaPosicaoParada = false;
            return;
        }

        
    }

    voltarAoInicio() {
        const [posX, posY] = [this._aspirador.posicaoAtual.x, this._aspirador.posicaoAtual.y];
        const estaNaUltimaColuna = posX === 0;

        if (posX === 0 && posY === 0) {
            return;
        }

        if (estaNaUltimaColuna) {
            this._aspirador.mover().cima();
            return;
        }

        this._aspirador.mover().esquerda();
    }


    limparQuarto () {

        // Iniciando a limpeza
        this._aspirador.ligar(this.estrutura);
        this.mostrarEstrutura();
        this.mostrarPosicaoAtual();
        this.mostrarStatusDoAspirador();

        if (this.tudoLimpo) {
            this.voltarAoInicio();
            return;
        };

        if (this.bolsaCheia) {
            const [posX, posY] = [this._aspirador.posicaoAtual.x, this._aspirador.posicaoAtual.y];

            if (posX === 0 && posY === 0) {
                this._aspirador.esvaziarBolsa();
                this.voltandoParaPosicaoParada = true;
                this.bolsaCheia = false;
                return;
            }

            console.log("A bolsa está cheia, é necessário voltar para esvaziar!");
            console.log('Voltando ao início...');
            this.voltarAoInicio();

            return;
        }

        if (this.voltandoParaPosicaoParada) {
            this.voltarParaPosicaoParada();
            
            console.log("A bolsa está vazia novamente, a limpeza deve continuar de onde parou!");
            console.log('Voltando ao local parado...');
            return;
        }

        // Posições x e y antes do próximo movimento ser feito.
        const [posX, posY] = [this._aspirador.posicaoAtual.x, this._aspirador.posicaoAtual.y];
        let chegouAoFinal = posY === 0 && posX === (this._aspirador.estruturaParaLimpar[posY].length - 1);

        if (this._aspirador.estruturaParaLimpar[posY][posX] === false) {
            console.log('limpando...');
            this._aspirador.limpar();

            this.bolsaCheia = this._aspirador.verificarBolsa().bolsaCheia;
            if (this.bolsaCheia) {
                this.posicaoParada = {
                    x: posX,
                    y: posY
                }
                return;
            }
        }

        if (this.virarDireita && !chegouAoFinal) {
            this._aspirador.mover().direita();
            this.virarDireita = false;
            return;
        }

        switch (this.direcao) {
            case 'BAIXO': {
                this._aspirador.mover().baixo();
                break;
            }

            case 'CIMA': {
                this._aspirador.mover().cima();
                break;
            }

            default: 
                return;
        }   

        const [x, y] = [this._aspirador.posicaoAtual.x, this._aspirador.posicaoAtual.y];
        const chegouLimiteProfundidade = y === this._aspirador.estruturaParaLimpar.length - 1;
        const chegouLimiteAltura = y === 0;
        
        if (chegouLimiteProfundidade) {
            this.direcao = 'CIMA';

            this.virarDireita = true;
        }
        else if (chegouLimiteAltura) {
            this.direcao = 'BAIXO';

            this.virarDireita = true;
        }

        if (chegouAoFinal) {
            this.tudoLimpo = true;
            return;
        }
    }

    mostrarEstrutura() {

        const estruturaParaLimpar = this._aspirador.estruturaParaLimpar;
        const [posX, posY] = [this._aspirador.posicaoAtual.x, this._aspirador.posicaoAtual.y];
    
        // i = y => ou seja, i = subir / descer.
        // j = x => ou seja, j = esquerda / direita.
        // logo "_estruturaParaLimpar[y][x]" é a forma correta de manipular a matriz.
    
        for (let i = 0; i < estruturaParaLimpar.length; i++) {
            let line = '';
            for (let j = 0; j < estruturaParaLimpar[i].length; j++) {
    
                const [x, y] = [posX, posY];
    
                if (y === i && x === j) {
                    line += `|((ASP))|`;
                }
                else {
                    line += `${estruturaParaLimpar[i][j] ? '| LIMPO |' : '| SUJO  |'}`;
                }
            }
            console.log(line);
        }
    }
    
    mostrarPosicaoAtual() {
        const [posX, posY] = [this._aspirador.posicaoAtual.x, this._aspirador.posicaoAtual.y];
    
        console.log(`x: ${posX} y: ${posY}`);
    }


    iniciarLimpeza() {
        let interval = setInterval(() => {

            const [posX, posY] = [this._aspirador.posicaoAtual.x, this._aspirador.posicaoAtual.y];
            if (this.tudoLimpo && (posX === 0 && posY === 0)) {
                console.clear();
                this.mostrarEstrutura();
                this.mostrarPosicaoAtual();
                this.mostrarStatusDoAspirador();
                clearInterval(interval);
        
            }
            
            console.clear();
            this.limparQuarto();
    
        }, this.TEMPO_DE_ATUALIZACAO);
    }
}

// O aspirador possuí inicialmente 100 pontos de energia, cada ação custa 1 energia.
// O aspirador possui uma bolsa com a capacidade máxima para sugar somente 10 sujeiras.
// Após cada aspiração o agenete (aspirador) deve verficar sua bolsa,
// Se a bolsa estiver cheia o agente deve retornar ao inicio, esvaziar a bolsa e aspirar novamente.