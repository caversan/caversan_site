/*
JS CAVERSAN MINEFIELD version 0.001

Data: 08/04/2013
Autor: Adriano Caversan
E-mail: adriano.caversan@gmail.com
*/


////////////////////////////
// INÍCIO DO CAMPO MINADO //
////////////////////////////


//Aqui eu declaro um array de dificuldades que eu usarei durante o jogo
var dificuldades = [{ nome: "FÁCIL", nivel: 1, percent: 15 }, { nome: "MÉDIO", nivel: 2, percent: 25 }, { nome: "DIFÍCIL", nivel: 3, percent: 50 }];

// Abaixo iremos declarar alguns parâmetros como default
var currentDif = dificuldades[0].percent; // Dificuldade fácil
var currentDifNivel = dificuldades[0].nivel; // Dificuldade fácil
var currentDifLabel = dificuldades[0].nome; // Dificuldade fácil
var showNeighborhood = false; // mostra vizinhança false
var colunas = 20; // número de colunas
var linhas = 20; // número de linhas
///////////////////////////////////////////////////////////////////////////////////////

// Boleanas para controle do fluxo do jogo
var jogando = false; // jogando false
var pausado = false; // pausado false
var bombas = false; // bombas false
var concluido = false; //jogo concluido false
///////////////////////////////////////////////////////////////////////////////////////

// Abaixo vamos setar algumas propriedades de movieclips distribuídos pelo palco
/*
BT_S._visible = false;// Botão de sim ou não da janela de RESTART
BT_N._visible = false;// Botão de sim ou não da janela de RESTART
BT_FIM_S._visible = false;// Botão de sim ou não da janela de FIM DE JOGO
BT_FIM_N._visible = false;// Botão de sim ou não da janela de FIM DE JOGO
BT_INICIAR._visible = true;// Botão iniciar
BT_PAUSE._visible = true;// Botão pause
RESTART_FRAME._visible = false;//janela de opção para reinicio do jogo
FIM_DE_JOGO_FRAME._visible = false;//janela de opção para FIM_DE_JOGO
PAUSED._visible = false;//janela de alerta do jogo pausado
ALERTANOME._visible = false;// alerta para inserção do player
*/
//////////////////////////////////////////////////////////////////////////////////////







//a função abaixo costumo usar para limpar e resetar variaveis e campos de texto para que não ocorram erros como NAN, undefined ou null
setMineField(linhas, colunas, currentDif);


//////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////
//  A partir daqui construímos a    //
//          navagação do jogo.      //
//////////////////////////////////////

//NAVEGAÇÃO DO JOGO
// Nome do Jogador
this.onEnterFrame = function() {
    //Força o nome do jogador em caixa alta
    if (txtPlayer.type == "input") {
        // aqui eu testo se o campo é input ou dinâmico só assim eu converto o que foi digitado para caixa alta
        txtPlayer.text = _player.toUpperCase();
    }
};

//NÍVEIS DE DIFICULDADE
CHECK_FACIL.onRelease = function() {
    if (jogando == false) {
        currentDifLabel = dificuldades[0].nome;
        currentDifNivel = dificuldades[0].nivel;
        currentDif = dificuldades[0].percent; // aqui eu inicio o campo minado enviando os argumentos necessários para a função
        CHECK_FACIL.gotoAndStop(2);
        CHECK_MEDIO.gotoAndStop(1);

        CHECK_DIFICIL.gotoAndStop(1);

    }
};
CHECK_MEDIO.onRelease = function() {
    if (jogando == false) {
        currentDifLabel = dificuldades[1].nome;
        currentDifNivel = dificuldades[1].nivel;
        currentDif = dificuldades[1].percent; // aqui eu inicio o campo minado enviando os argumentos necessários para a função
        CHECK_FACIL.gotoAndStop(1);
        CHECK_MEDIO.gotoAndStop(2);
        CHECK_DIFICIL.gotoAndStop(1);

    }
};
CHECK_DIFICIL.onRelease = function() {
    if (jogando == false) {
        currentDifLabel = dificuldades[2].nome;
        currentDifNivel = dificuldades[2].nivel;
        currentDif = dificuldades[2].percent; // aqui eu inicio o campo minado enviando os argumentos necessários para a função
        CHECK_FACIL.gotoAndStop(1);
        CHECK_MEDIO.gotoAndStop(1);
        CHECK_DIFICIL.gotoAndStop(2);

    }
};
CHECK_CASAS.onRelease = function() {
    if (jogando == false) {
        if (showNeighborhood == false) {
            showNeighborhood = true;
            CHECK_CASAS.gotoAndStop(2);
        } else {
            showNeighborhood = false;
            CHECK_CASAS.gotoAndStop(1);
        }

    }
};

