import $ from "jquery";

//Objeto trajeto
export class Trajeto {
  constructor(cidade1, cidade2, tipoCaminhao) {
    this.cidade1 = cidade1;
    this.cidade2 = cidade2;
    this.tipoCaminhao = tipoCaminhao;
  }

  //Checa por dados errados no objeto
  validarDados() {
    for (let i in this) {
      if (this[i] === undefined || this[i] === "" || this[i] == null) {
        return false;
      }
    }
    return true;
  }
}

export class Tabela {
  constructor(header, data) {
    this.header = header;
    this.data = data;
  }
}

export class Transporte {
  constructor(
    qtdCelular,
    qtdGeladeira,
    qtdFreezer,
    qtdCadeira,
    qtdLuminaria,
    qtdLavadora,
    parada1,
    parada2,
    parada3,
    descarregarCelular,
    descarregarGeladeira,
    descarregarFreezer,
    descarregarCadeira,
    descarregarLuminaria,
    descarregarLavadora,
    precoPrimeiraViajem,
    precoSegundaViajem
  ) {
    this.PesoDeCelular = qtdCelular * 0.5;
    this.PesoDeGeladeira = qtdGeladeira * 60;
    this.PesoDeFreezer = qtdFreezer * 100;
    this.PesoDeCadeira = qtdCadeira * 5;
    this.PesoDeLuminaria = qtdLuminaria * 0.8;
    this.PesoDeLavadora = qtdLavadora * 120;
    this.parada1 = parada1;
    this.parada2 = parada2;
    this.parada3 = parada3;
    this.descarregarCelular = descarregarCelular * 0.5;
    this.descarregarGeladeira = descarregarGeladeira * 60;
    this.descarregarFreezer = descarregarFreezer * 100;
    this.descarregarCadeira = descarregarCadeira * 5;
    this.descarregarLuminaria = descarregarLuminaria * 0.8;
    this.descarregarLavadora = descarregarLavadora * 120;
    this.precoPrimeiraViajem = precoPrimeiraViajem;
    this.precoSegundaViajem = precoSegundaViajem;

    this.caminhaoPeq = 0;
    this.caminhaoMed = 0;
    this.caminhaoGra = 0;

    this.pesoInicial =
      this.PesoDeCelular +
      this.PesoDeGeladeira +
      this.PesoDeFreezer +
      this.PesoDeCadeira +
      this.PesoDeLuminaria +
      this.PesoDeLavadora;

    this.quantDescarregar =
      Number(this.descarregarCelular) +
      Number(this.descarregarGeladeira) +
      Number(this.descarregarFreezer) +
      Number(this.descarregarCadeira) +
      Number(this.descarregarLuminaria) +
      Number(this.descarregarLavadora);

    this.calculaCaminhoes(this.pesoInicial);

    this.pesoFinal = this.pesoInicial - this.quantDescarregar;
  }

  calculaCaminhoes(pesoAtual) {
    while (pesoAtual > 0) {
      if (pesoAtual <= 1000){
          this.caminhaoPeq += 1;
          pesoAtual -= 1000;
      }else if (pesoAtual > 1000 && pesoAtual <= 2000){
          this.caminhaoPeq += 2;
          pesoAtual -= 2000;
      }else if (pesoAtual > 2000 && pesoAtual <= 4000){
          this.caminhaoMed += 1;
          pesoAtual -= 4000;
      }else if(pesoAtual > 4000 && pesoAtual <= 8000){
          this.caminhaoMed += 2;
          pesoAtual -= 8000;
      }else{
          this.caminhaoGra += 1;
          pesoAtual -= 10000;
      }
    }
  }

  //Custo Total
  //
  //Custo por trecho
  //Custo médio por km
  //Custo médio por tipo de produto
  //Custo total por trecho?
  //Custo total para cada modalidade de transporte
  //Número total de veículos deslocados
  //Total de itens transportados
}


//Função para procurar o preço de uma cidade para outra
export function procuraTrecho(x, y, z, tabela) {
  let cidade1 = document.getElementById("cidade1");
  let cidade2 = document.getElementById("cidade2");
  let tipoCaminhao = document.getElementById("tipoCaminhao");

  //Como as cidades no .csv estão em caixa alta, usamos o toUpperCase para igualar os valores
  cidade1.value = cidade1.value.toUpperCase();
  cidade2.value = cidade2.value.toUpperCase();

  //Cria um objeto trajeto com as strings da cidade e o tipo de caminhão selecionado
  let trajeto = new Trajeto(cidade1.value, cidade2.value, tipoCaminhao.value);

  //Se os dados foram digitados corretamente e encontrados no csv o programa avança com a pesquisa
  if ( trajeto.validarDados() &&  tabela.header.indexOf(cidade1.value) !== -1 && tabela.header.indexOf(cidade2.value) !== -1 ) {

    //
    let precoViajem = tabela.data[tabela.header.indexOf(cidade1.value)][tabela.header.indexOf(cidade2.value)] * tipoCaminhao.value;

    //Limita a variavel em 2 casas depois da vírgula
    precoViajem = precoViajem.toFixed(2);

    //Elementos da modal de sucesso
    document.getElementById("modalTitulo").innerHTML = "Preço do trecho desejado";
    document.getElementById("modalHeader").className = "modal-header text-success";
    document.getElementById("modalBody").innerHTML = `O preço da viajem de ${ cidade1.value} para ${cidade2.value} é de: <br>R$${precoViajem.toLocaleString("pt-BR")}`;
    document.getElementById("modalButton").className = "btn btn-success";

    //Uso do jquery para exibir a modal oculta do app.jsx
    $("#modalRegistro").modal("show");


  } else {

    //Caso haja algum erro exibe a modal de erro
    document.getElementById("modalTitulo").innerHTML = "Erro: cidade inválida ou com acento";
    document.getElementById("modalHeader").className = "modal-header text-danger";
    document.getElementById("modalBody").innerHTML = "A cidade digitada não está presente na lista, ou foi digitada com acento.";
    document.getElementById("modalButton").className = "btn btn-danger";

    $("#modalRegistro").modal("show");
  }
}

