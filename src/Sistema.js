import $ from 'jquery';

export class Trajeto{
    constructor(cidade1, cidade2, tipoCaminhao){
        this.cidade1 = cidade1;
        this.cidade2 = cidade2;
        this.tipoCaminhao = tipoCaminhao;
    }

    validarDados(){
        for(let i in this){
            if(this[i] === undefined || this[i] === '' ||this[i] == null){
                return false;
            }
        }
        return true;
    }
}

export class Tabela{
    constructor(header, data){
        this.header = header;
        this.data = data;
    }
}

export class Transporte{
    constructor(qtdCelular, qtdGeladeira, qtdFreezer, qtdCadeira, qtdLuminaria, qtdLavadora, parada1, parada2, parada3, descarregarCelular, descarregarGeladeira, descarregarFreezer, descarregarCadeira, descarregarLuminaria, descarregarLavadora){
        this.PesoDeCelular = qtdCelular * 0.5;
        this.PesoDeGeladeira = qtdGeladeira * 60;
        this.PesoDeFreezer = qtdFreezer * 100;
        this.PesoDeCadeira = qtdCadeira * 5;
        this.PesoDeLuminaria = qtdLuminaria * 0.8;
        this.PesoDeLavadora = qtdLavadora * 120;
        this.parada1 = parada1;
        this.parada2 = parada2;
        this.parada3 = parada3;
        this.descarregarCelular = descarregarCelular;
        this.descarregarGeladeira = descarregarGeladeira;
        this.descarregarFreezer = descarregarFreezer;
        this.descarregarCadeira = descarregarCadeira;
        this.descarregarLuminaria = descarregarLuminaria;
        this.descarregarLavadora = descarregarLavadora;

        this.caminhaoPeq = 0;
        this.caminhaoMed = 0;
        this.caminhaoGra = 0;

        this.pesoTotal = this.PesoDeCelular + this.PesoDeGeladeira + this.PesoDeFreezer + this.PesoDeCadeira + this.PesoDeLuminaria + this.PesoDeLavadora;
    }

    //Achar Numero de caminhões:
    /*  if(PesoTotal <= 1 tonelada){
            caminhaoPeq = 1
        }else{
            if(PesoTotal > 1 && PesoTotal <= 4 toneladas){
                caminhaoMed = 1
            }else{
                if(PesoTotal > 4 && PesoTotal <= 10 toneladas){
                    caminhaoGra = 1
                }
            }
        }
        
    */

    //Custo Total
    //  
    //Custo por trecho
    //Custo médio por km
    //Custo médio por tipo de produto
    //Custo total por trecho?
    //Custo total para cada modalidade de transporte
    //Número total de veículos deslocados
    //Total de itens transportados

    validarDados(){
        for(let i in this){
            if(this[i] === undefined || this[i] === '' ||this[i] == null){
                return false;
            }
        }
        return true;
    }
}

export function procuraTrecho(tabela){
    let cidade1 = document.getElementById('cidade1');
    let cidade2 = document.getElementById('cidade2');
    let tipoCaminhao = document.getElementById('tipoCaminhao');

    cidade1.value = cidade1.value.toUpperCase();
    cidade2.value = cidade2.value.toUpperCase();

    let trajeto = new Trajeto(
        cidade1.value,
        cidade2.value,
        tipoCaminhao.value,
    );

    if (trajeto.validarDados() && (tabela.header.indexOf(cidade1.value) !== -1 && tabela.header.indexOf(cidade2.value) !== -1)) {

        let precoViajem = (tabela.data[tabela.header.indexOf(cidade1.value)][tabela.header.indexOf(cidade2.value)]) * tipoCaminhao.value

        precoViajem = precoViajem.toFixed(2) 


        //document.getElementById('modalTitulo').innerHTML = 'TUDO CERTO';
        //document.getElementById('modalHeader').className = 'modal-header text-success';
        //document.getElementById('modalBody').innerHTML = 'Despesa cadastrada com sucesso';
        //document.getElementById('modalButton').className = 'btn btn-success';

        //$('#modalRegistro').modal('show')
        alert("O preço da viajem de " + cidade1.value + " para " + cidade2.value + " é de: R$" + precoViajem)

        //cidade1.value = ''
        //cidade2.value = ''
        //tipoCaminhao.value = ''

    } else {
        //document.getElementById('modalTitulo').innerHTML = 'TUDO ERRADO';
        //document.getElementById('modalHeader').className = 'modal-header text-danger';
        //document.getElementById('modalBody').innerHTML = 'Errou e não foi pouco';
        //document.getElementById('modalButton').className = 'btn btn-danger';
        alert('ERRO GROTESCO')

        $('#modalRegistro').modal('show');
    }
}

export function cadastraTransporte(){
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
        descarregarLavadora
    );

    console.log(transporte);
}