import time
import os
import sys
from Aspirador import Aspirador

class Quarto:
    def __init__(self, aspirador):
        if isinstance(aspirador, Aspirador):
            self._aspirador = aspirador
        else:
            if not aspirador:
                raise Exception("Dependência da classe não foi passada.")
            raise Exception("Dependência da classe está incorreta.")

    TEMPO_DE_ATUALIZACAO = 1000
    posicaoParada = {
        "x": 0,
        "y": 0,
    }
    tudoLimpo = False
    estrutura = [
        [True, False, True, False, False, True],
        [False, True, True, True, False, True],
        [False, True, False, True, False, True],
        [True, False, True, True, False, True],
        [False, False, False, True, False, True],
        [True, False, True, False, False, True],
    ]
    direcao = 'BAIXO'
    virarDireita = False
    voltandoParaPosicaoParada = False
    bolsaCheia = False

    def mostrarStatusDoAspirador(self):
        espaco_disponivel = self._aspirador.bolsa["espacoDisponivel"]
        sujeira_coletada = self._aspirador.bolsa["sujeiraColetada"]
        energia = self._aspirador.energia

        print(f"""
            Espaço disponível na bolsa: {espaco_disponivel}
            Sujeira coletada: {sujeira_coletada}
            Energia: {energia}
        """)

    def voltarParaPosicaoParada(self):
        posX, posY = self._aspirador.posicaoAtual["x"], self._aspirador.posicaoAtual["y"]
        paradaX, paradaY = self.posicaoParada["x"], self.posicaoParada["y"]
        chegouNaLinhaParada = posY == paradaY
        chegouNaColunaParada = posX == paradaX
        self.mostrarPosicaoAtual()

        if not chegouNaLinhaParada:
            self._aspirador.mover()["baixo"]()

        if chegouNaLinhaParada and not chegouNaColunaParada:
            self._aspirador.mover()["direita"]()

        if posX == paradaX and posY == paradaY:
            self.voltandoParaPosicaoParada = False
            return

    def voltarAoInicio(self):
        posX, posY = self._aspirador.posicaoAtual["x"], self._aspirador.posicaoAtual["y"]
        estaNaUltimaColuna = posX == 0

        if posX == 0 and posY == 0:
            return

        if estaNaUltimaColuna:
            self._aspirador.mover()["cima"]()
            return

        self._aspirador.mover()["esquerda"]()

    def limparQuarto(self):
        os.system("cls")
        self._aspirador.ligar(self.estrutura)
        self.mostrarEstrutura()
        self.mostrarPosicaoAtual()
        self.mostrarStatusDoAspirador()

        if self._aspirador.energia == 0: 
            sys.exit()
            return

        if self.tudoLimpo:
            self.voltarAoInicio()
            return

        if self.bolsaCheia:
            posX, posY = self._aspirador.posicaoAtual["x"], self._aspirador.posicaoAtual["y"]

            if posX == 0 and posY == 0:
                self._aspirador.esvaziarBolsa()
                self.voltandoParaPosicaoParada = True
                self.bolsaCheia = False
                return

            print("A bolsa está cheia, é necessário voltar para esvaziar!")
            print('Voltando ao início...')
            self.voltarAoInicio()
            return

        if self.voltandoParaPosicaoParada:
            self.voltarParaPosicaoParada()
            print("A bolsa está vazia novamente, a limpeza deve continuar de onde parou!")
            print('Voltando ao local parado...')
            return

        posX, posY = self._aspirador.posicaoAtual["x"], self._aspirador.posicaoAtual["y"]
        chegouAoFinal = posY == 0 and posX == len(self._aspirador.estruturaParaLimpar[posY]) - 1

        if not self._aspirador.estruturaParaLimpar[posY][posX]:
            print('limpando...')
            self._aspirador.limpar()

            bolsa_status = self._aspirador.verificarBolsa()
            self.bolsaCheia = bolsa_status["bolsaCheia"]
            if self.bolsaCheia:
                self.posicaoParada = {"x": posX, "y": posY}
                return

        if self.virarDireita and not chegouAoFinal:
            self._aspirador.mover()["direita"]()
            self.virarDireita = False
            return

        if self.direcao == 'BAIXO':
            self._aspirador.mover()["baixo"]()
        elif self.direcao == 'CIMA':
            self._aspirador.mover()["cima"]()

        posX, posY = self._aspirador.posicaoAtual["x"], self._aspirador.posicaoAtual["y"]
        chegouLimiteProfundidade = posY == len(self._aspirador.estruturaParaLimpar) - 1
        chegouLimiteAltura = posY == 0

        if chegouLimiteProfundidade:
            self.direcao = 'CIMA'
            self.virarDireita = True
        elif chegouLimiteAltura:
            self.direcao = 'BAIXO'
            self.virarDireita = True

        if chegouAoFinal:
            self.tudoLimpo = True

    def mostrarEstrutura(self):
        estruturaParaLimpar = self._aspirador.estruturaParaLimpar
        posX, posY = self._aspirador.posicaoAtual["x"], self._aspirador.posicaoAtual["y"]

        for i in range(len(estruturaParaLimpar)):
            line = ''
            for j in range(len(estruturaParaLimpar[i])):
                x, y = posX, posY

                if y == i and x == j:
                    line += "|((ASP))|"
                else:
                    line += "| LIMPO |" if estruturaParaLimpar[i][j] else "| SUJO  |"
            print(line)

    def mostrarPosicaoAtual(self):
        posX, posY = self._aspirador.posicaoAtual["x"], self._aspirador.posicaoAtual["y"]
        print(f'x: {posX} y: {posY}')

    def iniciarLimpeza(self):
        while True:
            posX, posY = self._aspirador.posicaoAtual["x"], self._aspirador.posicaoAtual["y"]
            if self.tudoLimpo and (posX == 0 and posY == 0):
                self.mostrarEstrutura()
                self.mostrarPosicaoAtual()
                self.mostrarStatusDoAspirador()
                print("Limpeza concluída.")
                print()
                break
            self.limparQuarto()
            time.sleep(1);

    # def iniciarLimpeza(self):
    #     def callback():
    #         posX, posY = self._aspirador.posicaoAtual["x"], self._aspirador.posicaoAtual["y"]
    #         if self.tudoLimpo and (posX == 0 and posY == 0):
    #             print("Limpeza concluída.")
    #             print()
    #         self.limparQuarto()

    #     while (not self.tudoLimpo and (posX != 0 and posY != 0)):
    #         time.sleep(1);
    #         callback()