//Ações do botão iniciar
BT_INICIAR.onRollOver = function() {
    //RollOver do botão
    BT_INICIAR.gotoAndStop(2);
};
BT_INICIAR.onRollOut = function() {
    //RollOver do botão
    BT_INICIAR.gotoAndStop(1);
};

BT_INICIAR.onRelease = function() {
    //Click do botão
    if (jogando == false && bombas == false && _player != "") {
        //Se a partida não estiver iniciada inicia-se ela com uma matriz 20x20 e o nível de dificuldade selecionado
        setMineField(linhas, colunas, currentDif); // aqui eu inicio o campo minado enviando os argumentos necessários para a função
        //Desabilita a edição do campo de texto NOME tornando-o dinâmico ao invés de input
        txtPlayer.type = "dynamic";
    } else if (_player == "") {
        //Obrigatoriamente devemos por um nome para o jogador
        BT_INICIAR._visible = false; //... tornamos os botões de iniciar e pause inativos e invisíveis ...
        BT_PAUSE._visible = false;
        ALERTANOME._visible = true; //... mostramos um alerta para a inserção de um nome ... 
        //Este alerta ficará por 2 segundos e fechará sozinho reabilitando os botões

        i_alerta = setInterval(function() {
            clearInterval(i_alerta);
            delete i_alerta;
            BT_INICIAR._visible = true;
            BT_PAUSE._visible = true;
            ALERTANOME._visible = false;
        }, 1000);

    } else if (jogando == true || bombas == true) {
        // Caso o jogo já esteja em andamento...
        pausado = true; //... pausamos ele...
        BT_INICIAR._visible = false; //... tornamos os botões de iniciar e pause inativos e invisíveis ...
        BT_PAUSE._visible = false;
        RESTART_FRAME._visible = true; //... mostramos a janela de opção para reinício do jogo ... 
        BT_S._visible = true; // ... habilitamos o botão de SIM ou NÃO .
        BT_N._visible = true;
    }
};

//Ações do botão SIM
BT_S.onRollOver = function() {
    //RollOver do botão
    BT_S.gotoAndStop(2);
};
BT_S.onRollOut = function() {
    //RollOver do botão
    BT_S.gotoAndStop(1);
};

BT_S.onRelease = function() {
    //Click do botão
    // Caso na janela de opção pelo reinínio do jogo selecionemos SIM...
    BT_S._visible = false; // Escondemos os botões SIM e NÃO
    BT_N._visible = false;
    RESTART_FRAME._visible = false; // Escondemos a janela de opção
    BT_INICIAR._visible = true; // Reabilitamos os botões de INICIAR e PAUSE
    BT_PAUSE._visible = true;

    // Por fim evocamos a função clearMineField(linhas,colunas,true)
    clearMineField(linhas, colunas, true);

};

//Ações do botão NÃO
BT_N.onRollOver = function() {
    //RollOver do botão
    BT_N.gotoAndStop(2);
};
BT_N.onRollOut = function() {
    //RollOver do botão
    BT_N.gotoAndStop(1);
};

BT_N.onRelease = function() {
    //Click do botão

    // Caso optemos por não também escondemos a janela de opção e seus botões e também reabilitamos os botões de iniciar e pause
    BT_S._visible = false;
    BT_N._visible = false;
    RESTART_FRAME._visible = false;
    BT_INICIAR._visible = true;
    BT_PAUSE._visible = true;
    // Além de despausarmos o jogo
    pausado = false;

};



//Ações do botão SIM NO FIM DE JOGO
BT_FIM_S.onRollOver = function() {
    //RollOver do botão
    BT_FIM_S.gotoAndStop(2);
};
BT_FIM_S.onRollOut = function() {
    //RollOver do botão
    BT_FIM_S.gotoAndStop(1);
};