export function cadastraTransporte(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, tabela) {
  let qtdCelular = document.getElementById("qtdCelular").value;
  let qtdGeladeira = document.getElementById("qtdGeladeira").value;
  let qtdFreezer = document.getElementById("qtdFreezer").value;
  let qtdCadeira = document.getElementById("qtdCadeira").value;
  let qtdLuminaria = document.getElementById("qtdLuminaria").value;
  let qtdLavadora = document.getElementById("qtdLavadora").value;
  let parada1 = document.getElementById("parada1").value;
  let parada2 = document.getElementById("parada2").value;
  let parada3 = document.getElementById("parada3").value;
  let descarregarCelular = document.getElementById("descarregarCelular").value;
  let descarregarGeladeira = document.getElementById("descarregarGeladeira").value;
  let descarregarFreezer = document.getElementById("descarregarFreezer").value;
  let descarregarCadeira = document.getElementById("descarregarCadeira").value;
  let descarregarLuminaria = document.getElementById("descarregarLuminaria").value;
  let descarregarLavadora = document.getElementById( "descarregarLavadora"
  ).value;

  //Soma o peso de todas as cargas
  //let somaPeso = (Number(qtdCelular)*0.5) + (Number(qtdGeladeira) * 60) + (Number(qtdFreezer) * 100) + (Number(qtdCadeira) * 5) + (Number(qtdLuminaria) * 0.8) + (Number(qtdLavadora) * 120);

  //Eleva as paradas do transporte para caixa alta
  parada1 = parada1.toUpperCase();
  parada2 = parada2.toUpperCase();
  parada3 = parada3.toUpperCase();

  let precoPrimeiraViajem = tabela.data[tabela.header.indexOf(parada1)][tabela.header.indexOf(parada2)];
  let precoSegundaViajem = tabela.data[tabela.header.indexOf(parada2)][tabela.header.indexOf(parada3)];

  if ( qtdCelular - descarregarCelular < 0 || qtdGeladeira - descarregarGeladeira < 0 || qtdFreezer - descarregarFreezer < 0 || qtdCadeira - descarregarCadeira < 0 || qtdLuminaria - descarregarLuminaria < 0 || qtdLavadora - descarregarLavadora < 0 ) {

    document.getElementById("modalTitulo").innerHTML = "Erro: Carga";
    document.getElementById("modalHeader").className = "modal-header text-danger";
    document.getElementById("modalBody").innerHTML = "Não é permitido descarregar mais do que a carga inicial";
    document.getElementById("modalButton").className = "btn btn-danger";

    $("#modalRegistro").modal("show");
  } else {

    /*

    if( somaPeso  > 15000 ) {
      document.getElementById("modalTitulo").innerHTML = "Erro: Limite";
      document.getElementById("modalHeader").className = "modal-header text-danger";
      document.getElementById("modalBody").innerHTML = "Quantidade de carga excede as capacidades da transportadora. Por favor reduza a quantidade de itens";
      document.getElementById("modalButton").className = "btn btn-danger";

      $("#modalRegistro").modal("show");
    }
    */
  }

  let transporte = new Transporte(
    qtdCelular,
    qtdGeladeira,
    qtdFreezer,
    qtdCadeira,
    qtdLuminaria,
    qtdLavadora,
    parada1,
    parada2,
    parada3,
    descarregarCelular,
    descarregarGeladeira,
    descarregarFreezer,
    descarregarCadeira,
    descarregarLuminaria,
    descarregarLavadora,
    precoPrimeiraViajem,
    precoSegundaViajem
  );

  console.log(transporte);
}

/*class BancoDados {
  constructor() {
    let id = localStorage.getItem("id");

    if (id === null) {
      localStorage.setItem("id", 0);
    }
  }

  getProximoId() {
    let proximoId = localStorage.getItem("id");
    return parseInt(proximoId) + 1;
  }

  gravar(d) {
    let id = this.getProximoId();

    localStorage.setItem(id, JSON.stringify(d));

    localStorage.setItem("id", id);
  }

  recuperarTodosRegistros() {
    let id = localStorage.getItem("id");

    let transportes = [];

    for (let i = 1; i <= id; i++) {
      let transporteL = JSON.parse(localStorage.getItem(i));

      if (transporteL === null) {
        continue;
      }

      transporteL.id = i;
      transportes.push(transporteL);
    }

    return transportes;
  }

  pesquisar(despesa) {
    let transportesFiltrados = [];
    transportesFiltrados = this.recuperarTodosRegistros();

    return transportesFiltrados;
  }

  remover(id) {
    localStorage.removeItem(id);
  }
}
*/

//let bd = new BancoDados();