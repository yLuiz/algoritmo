export class Aspirador {

    _posicaoAtual = {
        x: 0,
        y: 0,
    }

    _estruturaParaLimpar = [];

    constructor() {}

    _energia = 100;
    
    _bolsa = {
        espacoDisponivel: 100,
        sujeiraColetada: 0,
    };

    mover() {

        this._energia--;

        return {
            cima: () => {
                if (this._posicaoAtual.y === 0) {
                    console.log("Não é possível subir!");
                    return;
                }
                this._posicaoAtual.y--;
            },
            baixo: () => {
                if (this._posicaoAtual.y === (this._estruturaParaLimpar.length - 1)) {
                    console.log("Não é possível descer!");
                    return;
                }

                this._posicaoAtual.y++;
            },
            esquerda: () => {

                const x = this._posicaoAtual.x;

                if (x === 0) {
                    console.log("Não é possível mover-se para esquerda!");
                    return;
                }

                this._posicaoAtual.x--;
            },
            direita: () => {

                const [x, y] = [this._posicaoAtual.x, this._posicaoAtual.y];

                if (x === (this._estruturaParaLimpar[y].length - 1)) {
                    console.log("Não é possível mover-se para direita!");
                    return;
                }

                this._posicaoAtual.x++;
            },
        }
    }

    ligar(estruturaParaLimpar) {
        if (!estruturaParaLimpar || estruturaParaLimpar.length === 0) {
            console.log("Não há estrutura para limpar");
            this.mostrarEstrutura();
            return;
        }
        this._estruturaParaLimpar = estruturaParaLimpar;
    }

    limpar() {
        const [x, y] = [this._posicaoAtual.x, this._posicaoAtual.y];

        this._estruturaParaLimpar[y][x] = true;
        this._bolsa.espacoDisponivel--;
        this._bolsa.sujeiraColetada++;
    }

    verificarBolsa() {
        return {
            bolsaCheia: this._bolsa.espacoDisponivel === 0,
        }
    }
    
    esvaziarBolsa() {
        this._bolsa.espacoDisponivel = 10;
    }

    recarregarEnergia() {}
    
    voltarAoInicio() {
        this._posicaoAtual = {
            x: 0,
            y: 0,
        }
    }

    mostrarPosicaoAtual() {
        console.log(`x: ${this._posicaoAtual.x} y: ${this._posicaoAtual.y}`);
    }

    mostrarEstrutura() {

        // i = y => ou seja, i = subir / descer.
        // j = x => ou seja, j = esquerda / direita.
        // logo "_estruturaParaLimpar[y][x]" é a forma correta de manipular a matriz.

        for (let i = 0; i < this._estruturaParaLimpar.length; i++) {
            let line = '';
            for (let j = 0; j < this._estruturaParaLimpar[i].length; j++) {

                const [x, y] = [this._posicaoAtual.x, this._posicaoAtual.y];

                if (y === i && x === j) {
                    line += `|( ASP )|`;
                }
                else {
                    line += `${this._estruturaParaLimpar[i][j] ? '| LIMPO |' : '| SUJO  |'}`;
                }
            }
            console.log(line);
        }
    }

    get posicaoAtual() {
        return this._posicaoAtual;
    }

    get estruturaParaLimpar() {
        return this._estruturaParaLimpar;
    }

    get energia() {
        return this._energia;
    }
    
    get bolsa() {
        return this._bolsa;
    }

}