BT_FIM_S.onRelease = function() {
    //Click do botão
    // Caso na janela de opção pelo DO FIM DO JOGO selecionemos SIM...
    BT_FIM_S._visible = false; // Escondemos os botões SIM e NÃO
    BT_FIM_N._visible = false;
    FIM_DE_JOGO_FRAME._visible = false; // Escondemos a janela de opção
    BT_INICIAR._visible = true; // Reabilitamos os botões de INICIAR e PAUSE
    BT_PAUSE._visible = true;

    //Inserimos o score do jogador no ranking
    insertScore(_player.toUpperCase(), currentDifNivel, currentDifLabel, cronometro);

    // Por fim evocamos a função clearMineField(linhas,colunas,true)
    clearMineField(linhas, colunas, false);

};

//Ações do botão NÃO
BT_FIM_N.onRollOver = function() {
    //RollOver do botão
    BT_FIM_N.gotoAndStop(2);
};
BT_FIM_N.onRollOut = function() {
    //RollOver do botão
    BT_FIM_N.gotoAndStop(1);
};

BT_FIM_N.onRelease = function() {
    //Click do botão
    // Caso na janela de opção pelo DO FIM DO JOGO selecionemos SIM...
    BT_FIM_S._visible = false; // Escondemos os botões SIM e NÃO
    BT_FIM_N._visible = false;
    FIM_DE_JOGO_FRAME._visible = false; // Escondemos a janela de opção
    BT_INICIAR._visible = true; // Reabilitamos os botões de INICIAR e PAUSE
    BT_PAUSE._visible = true;

    //Inserimos o score do jogador no ranking
    insertScore(_player, currentDifNivel, currentDifLabel, cronometro);

    // Por fim evocamos a função clearMineField(linhas,colunas,false)
    clearMineField(linhas, colunas, true);

};


//Ações do botão pause
BT_PAUSE.onRollOver = function() {
    //RollOver do botão
    BT_PAUSE.gotoAndStop(2);
};
BT_PAUSE.onRollOut = function() {
    //RollOver do botão
    BT_PAUSE.gotoAndStop(1);
};
BT_PAUSE.onRelease = function() {
    //Click do botão
    if (jogando == true && pausado == false) {
        // caso o jogo esteja em andamento e o pausamos e mostramos uma janela de alerta que avisa quanto ao jogo pausado
        pausado = true;
        PAUSED._visible = true;
    } else if (jogando == true && pausado == true) {
        // caso o jogo esteja em andamento e já esteja pausado retorno o jogo ao estado antes de ser pausado
        pausado = false;
        PAUSED._visible = false;
    }
};
//FIM NAVEGAÇÃO DO JOGO

////////////////////////////////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////
//  A partir daqui temos as ações que    //
//  montam ou destroem o campo minado.   //
/////////////////////////////////////////////

