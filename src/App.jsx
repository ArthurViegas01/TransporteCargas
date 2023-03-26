import React, { useEffect, useState } from "react";
import { Tabela, procuraTrecho } from "./Sistema.js";
import logo from "./delllogo.png";
import DataGrid from "./DataGrid";
import "./App.css";

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

function App() {
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
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-3">
        <div className="container">
          <a className="navbar-brand" href="App.js">
            <img src={logo} width="70" height="40" alt=""></img>
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item active">
                <a className="nav-link" href="app.js">
                  Home
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>





      







      <div className="container">
        <div className="row">
          <div className="col mb-3">
            <h1 className="display-4 titulo">Sistema de transporte de cargas</h1>
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
        <div className="row">
          <div className="col mb-3">
            <h5>Pesos dos itens</h5>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Itens</th>
                  <th>Peso(kg)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Celular</td>
                  <td>0,5</td>
                </tr>
                <tr>
                  <td>Geladeira</td>
                  <td>60</td>
                </tr>
                <tr>
                  <td>Freezer</td>
                  <td>100</td>
                </tr>
                <tr>
                  <td>Cadeira</td>
                  <td>5</td>
                </tr>
                <tr>
                  <td>Luminária</td>
                  <td>0,8</td>
                </tr>
                <tr>
                  <td>Lavadora de roupas</td>
                  <td>120</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="col mb-3">
            <h5>Relação custo x kilometro</h5>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Itens</th>
                  <th>Preço por KM (R$/km)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Caminhão de pequeno porte</td>
                  <td>4.87</td>
                </tr>
                <tr>
                  <td>Caminhão de médio porte</td>
                  <td>11.92</td>
                </tr>
                <tr>
                  <td>Caminhão de grande porte</td>
                  <td>27.44</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="row">
          <div className="col mb-3">
            <h2 className="display-5">Consultar trecho x modalidade</h2>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Cidade 1"
              id="cidade1"
            />
          </div>

          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Cidade 2"
              id="cidade2"
            />
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
            <button
              type="button"
              className="btn btn-primary"
              onClick={() =>
                procuraTrecho(
                  document.getElementById("cidade1").value,
                  document.getElementById("cidade2").value,
                  document.getElementById("tipoCaminhao").value,
                  tabela
                )
              }
            >
              Consultar trecho
            </button>
          </div>
        </div>

        <div className="row">
          <div className="col mb-3">
            <h2 className="display-5">Cadastrar transporte</h2>
          </div>
        </div>

        <div className="row">
          {/* Itens iniciais */}
          <div className="col mb-3">
            <h6>Itens iniciais</h6>
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
                      id="pesoCelular"
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
                      id="pesoGeladeira"
                    />
                  </td>
                </tr>
                <tr>
                  <td>Freezer</td>
                  <td>
                    <input
                      type="text"
                      className="form-control ocupando"
                      id="pesoFreezer"
                    />
                  </td>
                </tr>
                <tr>
                  <td>Cadeira</td>
                  <td>
                    <input
                      type="text"
                      className="form-control ocupando"
                      id="pesoCadeira"
                    />
                  </td>
                </tr>
                <tr>
                  <td>Luminária</td>
                  <td>
                    <input
                      type="text"
                      className="form-control ocupando"
                      id="pesoLuminaria"
                    />
                  </td>
                </tr>
                <tr>
                  <td>Lavadora de roupas</td>
                  <td>
                    <input
                      type="text"
                      className="form-control ocupando"
                      id="pesoLavadora"
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
              <button type="button" className="mt-5 btn btn-dark">Fazer entrega</button>
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
                      id="pesoCelular"
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
                      id="pesoGeladeira"
                    />
                  </td>
                </tr>
                <tr>
                  <td>Freezer</td>
                  <td>
                    <input
                      type="text"
                      className="form-control ocupando"
                      id="pesoFreezer"
                    />
                  </td>
                </tr>
                <tr>
                  <td>Cadeira</td>
                  <td>
                    <input
                      type="text"
                      className="form-control ocupando"
                      id="pesoCadeira"
                    />
                  </td>
                </tr>
                <tr>
                  <td>Luminária</td>
                  <td>
                    <input
                      type="text"
                      className="form-control ocupando"
                      id="pesoLuminaria"
                    />
                  </td>
                </tr>
                <tr>
                  <td>Lavadora de roupas</td>
                  <td>
                    <input
                      type="text"
                      className="form-control ocupando"
                      id="pesoLavadora"
                    />
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
          <div className="col-md-4">
            <button type="button" className="btn btn-danger">
              Limpar histórico
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
