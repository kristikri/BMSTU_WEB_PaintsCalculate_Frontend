import { type FC } from "react";
import Header from '../components/Header/Header';
import { BreadCrumbs } from '../components/BreadCrumbs/BreadCrumbs';
import './HomePage.css'; 
import backgroundImage from '../assets/background.png';

export const HomePage: FC = () => {
  return (
    <>
      <Header />
      <BreadCrumbs
        crumbs={[]}
      />
      <div className="home-banner">
        <div className="banner-content">
          <h1>Paints</h1>
          <p>
            Здесь вы можете посчитать необходимое количество краски для покраски фасада.
          </p>
        </div>
        <div className="banner-overlay"></div>
        <img 
          src={backgroundImage}
          alt="Paints" 
          className="banner-bg"
        />
      </div>
    </>
  );
};