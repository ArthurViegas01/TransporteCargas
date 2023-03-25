import React, { useEffect, useState } from "react";
import logo from "./delllogo.png"
import DataGrid from "./DataGrid";
import './App.css';


const parseCSV = (text) => {
  const result = {
    header:[],
    data:[],
  }
  
  //Pega a primeira linha e transforma no cabeçalho e o resto (...) atríbui a content
  const [header, ...content] = text.split('\n');

  result.header = header.split(';');

  content.forEach((item) => {
    result.data.push(item.split(';'));
  });

  return result;
}

function App() {
  const [arquivoCSV, setCSV] = useState(null)

  //Carrega o arquivo ao carregar a página
  useEffect(() => {
    fetch('/DNITDistancias.csv')
    .then(r => r.text())
    .then((text) => {
      //Chama a função manipuladora de csv para quebrar arquivo em arrays
      setCSV(parseCSV(text))
    })
  }, []);

  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Sistema de transporte de cargas</title>

        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous"></link>

        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>

      </head>

      <body>

        <nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-3">
          <div class="container">
            <a class="navbar-brand" href="app.js">
              <img src={logo} width="70" height="40" alt=""></img>
            </a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarSupportedContent">
              <ul class="navbar-nav mr-auto">
                <li class="nav-item active">
                  <a class="nav-link" href="app.js">Home</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <div class="container">
          <div class="row">
            <div class="col mb-3">
              <h1 class="display-4">Sistema de transporte de cargas</h1>
            </div>
          </div>

          <DataGrid csv={arquivoCSV}/>

        </div>

        
      </body>
    </html>
  );
}

export default App;
