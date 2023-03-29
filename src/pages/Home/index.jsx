import React, { useEffect, useState } from "react";
import { Tabela, procuraTrecho, cadastraTransporte } from "../../Sistema";
import DataGrid from "../../components/DataGrid";
import Tables from "../../components/Tables";
import Carousel from "../../components/Carousel";
import Navbar from "../../components/Navbar";
import "../../../src/App.css";


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

function Home() {
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
      
      <Navbar/>

      <Carousel/>

      <div className="container">
        <div className="row">
          <div className="col mb-3">
            <h1 className="display-4 titulo">
              Sistema de transporte de cargas
            </h1>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <h2 className="display-5">Tabelas</h2>
          </div>
        </div>

        <h5>Distância entre cidades</h5>
        <DataGrid csv={arquivoCSV} />

        {/* Tabela de pesos dos itens | custo x kilometro */}
        <Tables />

        <div className="row">
          <div className="col mb-3">
            <h2 className="display-5">Consultar trecho x modalidade</h2>
            <p>&#40;Por favor digitar sem utilizar acentos&#41;</p>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-md-4">
            <input type="text" className="form-control" placeholder="Cidade 1" id="cidade1"/>
          </div>

          <div className="col-md-4">
            <input type="text" className="form-control" placeholder="Cidade 2" id="cidade2"/>
          </div>

          <div className="col-md-4">
            <select className="form-control" id="tipoCaminhao">
              <option value="4.87">Pequeno porte</option>
              <option value="11.92">Médio porte</option>
              <option value="27.44">Grande porte</option>
            </select>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-md-4">
            <button type="button" className="btn btn-primary" onClick={() =>
                procuraTrecho(
                  document.getElementById("cidade1").value,
                  document.getElementById("cidade2").value,
                  document.getElementById("tipoCaminhao").value,
                  tabela
                )
              }
            > Consultar trecho</button>
          </div>
        </div>

        {/* Cadastrar Transporte */}
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
            <input type="text" className="form-control" placeholder="Partida" id="parada1"/>
            <input type="text" className="form-control mt-5 mb-5" placeholder="Parada" id="parada2"/>
            <input type="text" className="form-control mt-5" placeholder="Destino" id="parada3"/>

            <div>
              <button
                type="button"
                className="mt-5 btn btn-dark"
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
                Fazer entrega
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
                    <input type="text" className="form-control ocupando" id="descarregarCelular"/>
                  </td>
                </tr>
                <tr>
                  <td>Geladeira</td>
                  <td>
                    <input type="text" className="form-control ocupando" id="descarregarGeladeira"/>
                  </td>
                </tr>
                <tr>
                  <td>Freezer</td>
                  <td>
                    <input type="text" className="form-control ocupando" id="descarregarFreezer"/>
                  </td>
                </tr>
                <tr>
                  <td>Cadeira</td>
                  <td>
                    <input type="text" className="form-control ocupando" id="descarregarCadeira"/>
                  </td>
                </tr>
                <tr>
                  <td>Luminária</td>
                  <td>
                    <input type="text" className="form-control ocupando" id="descarregarLuminaria"/>
                  </td>
                </tr>
                <tr>
                  <td>Lavadora de roupas</td>
                  <td>
                    <input type="text" className="form-control ocupando" id="descarregarLavadora"/>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Exibir resultado */}
          <div className="col mb-3"></div>
        </div>

        <div className="row">
          <div className="col mb-3">
            <h2 className="display-5">Dados estatísticos</h2>
          </div>
        </div>

        <div className="row">
          <div className="col-md-4">
            <button type="button" className="btn btn-success mb-5">
              Exibir dados estatísticos
            </button>
          </div>
        </div>

        <div className="row">
          <div className="col mb-3">
            <h2 className="display-5">Finalizar programa</h2>
          </div>
        </div>

        <div className="row">
          <div className="col-md-4 mb-5">
            <button type="button" className="btn btn-danger">
              Limpar histórico
            </button>
          </div>
        </div>
      </div>
      {/* Div container */}

      {/* Div Modal */}
      <div
        className="modal fade"
        id="modalRegistro"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div id="modalHeader">
              <h5 className="modal-title" id="modalTitulo">teste</h5>
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
    // Div Principal
  );
}

export default Home;