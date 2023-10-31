import { Aspirador } from './Aspirador.js';
import { Quarto } from './Quarto.js';

const aspirador = new Aspirador();
const quarto = new Quarto(aspirador);

quarto.iniciarLimpeza();

// O aspirador possuí inicialmente 100 pontos de energia, cada ação custa 1 energia.
// O aspirador possui uma bolsa com a capacidade máxima para sugar somente 10 sujeiras.
// Após cada aspiração o agenete (aspirador) deve verficar sua bolsa,
// Se a bolsa estiver cheia o agente deve retornar ao inicio, esvaziar a bolsa e aspirar novamente.