// SETUP DO CAMPO MINADO
function setMineField(lines, columns, difficulty) {
    console.log(lines)
    console.log(columns)
    console.log(difficulty)
        // argumentos
        // lines: numero de linhas do campo minado
        // columns: numero de colunas do campo minado
        // difficulty: percentual de minas no campo minado

    // setamos jogando igual a true indicando que a partida está em andamento
    jogando = true;
    // setamos concluido igual a false indicando que o jogador não conseguiu achar todas as bombas
    concluido = false;

    // zeramos o placar
    cellsToLeft = (lines * columns) * (100 - difficulty) / 100;
    // document.getElementsByClassName("txtFaltam")[0].innerHTML = cellsToLeft;
    // zeramos o cronometro
    cronometro = 0;
    //document.getElementsByClassName("txtTempo")[0].innerHTML = cronometro;


    // PREENCHIMENTO DO ARRAY

    mineField = []; // array vazio
    document.writeln("<body>")
    document.writeln("<div class=\"minesBody\">")
    for (i = 0; i < lines; i++) {
        mineField[i] = []; // aqui eu crio um array em cada item do meu array principal tornando-o multidimensional, trataremos estes itens como as linhas do meu campo minado

        document.writeln("<div class=\"minesRow\">")

        for (j = 0; j < columns; j++) {
            //document.writeln("<a href=\"#\" class=\"minesBt\"></a>")
            document.writeln("<div class=\"minesBt\"></div>")
            mineField[i][j] = []; // cada célula desse array terá
            // dai eu inicio meu array com todos os campos zerados
            mineField[i][j].nome = 0; // um campo nome que usarei para dizer para a célula que tipo de informação ela deve mostrar para o jogador (o desenho de uma bomba, o numero de bombas nas casas vizinhas ou ainda uma célula em branco)
            mineField[i][j].valor = 0; // este é o conteúdo propriamente dito 0 ou -1
        }

        document.writeln("</div>")
    }
    document.writeln("</div>")
    document.writeln("</body>")
        // FIM DO PREENCHIMENTO DO ARRAY

    outPut(lines, columns);


    // SORTEIO DAS BOMBAS
    k = 0; // aqui eu crio um indice k para controle laço que fará a distribuição aleatória das minas
    while (k < (lines * columns * difficulty / 100)) {
        // enquanto k for menor que o percentual do total de casas no meu campo dado pela equação lines*columns (total de casas) *difficulty/100 (porcentagem de dificuldade) eu continuo neste laço
        i = Math.floor(Math.random() * lines); // aqui eu armazeno o sorteio de uma linha
        j = Math.floor(Math.random() * columns); // aqui eu armazeno o sorteio de uma coluna
        if (mineField[i][j].valor == 0) {
            //aqui eu confiro se o valor da casa sorteada corresponde a 0 e preencho ela como 1 e incremento o k desta forma eu garanto que somente casas vazias sejam preenchidas com bombas e que todas as bombas serão implantadas
            mineField[i][j].valor = 1;
            k++;
        }
    }
    // FIM DO SORTEIO DAS BOMBAS

    outPut(lines, columns);

    // NOMENCLATURA DAS CASAS

    for (i = 0; i < lines; i++) {
        for (j = 0; j < columns; j++) {
            // aqui eu varro cada item do meu array inteiro e a cada célula eu inicio um contador n
            var n = 0;
            for (l = i - 1; l <= (i + 1); l++) {
                // faço uma varredura nas casas vizinhas atrás de bombas iniciado na linha anterior e terminando até a linha posterior...
                for (m = j - 1; m <= (j + 1); m++) {
                    // ... faço a mesma coisa da coluna anterior e vai até a coluna posterior
                    //console.log(mineField[0][0].valor)
                    if (l >= 0 && m >= 0 && l < lines && m < columns) {
                        if (mineField[l][m].valor == 1) {
                            // cada bomba achada eu incremento meu contador
                            n++;
                        }
                    }
                }
            }
            // e enfim mudo o valor da célula para o valor de bombas vizinhas
            if (mineField[i][j].valor == 1) {
                mineField[i][j].nome = n - 1; // se a casa analizada contiver uma bomba esta foi contada na varredura, logo subtraio ela
            } else {
                mineField[i][j].nome = n; // agora se for uma casa vazia coloco o valor das bombas das casas vizinhas
            }
        }
    }

    // FIM DA NOMENCLATURA DAS CASAS
    outPut(lines, columns);

    // MULTIPLICAR CÉLULAS

    // ESTA É A ÚLTIMA INTERAÇÃO DA FUNÇÃO setMineField(), A PARTIR DAQUI EU MULTIPLICO AS CÉLULAS E ESTA MULTIPLICAÇÃO É DIVIDIDA EM DUAS PARTES
    // 1º - ANEXAR O MOVIECLIP "cell" NO PALCO E ALIMENTAR O MOVIECLIP ANEXADO COM PARAMETROS DIVERSOS
    // 2º - IMPLMENTAR FUNCIONALIDADES AO MOVIECLIP "cell" NO PALCO

    // possíveis cores para o texto dos labels
    coresNome = ["ff00ff", "330066", "990000", "ff6666", "9900ff", "666600", "003366", "006600"];
    // Aqui eu crio um laço que fará uma interação em cada célula do meu campo minado
    for (i = 0; i < lines; i++) {
        for (j = 0; j < columns; j++) {

            // Anexo um movieclip previamente construido e armazenado na biblioteca do meu arquivo FLA
            // Este movieclip possui 3 layers apresentáveis, um background para a célula clicada,
            // uma layer labels onde eu armazeno o conteúdo a ser mostrado, uma layer foreground que oculta o conteúdo de labels.
            // Note que a instancia do movieclip no palco é "cell-LINHA-COLUNA"
            // os valores de i e j são usados o tempo todo no script deste jogo para instanciar elementos ou, como no caso abaixo,
            // o i e o j participam de operações matemáticas, aqui eu multiplico o valor do indice do array pelo tamanho da célula
            // afim de posicioná-la ao redor do palco.
            this.attachMovie("cell", "cell-" + i + "-" + j, this.getNextHighestDepth());
            this["cell-" + i + "-" + j]._x = i * this["cell-" + i + "-" + j]._width;
            this["cell-" + i + "-" + j]._y = j * this["cell-" + i + "-" + j]._height;

            // Aqui eu declaro em cada movieclip variáveis que serão usadas por cada um deles
            //linha e coluna do array que esta célula busca informações
            this["cell-" + i + "-" + j].lin = i;
            this["cell-" + i + "-" + j].col = j;
            // digo se o conteúdo da céclula está ocultado ou se a célula já foi clicada
            this["cell-" + i + "-" + j]._openned = false;
            // inicio o movieclip parado
            this["cell-" + i + "-" + j].stop();

            // o movieclip "cell" possui três estados representados por três frames diferentes
            if (mineField[i][j].valor == 1) {
                // se o valor no array mineField referente a esta célula for igual a 1 significa
                // que temos uma bomba nesta celula e mandamos apresentar o frame 3 do movieclip
                // onde teremos uma bomba desenhada
                this["cell-" + i + "-" + j].gotoAndStop(3);

            } else if (mineField[i][j].valor == 0 && mineField[i][j].nome > 0) {
                // se o valor no array mineField referente a esta célula for igual a 0 e o nome for maior que 0
                // significa que não temos uma bomba e existem bombas vizinhas a célula em questão, logo,
                // apresentamos o frame 2 onde temos o campo de texto dinâmico "texto" e mostraremos o número de células vizinhas
                // previamente armazenados em mineField[i][j].nome, uso o valor escrito em nome também para selecionar a cor do texto segundo o array coresNome
                this["cell-" + i + "-" + j].gotoAndStop(2);
                this["cell-" + i + "-" + j].texto.htmlText = "<font color='#" + coresNome[Number(mineField[i][j].nome) - 1] + "'>" + mineField[i][j].nome;
            }
            // Em último caso teríamos as células vazias neste caso o movieclip permanece no frame 1                                                  

            // À partir daqui acrescentamos funcionalidade às células para que elas reajam ao clique

            // Declaramos uma cunção chamada showCell que será chamada no evento do mouse
            this["cell-" + i + "-" + j].showCell = function() {

                // no clique conferimos se temos uma bomba na célula e se ela está oculta
                if (mineField[this.lin][this.col].valor == 1 && this._openned == false) {
                    // caso verdadeiro "BOOOOOOOOMBA"
                    trace("BOOOM");

                    // setamos jogando igual a false para pausar o jogo
                    jogando = false;

                    // informo que as bombas foram acionadas
                    bombas = true;

                    // aplicamos o estado clicado para a celula
                    this._openned = true;
                    // e oculto o foreground para mostrar o conteúdo da célula
                    this.hidden._visible = false;

                    // neste laço eu faço uma busca por todas as outras bombas do palco e às mostro
                    for (this.i = 0; this.i < lines; this.i++) {
                        for (this.j = 0; this.j < columns; this.j++) {
                            if (mineField[this.i][this.j].valor == 1) {
                                ["cell-" + this.i + "-" + this.j].showCell();
                            }
                        }
                    }
                } else if (mineField[this.lin][this.col].valor == 0 && mineField[this.lin][this.col].nome == 0 && this._openned == false) {
                    // Caso tenhamos uma casa onde o nome e o valor seja 0 e seu estado seja fechado esta casa certamente está vazia e não possui bombas na vizinhança
                    trace("vazio");
                    this._openned = true;
                    this.hidden._visible = false;
                    subtractCells();


                    // O laço abaixo faz uma varredura nas casas vizinhas baseado no posicionamento da casa clicada
                    // Partindo das premissas que temos uma casa vazia e o numeros de bombas na vizinhança é zero
                    // podemos aplicar a função showCell na vizinhança que não revelaremos uma bomba e sim outras células vazias
                    // que chamariam a função showCell de suas vizinhas e assim por diante revelando todas as células vazias contíguas
                    // até que a célula vizinha seja uma célula que possua bombas vizinhas daí o showCell não é propagado
                    for (this.l = this.lin - 1; this.l <= (this.lin + 1); this.l++) {
                        for (this.m = this.col - 1; this.m <= (this.col + 1); this.m++) {
                            ["cell-" + this.l + "-" + this.m].showCell();
                        }
                    }


                } else if (mineField[this.lin][this.col].nome != 0 && mineField[this.lin][this.col].valor != 1 && this._openned == false) {

                    // Por fim, se o nome da célula não for igual a 0 e o valor não for igual a 1 concluí-se que a célula possui bombas vizinhas e não é uma bomba
                    // desta forma apenas revelamos seu conteúdo e adicionamos 1 ponto
                    trace("algum");
                    this._openned = true;
                    this.hidden._visible = false;
                    subtractCells();

                }
            }; // Fim de showCell



            // Agora se estiver setado para mostrar casas vizinhas a cada casa aberta não usaremos showCell e sim showVizinhanca
            this["cell-" + i + "-" + j].showVizinhanca = function() {
                if (mineField[this.lin][this.col].valor == 1 && this._openned == false) {
                    // caso verdadeiro "BOOOOOOOOMBA"
                    trace("BOOOM");
                    // setamos jogando igual a false para pausar o jogo
                    jogando = false;
                    // informo que as bombas foram acionadas
                    bombas = true;

                    // aplicamos o estado clicado para a celula
                    this._openned = true;
                    // e oculto o foreground para mostrar o conteúdo da célula
                    this.hidden._visible = false;


                    // neste laço eu faço uma busca por todas as outras bombas do palco e às mostro
                    for (this.i = 0; this.i < lines; this.i++) {
                        for (this.j = 0; this.j < columns; this.j++) {
                            if (mineField[this.i][this.j].valor == 1) {
                                ["cell-" + this.i + "-" + this.j].showCell();
                            }
                        }
                    }
                } else if (mineField[this.lin][this.col].valor != 1 && this._openned == false) {
                    //caso a casa não contenha uma bomba e não foi aberta varremos as casas em volta
                    for (this.l = this.lin - 1; this.l <= (this.lin + 1); this.l++) {
                        for (this.m = this.col - 1; this.m <= (this.col + 1); this.m++) {
                            if (["cell-" + this.l + "-" + this.m]._openned == false) {
                                //sempre que a casa estiver fechada eu abro e revelo seu conteúdo
                                ["cell-" + this.l + "-" + this.m]._openned = true;
                                ["cell-" + this.l + "-" + this.m].hidden._visible = false;
                                if (mineField[this.l][this.m].valor != 1) {
                                    //somente se a casa não tiver uma bomba eu subtraio as casas restantes
                                    subtractCells();
                                }
                            }
                        }
                    }
                }

            }; // Fim de showVizinhanca()



            // Aqui aplicamos a reação ao clique do movieclip anexado ao palco onde caso clicado executamos a função showCell
            this["cell-" + i + "-" + j].onRelease = function() {
                //Caso o jogo esteja em andamento executamos o showCell() ou o showVizinhanca() de acordo com a opção selecionada no começo do jogo
                if (jogando == true && pausado == false && concluido == false) {
                    if (showNeighborhood == false) {
                        this.showCell();
                    } else {
                        this.showVizinhanca();
                    }
                }
            };
        }
    }
    // FIM DA MULTIPLIÇÃO DE CÉLULAS
}

