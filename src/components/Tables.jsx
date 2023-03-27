import React from 'react'

export const Tables = () => {
  return (
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
  )
}

export default Tables;