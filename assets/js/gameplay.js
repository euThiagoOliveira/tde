
const table = document.querySelector('[data-game="table"]');
const tds = table.querySelectorAll('[data-game="table"] td');
const rows = table.querySelectorAll("tbody > tr");
const player = document.querySelector('[data-js="current-player"]');
const opcaoLimparTabela =  document.querySelector('[data-js="limpar-tabela"]');
const playerAtual = {
  jogadorAtual : 1,
  nome: "..."
}


const criarCirculo = (c) => {
  let item = rows[c.linha - 1].querySelectorAll('td')[c.coluna -1]
  let span = document.createElement("span");

  if (item.children.length == 0) {
    span.classList.add("circulo2");
    item.appendChild(span);
  } 
};

const criarDiamante = (c) => {
  let item = rows[c.linha - 1].querySelectorAll('td')[c.coluna -1]
  let span = document.createElement("span");
  if (item.children.length == 0) {
    span.classList.add("diamante");
    item.appendChild(span);
  }
};


const MudarJogador = (coordenadas) => {

  let item = rows[coordenadas.linha - 1].querySelectorAll('td')[coordenadas.coluna -1];
  
  if(playerAtual.jogadorAtual == 1) {
    playerAtual.jogadorAtual = 2;
    criarCirculo(coordenadas);
  
    if(player.classList.contains("circulo2")){
      player.classList.remove("circulo2");
      player.classList.add("diamante")
    }
    player.classList.add("diamante")
  

  }else if(playerAtual.jogadorAtual == 2){
    playerAtual.jogadorAtual = 1;
   criarDiamante(coordenadas);

    if(player.classList.contains("diamante")){
      player.classList.remove("diamante");
      player.classList.add("circulo2")
    }
    player.classList.add("circulo2")
   
  }


};
document.querySelectorAll('[data-game="table"] td').forEach((item) => {
  item.addEventListener("click", function () {
    let line = this.parentNode.rowIndex;
    let cell = this.cellIndex;
    let coordenadas = { linha: line, coluna: cell }
   

    if( VerificarRegras(coordenadas) == false){
     
     let  marcacaoModal = document.getElementById('PosicaoInvalida');
     let modalMarcacao = new bootstrap.Modal(marcacaoModal);
     modalMarcacao.show(marcacaoModal)
    }
    else if(rows[line-1].querySelectorAll('td')[cell -1].childNodes.length > 0 ){

      let  marcacaoModal = document.getElementById('jaMarcaram');
      let modalMarcacao = new bootstrap.Modal(marcacaoModal);
      modalMarcacao.show(marcacaoModal)

    }else{
    MudarJogador(coordenadas)
    VerificarDiagonalPrimaria(line, cell);
    VerificarDiagonalSecundaria(line, cell);
    VerificarHorizontal(line, cell);
    VerificarVertical(line, cell);
    }
  });
});
function VerificarRegras(c){
  let linha = c.linha - 1;
  let coluna = c.coluna - 1;
  let linhaPossivel = (linha + 1 > 5 ? 5 : linha + 1) 
  let posicaoASerVerificada = rows[linhaPossivel].querySelectorAll('td')[coluna];

  if(linha < 5 && posicaoASerVerificada.childNodes.length == 0){
    // Tá seguindo a regra 
    return false;
  }
  // Tá marcando onde já existe posição marcada
 return true;
 
}
function VerificarDiagonalSecundaria(line, cell) {
  var linha = line - 1;
  var coluna = cell - 1;
  var secondaryArray = [];
  var sum = linha + coluna;
  // obtenho a linha secundária iteira relativa ao eemento clicado
  let sub =  linha + coluna; // quantidade de linhas que formam a diagonal secundária
  let qtLinhas = Math.abs(linha - coluna);

 
  if (coluna <= 5) {
    for (i = 0; i <= 5; i++) {
    
       let elemento = rows[i].querySelectorAll("td")[sum - i];
       if(elemento != undefined){
        secondaryArray.push(elemento);
        }
      
      
    }

    VerificadordeCorrespondencias(secondaryArray);
  }
}
function VerificarDiagonalPrimaria(line, cell) {
  var linha = line - 1;
  var coluna = cell - 1;
  var primariaArray = [];
  //var sum = linha < coluna ? (sum = 0) : linha - coluna;
  let sub = coluna > linha ? coluna - linha : linha - coluna;
  if (coluna >= 1 && coluna <= 5) {
    for (i = 0; i < 6 - sub; i++) {
      if (coluna > linha) {
        // faz pontos a partir da 2º linha
        let elemento = rows[i].querySelectorAll("td")[sub + i];
 
        primariaArray.push(elemento);
      } else {
        elemento = rows[sub + i].querySelectorAll("td")[i];
        primariaArray.push(elemento);
      }
    }
    VerificadordeCorrespondencias(primariaArray);
  }


}

function VerificarHorizontal(line, cell) {
  var linha = line - 1;
  var coluna = cell - 1;
  var horizontalArray = [];
  for (i = 0; i < 6; i++) {
    let elemento = rows[linha].querySelectorAll("td")[i];

    horizontalArray.push(elemento);
  }
  VerificadordeCorrespondencias(horizontalArray);
}

function VerificarVertical(line, cell) {
  var linha = line - 1;
  var coluna = cell - 1;
  var verticalArray = [];
  for (i = 0; i < 6; i++) {
    let elemento = rows[i].querySelectorAll("td")[coluna];

    verticalArray.push(elemento);
  }
  VerificadordeCorrespondencias(verticalArray);
}
function VerificadordeCorrespondencias(arrayElements) {
  let analiseArray = arrayElements;
  let correspondencia = 0;


  for (i = 0; i <= analiseArray.length - 1; i++) {
    let proximo = analiseArray[i + 1];
    let atual = analiseArray[i].querySelector("span");

    if (atual != null) {
      if (proximo != undefined && proximo.children[0]) {
        if (atual.className === proximo.children[0].className) {
          correspondencia++;
        }
      }
    }
  }
  if (correspondencia == 3) {
    const vencedor = document.getElementById('vencedorModal')
    var modal = new bootstrap.Modal(vencedor)
   modal.show(vencedor)
    //console.log(playerAtual)
  } else {
    correspondencia = 0;
  }

}
opcaoLimparTabela.addEventListener('click',function(){
  for (let i = 0; i < tds.length; i++ ){
    tds[i].innerHTML = "";
  }
})

function LimpaTela(){
  for (let i = 0; i < tds.length; i++ ){
    tds[i].innerHTML = "";
  } 
}