// FIM DO SETUP DO CAMPO MINADO

// REMOÇÃO DO CAMPO MINADO
function clearMineField(lines, columns, limpaNome) {

    // argumentos
    // lines: numero de linhas do campo minado
    // columns: numero de colunas do campo minado


    pausado = false; //desabilitamos o pause
    jogando = false; //terminamos o jogo
    bombas = false; //resetamos as bombas


    //varredura pelas linhas e colunas
    for (i = 0; i < lines; i++) {
        for (j = 0; j < columns; j++) {
            this["cell-" + i + "-" + j].removeMovieClip(); //aqui removemos o cada célula do campo minado
            delete this["cell-" + i + "-" + j]; //aqui deletamos a referencia à instância de cada célula
        }
    }

    clearText(limpaNome);
}

// FIM DA REMOÇÃO DO CAMPO MINADO

/////////////////////////////////////////////////////////////////////////////////////////////



//////////////////////////////////////
//  A partir daqui monitoramos o  //
//       desempenho do jogador      //
//  e ranking.            //
//////////////////////////////////////


// INÍCIO DO CRONOMETRO
// A cada um segundo eu executo a função contaTempo, se uma partida não pausada estiver em andamento até o cronometro completar completar 9999 segundos
setInterval(contaTempo, 1000);

