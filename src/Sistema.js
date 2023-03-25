export class Trajeto{
    constructor(cidade1, cidade2, tipoCaminhao){
        this.cidade1 = cidade1;
        this.cidade2 = cidade2;
        this.tipoCaminhao = tipoCaminhao;
    }

    validarDados(){
        for(let i in this){
            if(this[i] === undefined || this[i] === '' ||this[i] == null){
                return false
            }
        }
        return true
    }
}

export function testeErro(){
    let cidade1 = document.getElementById('ano');
    let cidade2 = document.getElementById('mes');
    let tipoCaminhao = document.getElementById('dia');

    let trajeto = new Trajeto(
        cidade1.value,
        cidade2.value,
        tipoCaminhao.value,
    );

    if (trajeto.validarDados()){

        document.getElementById('modalTitulo').innerHTML = 'TUDO CERTO';
        document.getElementById('modalHeader').className = 'modal-header text-success';
        document.getElementById('modalBody').innerHTML = 'Despesa cadastrada com sucesso';
        document.getElementById('modalButton').className = 'btn btn-success';

        //$('#modalRegistro').modal('show')

        cidade1.value = ''
        cidade2.value = ''
        tipoCaminhao.value = ''

    } else {
        document.getElementById('modalTitulo').innerHTML = 'TUDO ERRADO';
        document.getElementById('modalHeader').className = 'modal-header text-danger';
        document.getElementById('modalBody').innerHTML = 'Errou e não foi pouco';
        document.getElementById('modalButton').className = 'btn btn-danger';

        //$('#modalRegistro').modal('show');
    }
}

export function vamoVe(algo){
    console.log(algo);
}