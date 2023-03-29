import React from 'react'
import Caminhao1 from "../assets/caminhao1.png";
import Caminhao2 from "../assets/caminhao2.png";
import Caminhao3 from "../assets/caminhao3.png";
import "./carousel.css";

export const Carousel = () => {
  return (
    <div className="caixa">
        <div className="justify-content-center divTesteNave">
          <div id="carouselExampleIndicators" className="carousel slide" data-ride="false" data-interval="false">
            <ol className="carousel-indicators">
              <li data-target="#carouselExampleIndicators" data-slide-to="0" className="active"></li>
              <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
              <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
            </ol>
            <div className="carousel-inner">
              <div className="carousel-item active">
                <img src={Caminhao3} className="greyOpacity" alt="..."></img>
                <div className="container">
                  <div className="carousel-caption text-left">
                    <h1>Dely.</h1>
                    <p>A transportadora que você pode confiar.</p>
                  </div>
                </div>
              </div>
              <div className="carousel-item">
                <img src={Caminhao2} className="" alt="..."></img>
                <div className="container">
                  <div className="carousel-caption text-start">
                    <h1>Alcance</h1>
                    <p>Serviços de entrega saindo de todos os estados do Brasil</p>
                  </div>
                </div>
              </div>
              <div className="carousel-item">
                <img src={Caminhao1} className="" alt="..."></img>
                <div className="">
                  <div className="carousel-caption text-right">
                    <h1>Inclusão</h1>
                    <p>Website com design feito com design responsivo para você acessar de qualquer lugar</p>
                  </div>
                </div>
              </div>
            </div>
            <button className="carousel-control-prev" type="button" data-target="#carouselExampleIndicators" data-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="sr-only">Anterior</span>
            </button>
            <button className="carousel-control-next" type="button" data-target="#carouselExampleIndicators" data-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="sr-only">Próximo</span>
            </button>
          </div>
        </div>
      </div>
  )
}

export default Carousel;