function contaTempo() {
    if (pausado == false && jogando == true && cronometro < 9999) {
        cronometro++;
        txtTempo.htmlText = cronometro;
    }
}
// FIM DO CRONOMETRO


// INÍCIO DA ADIÇÃO DE CASAS ABERTAS
function subtractCells(decrease) {
    // incrementa o número de casas abertas setado como 0 no início da partida
    // cada casa aberta vale 1 ponto, usaremos isto somente para o controle de
    // quantas casas estão abertas já que o Score será composto de outra forma

    if (cellsToLeft == 1 && bombas == false) {
        // FIM DO JOGO ...
        trace("FIM DO JOGO");
        cellsToLeft--;
        document.getElementsByClassName("topBarTitle")[0].innerHTML =
            txtFaltam.htmlText = cellsToLeft;
        pausado = concluido = true;
        jogando = false;
        BT_INICIAR._visible = false; //... tornamos os botões de iniciar e pause inativos e invisíveis ...
        BT_PAUSE._visible = false;
        FIM_DE_JOGO_FRAME._visible = true; //... mostramos a janela de opção para reinício do jogo ... 
        BT_FIM_S._visible = true; // ... habilitamos o botão de SIM ou NÃO .
        BT_FIM_N._visible = true;
    } else if (cellsToLeft > 1 && bombas == false) {
        trace("Subtract Cell");
        cellsToLeft--;
        document.getElementsByClassName("topBarTitle")[0].innerHTML =
            txtFaltam.htmlText = cellsToLeft;
    }

    trace("PLACAR: " + cellsToLeft);
}
// FIM DA ADIÇÃO DE CASAS ABERTAS

