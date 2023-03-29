import $ from "jquery";

export class BancoDados {
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

  pesquisar(transporte) {
    let transportesFiltrados = [];
    transportesFiltrados = this.recuperarTodosRegistros();

    return transportesFiltrados;
  }

  remover(id) {
    localStorage.removeItem(id);
  }
}

let bd = new BancoDados();

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
  constructor( qtdCelular, qtdGeladeira, qtdFreezer, qtdCadeira, qtdLuminaria, qtdLavadora, parada1, parada2, parada3, descarregarCelular, descarregarGeladeira, descarregarFreezer, descarregarCadeira, descarregarLuminaria, descarregarLavadora, precoPrimeiraViajem, precoSegundaViajem ) {
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

    this.precoPrimeiraViajem = Number(this.caminhaoPeq * 4.87 * precoPrimeiraViajem) + Number(this.caminhaoMed * 11.92 * precoPrimeiraViajem) + Number(this.caminhaoGra * 27.44 * precoPrimeiraViajem);

    //Guardamos o valor de veiculos deslocados em variaveis separadas
    this.caminhaoPeqDes = this.caminhaoPeq;
    this.caminhaoMedDes = this.caminhaoMed;
    this.caminhaoGraDes = this.caminhaoGra;

    //Depois de calcular a primeira viajem zeramos o numero de caminhoes
    this.caminhaoPeq = 0;
    this.caminhaoMed = 0;
    this.caminhaoGra = 0;

    this.pesoFinal = this.pesoInicial - this.quantDescarregar;

    this.calculaCaminhoes(this.pesoFinal);

    this.caminhaoPeqDes += Number(this.caminhaoPeq);
    this.caminhaoMedDes += Number(this.caminhaoMed);
    this.caminhaoGraDes += Number(this.caminhaoGra);

    this.numeroItensDeslocados = Number(qtdCelular) + Number(qtdGeladeira) + Number(qtdFreezer) + Number(qtdCadeira) + Number(qtdLuminaria) + Number(qtdLavadora);

    this.numeroVeiculosDeslocados = Number(this.caminhaoPeqDes) + Number(this.caminhaoMedDes) + Number(this.caminhaoGraDes);
    
    this.precoSegundaViajem = Number(this.caminhaoPeq * 4.87 * precoSegundaViajem) + Number(this.caminhaoMed * 11.92 * precoSegundaViajem) + Number(this.caminhaoGra * 27.44 * precoSegundaViajem);

    this.custoTotal = Number(this.precoPrimeiraViajem)+Number(this.precoSegundaViajem)

    this.toString = function () {
      return `A sua viajem partiu de ${this.parada1} parando em ${this.parada2} com destino para ${this.parada3}<br><br>O custo do primeiro trecho foi de: R$${this.precoPrimeiraViajem}
      <br>O custo do segundo trecho foi de: R$${this.precoSegundaViajem}
      <br>O custo total da viajem foi de: R$${this.custoTotal}
      <br>  Ao total foram ${this.numeroItensDeslocados} itens deslocados por ${this.numeroVeiculosDeslocados} caminhões`;
    };
  }

  calculaCaminhoes(pesoAtual) {
    while (pesoAtual > 0) {
      if (pesoAtual <= 1000) {
        this.caminhaoPeq += 1;
        pesoAtual -= 1000;
      } else if (pesoAtual > 1000 && pesoAtual <= 2000) {
        this.caminhaoPeq += 2;
        pesoAtual -= 2000;
      } else if (pesoAtual > 2000 && pesoAtual <= 4000) {
        this.caminhaoMed += 1;
        pesoAtual -= 4000;
      } else if (pesoAtual > 4000 && pesoAtual <= 8000) {
        this.caminhaoMed += 2;
        pesoAtual -= 8000;
      } else {
        this.caminhaoGra += 1;
        pesoAtual -= 10000;
      }
    }
  }

  validarDados() {
    for (let i in this) {
      if (this[i] === undefined || this[i] === "" || this[i] == null) {
        return false;
      }
    }
    return true;
  }

  //Custo médio por km
  //Custo médio por tipo de produto
  //Custo total para cada modalidade de transporte
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
  if (
    trajeto.validarDados() &&
    tabela.header.indexOf(cidade1.value) !== -1 &&
    tabela.header.indexOf(cidade2.value) !== -1
  ) {
    //
    let precoViajem =
      tabela.data[tabela.header.indexOf(cidade1.value)][
        tabela.header.indexOf(cidade2.value)
      ] * tipoCaminhao.value;

    //Limita a variavel em 2 casas depois da vírgula
    precoViajem = precoViajem.toFixed(2);

    //Elementos da modal de sucesso
    document.getElementById("modalTitulo").innerHTML =
      "Preço do trecho desejado";
    document.getElementById("modalHeader").className =
      "modal-header text-success";
    document.getElementById("modalBody").innerHTML = `O preço da viajem de ${
      cidade1.value
    } para ${cidade2.value} é de: <br>R$${precoViajem.toLocaleString("pt-BR")}`;
    document.getElementById("modalButton").className = "btn btn-success";

    //Uso do jquery para exibir a modal oculta do app.jsx
    $("#modalRegistro").modal("show");
  } else {
    //Caso haja algum erro exibe a modal de erro
    document.getElementById("modalTitulo").innerHTML =
      "Erro: cidade inválida ou com acento";
    document.getElementById("modalHeader").className =
      "modal-header text-danger";
    document.getElementById("modalBody").innerHTML =
      "A cidade digitada não está presente na lista, ou foi digitada com acento.";
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
  let descarregarLavadora = document.getElementById("descarregarLavadora").value;

  //Soma o peso de todas as cargas
  //let somaPeso = (Number(qtdCelular)*0.5) + (Number(qtdGeladeira) * 60) + (Number(qtdFreezer) * 100) + (Number(qtdCadeira) * 5) + (Number(qtdLuminaria) * 0.8) + (Number(qtdLavadora) * 120);

  //Eleva as paradas do transporte para caixa alta
  parada1 = parada1.toUpperCase();
  parada2 = parada2.toUpperCase();
  parada3 = parada3.toUpperCase();

  if (tabela.header.indexOf(parada1) !== -1 && tabela.header.indexOf(parada2) !== -1 && tabela.header.indexOf(parada3)) {
    var precoPrimeiraViajem =
    tabela.data[tabela.header.indexOf(parada1)][tabela.header.indexOf(parada2)];
    var precoSegundaViajem =
    tabela.data[tabela.header.indexOf(parada2)][tabela.header.indexOf(parada3)];
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

  if (
    qtdCelular - descarregarCelular < 0 ||
    qtdGeladeira - descarregarGeladeira < 0 ||
    qtdFreezer - descarregarFreezer < 0 ||
    qtdCadeira - descarregarCadeira < 0 ||
    qtdLuminaria - descarregarLuminaria < 0 ||
    qtdLavadora - descarregarLavadora < 0
  ) {
    document.getElementById("modalTitulo").innerHTML = "Erro: Carga";
    document.getElementById("modalHeader").className = "modal-header text-danger";
    document.getElementById("modalBody").innerHTML = "Não é permitido descarregar mais do que a carga inicial";
    document.getElementById("modalButton").className = "btn btn-danger";

    $("#modalRegistro").modal("show");
  } else {}

  if (transporte.validarDados()) {
    bd.gravar(transporte);

    document.getElementById("modalTitulo").innerHTML = "Viajem cadastrada!";
    document.getElementById("modalHeader").className = "modal-header text-success";
    document.getElementById("modalBody").innerHTML = `${transporte.toString()}`;
    document.getElementById("modalButton").className = "btn btn-success";
    $("#modalRegistro2").modal("show");

  }else{

    document.getElementById("modalTitulo").innerHTML = "Erro: Dados inválidos";
    document.getElementById("modalHeader").className = "modal-header text-danger";
    document.getElementById("modalBody").innerHTML = "Campos de dados não preenchidos";
    document.getElementById("modalButton").className = "btn btn-danger";
    $("#modalRegistro").modal("show");
  }

  console.log(transporte);
}

export function limpaBancoDados(){
  localStorage.clear();
}

export function carregaListaTransportes(transportes = [], filtro = false) {
  if (transportes.length === 0 && filtro === false) {
    transportes = bd.recuperarTodosRegistros();
  }

  let listaTransportes = document.getElementById("listaTransportes");
  //listaTransportes.innerHTML = "";

  transportes.forEach(function (d) {
    let linha = listaTransportes.insertRow();

    linha.insertCell(0).innerHTML = `${d.dia}`;
    linha.insertCell(1).innerHTML = d.tipo;

    let btn = document.createElement("button");
    btn.className = "btn btn-danger";
    btn.id = `idTransporte${d.id}`;
    btn.onclick = function () {
      let id = this.id.replace("idTransporte", "");

      bd.remover(id);

      window.location.reload();
    };

    linha.insertCell(2).innerHTML = d.descricao;
    linha.insertCell(3).innerHTML = d.valor;
    linha.insertCell(4).append(btn);
  });
}
