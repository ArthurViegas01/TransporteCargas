import React, { useEffect, useState } from "react";
import DataGrid from "../../components/DataGrid";
import Navbar from "../../components/Navbar";
import Tables from "../../components/Tables";
import { Tabela, cadastraTransporte, carregaListaTransportes, limpaBancoDados } from "../../Sistema";

const parseCSV = (text, setTabela) => {
  const result = {
    header: [],
    data: [],
  };

  //Pega a primeira linha e transforma no cabeçalho e o resto (...) atríbui a content
  const [header, ...content] = text.split("\n");

  result.header = header.split(";");

  content.forEach((item) => {
    result.data.push(item.split(";"));
  });

  let tabela = new Tabela(result.header, result.data);
  setTabela(tabela);

  return result;
};

function Transporte() {
  const [arquivoCSV, setCSV] = useState(null);
  const [tabela, setTabela] = useState(null);

  //Carrega o arquivo ao carregar a página
  useEffect(() => {
    fetch("/DNITDistancias.csv")
      .then((r) => r.text())
      .then((text) => {
        //Chama a função manipuladora de csv para quebrar arquivo em arrays
        setCSV(parseCSV(text, setTabela));
      });
  }, []);

  return (
    <div>
      <Navbar />

      {/* Tabela de pesos dos itens | custo x kilometro */}
      <div className="container mt-3">
        <div className="mb-4">
          <h2>Tabelas de pesos e preços</h2>
        </div>

        <DataGrid csv={arquivoCSV}/>

        <Tables />

        <div className="row">
          <div className="col mb-3">
            <h2 className="display-5">Cadastrar transporte</h2>
          </div>
        </div>

        <div className="row">
          {/* Itens iniciais */}
          <div className="col mb-3">
            <h6>Itens a serem transportados</h6>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Itens</th>
                  <th>Quantidade (unidades)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Celular</td>
                  <td>
                    <input
                      type="text"
                      className="form-control ocupando"
                      id="qtdCelular"
                      pattern="[0-9]*"
                    />
                  </td>
                </tr>
                <tr>
                  <td>Geladeira</td>
                  <td>
                    <input
                      type="text"
                      className="form-control ocupando"
                      id="qtdGeladeira"
                    />
                  </td>
                </tr>
                <tr>
                  <td>Freezer</td>
                  <td>
                    <input
                      type="text"
                      className="form-control ocupando"
                      id="qtdFreezer"
                    />
                  </td>
                </tr>
                <tr>
                  <td>Cadeira</td>
                  <td>
                    <input
                      type="text"
                      className="form-control ocupando"
                      id="qtdCadeira"
                    />
                  </td>
                </tr>
                <tr>
                  <td>Luminária</td>
                  <td>
                    <input
                      type="text"
                      className="form-control ocupando"
                      id="qtdLuminaria"
                    />
                  </td>
                </tr>
                <tr>
                  <td>Lavadora de roupas</td>
                  <td>
                    <input
                      type="text"
                      className="form-control ocupando"
                      id="qtdLavadora"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Trajeto da entrega */}
          <div className="col mt-4">
            <div className="mt-6"></div>
            <input
              type="text"
              className="form-control"
              placeholder="Partida"
              id="parada1"
            />
            <input
              type="text"
              className="form-control mt-5 mb-5"
              placeholder="Parada"
              id="parada2"
            />
            <input
              type="text"
              className="form-control mt-5"
              placeholder="Destino"
              id="parada3"
            />

            <div>
              <button
                type="button"
                className="mt-5 btn btn-block btn-dark"
                onClick={() =>
                  cadastraTransporte(
                    document.getElementById("qtdCelular").value,
                    document.getElementById("qtdGeladeira").value,
                    document.getElementById("qtdFreezer").value,
                    document.getElementById("qtdCadeira").value,
                    document.getElementById("qtdLuminaria").value,
                    document.getElementById("qtdLavadora").value,
                    document.getElementById("parada1").value,
                    document.getElementById("parada2").value,
                    document.getElementById("parada3").value,
                    document.getElementById("descarregarCelular").value,
                    document.getElementById("descarregarGeladeira").value,
                    document.getElementById("descarregarFreezer").value,
                    document.getElementById("descarregarCadeira").value,
                    document.getElementById("descarregarLuminaria").value,
                    document.getElementById("descarregarLavadora").value,
                    tabela
                  )
                }
              >
                Cadastrar transporte
              </button>
            </div>
          </div>

          {/* Intes para descarregar */}
          <div className="col mb-3">
            <h6>Descarregar na parada</h6>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Itens</th>
                  <th>Quantidade (unidades)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Celular</td>
                  <td>
                    <input
                      type="text"
                      className="form-control ocupando"
                      id="descarregarCelular"
                      required
                    />
                  </td>
                </tr>
                <tr>
                  <td>Geladeira</td>
                  <td>
                    <input
                      type="text"
                      className="form-control ocupando"
                      id="descarregarGeladeira"
                    />
                  </td>
                </tr>
                <tr>
                  <td>Freezer</td>
                  <td>
                    <input
                      type="text"
                      className="form-control ocupando"
                      id="descarregarFreezer"
                    />
                  </td>
                </tr>
                <tr>
                  <td>Cadeira</td>
                  <td>
                    <input
                      type="text"
                      className="form-control ocupando"
                      id="descarregarCadeira"
                    />
                  </td>
                </tr>
                <tr>
                  <td>Luminária</td>
                  <td>
                    <input
                      type="text"
                      className="form-control ocupando"
                      id="descarregarLuminaria"
                    />
                  </td>
                </tr>
                <tr>
                  <td>Lavadora de roupas</td>
                  <td>
                    <input
                      type="text"
                      className="form-control ocupando"
                      id="descarregarLavadora"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>


        <div className="row">
          <div className="col mb-3">
            <h2 className="display-5">Dados estatísticos</h2>
          </div>
        </div>

        <div className="row">
          <div className="col-md-4">
            <button type="button" className="btn btn-success mb-5" onClick={() => {carregaListaTransportes()}}>
              Exibir dados estatísticos
            </button>
          </div>
        </div>

        {/* Exibir resultado */}
        <div className="row">
            <div className="col">
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Cidade 1</th>
                    <th>Cidade 2</th>
                    <th>Cidade 3</th>
                    <th>Carga Total</th>
                    <th>Descarregar</th>
                    <th>Preço Final</th>
                  </tr>
                </thead>

                <tbody id="listaTransportes"></tbody>
              </table>
            </div>
        </div>

        <div className="row">
          <div className="col mb-3">
            <h2 className="display-5">Limpar banco de dados</h2>
          </div>
          
        </div>
       

        <div className="row">
          <div className="col-md-4 mb-5">
            <button type="button" className="btn btn-danger" onClick={() => {limpaBancoDados()}}>
              Limpar histórico
            </button>
          </div>
        </div>

        

      </div>
      {/* Fim do container */}


      {/* Div Modal */}
      <div
        className="modal fade"
        id="modalRegistro2"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div id="modalHeader">
              <h5 className="modal-title" id="modalTitulo">
                teste
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            <div className="modal-body" id="modalBody"></div>

            <div className="modal-footer">
              <button type="button" id="modalButton" data-dismiss="modal">
                Voltar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Transporte;