// INÍCIO DO PLACAR
// Apesar de ter armazenado a pontuação durante o jogo não usaremos isto para compor o placar
// já que somente armazenaremos no placar jogadores que concluam o campo minado. 
// Para concluir o campo minado o jagador inevitavelmente precisa fazer a pontuação máxima
// já que precisa abrir todas as células que não contenham bombas.
// Neste caso o único critério de desempate é o tempo.

// Logo no ranking armazenaremos somente nome, nível do jogo, tempo jogado onde os jogadores que
// fizerem os níveis mais difíceis no menor tempo alcançam o topo do ranking

// Crio um Array para o Ranking
var ranking = [];

//Crio um objeto sharedObject para armazenar meu ranking em um cookie
//var minefieldSO:SharedObject = new SharedObject();
// resgato o que houver no shared object
minefieldSO = SharedObject.getLocal("minefield");
//atribuo ao ranking os valores armazenados
if (minefieldSO.data.ranking != undefined) {
    ranking = minefieldSO.data.ranking;
}
//mostro o ranking       
showRanking();


function insertScore(nome, nivel, label, tempo) {
    trace(nome + " " + nivel + " " + label + " " + tempo);
    // Aqui eu adciono o Score de acordo com o tempo de jogo e nível do jogador além do nome inputado no menu de adcionar ranking
    ranking.push({ nome: nome, nivel: nivel, nivelLabel: label, tempo: tempo });
    // Abaixo eu reordeno o ranking para que o nível mais avançado jogado no menor tempo ocupe o topo da lista
    ranking.sortOn(["nivel", "tempo"], [Array.DESCENDING, Array.NUMERIC]);
    //mantem o array do ranking com 10 itens
    ranking.splice(10);
    //Atualiza o ranking no cookie (shared object)
    trace(ranking);

    minefieldSO.data.ranking = ranking;
    //chama o preenchimento do ranking
    showRanking();
}

