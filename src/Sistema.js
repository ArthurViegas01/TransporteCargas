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

export function procuraTrecho(cidadeUM, cidadeDOIS, tipoCaminhAO, tabela){
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

        console.log("O preço da viajem de", cidade1.value, "para", cidade2.value, "é de: R$",precoViajem);

        //document.getElementById('modalTitulo').innerHTML = 'TUDO CERTO';
        //document.getElementById('modalHeader').className = 'modal-header text-success';
        //document.getElementById('modalBody').innerHTML = 'Despesa cadastrada com sucesso';
        //document.getElementById('modalButton').className = 'btn btn-success';

        //$('#modalRegistro').modal('show')
        alert('ACERTOOOOOOOOOO')

        //cidade1.value = ''
        //cidade2.value = ''
        //tipoCaminhao.value = ''

    } else {
        //document.getElementById('modalTitulo').innerHTML = 'TUDO ERRADO';
        //document.getElementById('modalHeader').className = 'modal-header text-danger';
        //document.getElementById('modalBody').innerHTML = 'Errou e não foi pouco';
        //document.getElementById('modalButton').className = 'btn btn-danger';
        alert('ERRO GROTESCO')

        //$('#modalRegistro').modal('show');
    }
}