import logo from "./delllogo.png"
import './App.css';

function App() {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Sistema de transporte de cargas</title>

        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous"></link>

        <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>

        <script defer src="https://use.fontawesome.com/releases/v5.0.8/js/all.js"></script>

        <script src="Sistema.js"></script>

      </head>

      <body>

        <nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-3">
          <div class="container">
            <a class="navbar-brand" href="app.js">
              <img src={logo} width="100" height="50" alt=""></img>
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

          <div class="row">
            <div class="col-md-4">
              <button type="button" class="btn btn-primary">
                <i class="fas fa-plus">Teste</i>
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}

export default App;
