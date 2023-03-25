import React, { useEffect, useState } from "react";
import { testeErro, Trajeto, vamoVe } from "./Sistema.js";
import logo from "./delllogo.png";
import DataGrid from "./DataGrid";
import "./App.css";

const parseCSV = (text) => {
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

  console.log(result);
  return result;
};

function App() {
  const [arquivoCSV, setCSV] = useState(null);

  //Carrega o arquivo ao carregar a página
  useEffect(() => {
    fetch("/DNITDistancias.csv")
      .then((r) => r.text())
      .then((text) => {
        //Chama a função manipuladora de csv para quebrar arquivo em arrays
        setCSV(parseCSV(text));
      });
}, []);

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-3">
        <div className="container">
          <a className="navbar-brand" href="#">
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
            <h1 className="display-4">Sistema de transporte de cargas</h1>
          </div>
        </div>

        <DataGrid csv={arquivoCSV} />

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
            <select className="form-control" id="ano">
              <option value="pequenop">Pequeno porte</option>
              <option value="mediop">Médio porte</option>
              <option value="grandep">Grande porte</option>
            </select>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-md-4">
            <button type="button" className="btn btn-primary">
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
          <div className="col mb-3">
            <h2 className="display-5">Dados estatísticos</h2>
          </div>
        </div>

        <div className="row">
          <div className="col mb-3">
            <h2 className="display-5">Finalizar programa</h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
