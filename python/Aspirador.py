import sys

class Aspirador:
    def __init__(self):
        self._posicaoAtual = {
            "x": 0,
            "y": 0,
        }
        self._estruturaParaLimpar = []
        self._energia = 100
        self._bolsa = {
            "espacoDisponivel": 10,
            "sujeiraColetada": 0,
        }

    def mover(self):

        def void(): return

        if self._energia == 0:
            print("Energia esgotada!!!")
            # sys.exit()
            return {
                "cima": void,
                "baixo": void,
                "esquerda": void,
                "direita": void,
            }

        self._energia -= 1

        def cima():
            if self._posicaoAtual["y"] == 0:
                print("Não é possível subir!")

            self._posicaoAtual["y"] -= 1

        def baixo():
            if self._posicaoAtual["y"] == len(self._estruturaParaLimpar) - 1:
                print("Não é possível descer!")

            self._posicaoAtual["y"] += 1

        def esquerda():
            x = self._posicaoAtual["x"]
            if x == 0:
                print("Não é possível mover-se para a esquerda!")

            self._posicaoAtual["x"] -= 1

        def direita():
            x, y = self._posicaoAtual["x"], self._posicaoAtual["y"]
            if x == len(self._estruturaParaLimpar[y]) - 1:
                print("Não é possível mover-se para a direita!")

            self._posicaoAtual["x"] += 1

        return {
            "cima": cima,
            "baixo": baixo,
            "esquerda": esquerda,
            "direita": direita,
        }

    def ligar(self, estruturaParaLimpar):
        if not estruturaParaLimpar or len(estruturaParaLimpar) == 0:
            print("Não há estrutura para limpar")
            self.mostrarEstrutura()
            return
        self._estruturaParaLimpar = estruturaParaLimpar

    def limpar(self):

        if self._energia == 0:
            print("Energia esgotada!!!")
            return False
            # sys.exit()
        else:
            x, y = self._posicaoAtual["x"], self._posicaoAtual["y"]
            self._estruturaParaLimpar[y][x] = True
            self._energia -= 1
            self._bolsa["espacoDisponivel"] -= 1
            self._bolsa["sujeiraColetada"] += 1

    def verificarBolsa(self):
        return {
            "bolsaCheia": self._bolsa["espacoDisponivel"] == 0,
        }

    def esvaziarBolsa(self):
        self._bolsa["espacoDisponivel"] = 10

    def recarregarEnergia(self):
        pass

    def voltarAoInicio(self):
        self._posicaoAtual = {
            "x": 0,
            "y": 0,
        }

    @property
    def posicaoAtual(self):
        return self._posicaoAtual

    @property
    def estruturaParaLimpar(self):
        return self._estruturaParaLimpar

    @property
    def energia(self):
        return self._energia

    @property
    def bolsa(self):
        return self._bolsa