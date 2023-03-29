import React, { useEffect, useState } from "react";
import { Tabela, procuraTrecho} from "../../Sistema";
import DataGrid from "../../components/DataGrid";
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