// Em showRanking eu mostro os dez melhores jogadores
function showRanking() {
    txtRPos.autoSize = txtRNome.autoSize = txtRDif.autoSize = txtRTempo.autoSize = true;
    txtRPos.htmlText = "<font size='12'><br>";
    txtRNome.htmlText = "<font size='12'>NOME";
    txtRDif.htmlText = "<font size='12'>NÍVEL";
    txtRTempo.htmlText = "<font size='12'>TEMPO";
    for (i = 0; i < ranking.length; i++) {
        txtRPos.htmlText += "<font size='12'>" + ((i < 9) ? " " + (i + 1) + "°" : (i + 1) + "°");
        txtRNome.htmlText += "<font size='12'>" + ranking[i].nome.toUpperCase();
        txtRDif.htmlText += "<font size='12'>" + ranking[i].nivelLabel.toUpperCase();
        txtRTempo.htmlText += "<font size='12'>" + ranking[i].tempo;
    }

}
// FIM DO PLACAR



////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////
// CHEAT CODES //
/////////////////


//a variável cheatCode inicia vazia para evitar undefined no incremento
cheatCode = "";
//Criamos um objeto ouvinte do teclado
keyListener = new Object();
//quando a tecla for pressionada disparamos a função que...
keyListener.onKeyDown = function() {
    //se o teclado estiver ocioso por mais de 5 segundos deixamos a variavel que armazena o cheatCode vazia
    if (!cheatDelay) {
        cheatDelay = cronometro;
    } else if (cronometro - cheatDelay > 5) {
        delete cheatDelay;
        cheatCode = "";
    }
    // Este switch converte os eventos de teclado em uma string que corresponde à tecla que foi apertada e este valor é incrementado em uma strng acumuladora
    switch (Key.getCode()) {
        case 67:
            cheatCode += "C";
            break;
        case 76:
            cheatCode += "L";
            break;
        case 69:
            cheatCode += "E";
            break;
        case 65:
            cheatCode += "A";
            break;
        case 82:
            cheatCode += "R";
            break;
        case 83:
            cheatCode += "S";
            break;
        case 72:
            cheatCode += "H";
            break;
        case 79:
            cheatCode += "O";
            break;
        case 87:
            cheatCode += "W";
            break;
        default:
            break;
    }
    // se esta strng ultrapassar os 5 characteres acrescentamos a ultima coisa que foi digitada no final da string e removemos o primeiro item
    if (cheatCode.length > 5) {
        cheatCode = substring(cheatCode, cheatCode.length - 4, 6);
    }
    if (cheatCode.indexOf("SHOW") > -1) {
        //se digitarmos a palavra SHOW as celulas ficam semi transparentes
        cheatCode = "";
        for (this.i = 0; this.i < linhas; this.i++) {
            for (this.j = 0; this.j < colunas; this.j++) {

                if (["cell-" + this.i + "-" + this.j].hidden._alpha == 100) {
                    trace("aciona o show");

                    ["cell-" + this.i + "-" + this.j].corHidden = new Color(["cell-" + this.i + "-" + this.j].hidden);
                    ["cell-" + this.i + "-" + this.j].corHidden.setTransform({ ra: 100, rb: -255, ga: 100, gb: 0, ba: 100, bb: -255, aa: 50, ab: 0 });
                    trace(["cell-" + this.i + "-" + this.j].hidden._alpha);

                } else if (["cell-" + this.i + "-" + this.j].hidden._alpha == 50) {
                    trace("remove o show");
                    ["cell-" + this.i + "-" + this.j].corHidden.setTransform({ ra: 100, rb: 0, ga: 100, gb: 0, ba: 100, bb: 0, aa: 100, ab: 0 });
                }

            }
        }
    }
    if (cheatCode.indexOf("CLEAR") > -1) {
        // se digitarmos a paravra CLEAR limpamos o ranking
        minefieldSO.clear();
        ranking = [];
        showRanking();
    }

    trace(cheatCode);

};
//aqui adicionamos o ouvinte
Key.addListener(keyListener);

/////////////////////////
// FIM DOS CHEAT CODES //
/////////////////////////

// função usada para depuraçãodo código, não faz parte do jogo
function outPut(lines, columns) {
    console.log("");
    console.log("");
    for (i = 0; i < lines; i++) {
        output = "";
        for (j = 0; j < columns; j++) {
            output += "[n:" + mineField[i][j].nome + ",v:" + mineField[i][j].valor + "],";
        }
        console.log(output.substring(0, output.length - 1));
    }
}