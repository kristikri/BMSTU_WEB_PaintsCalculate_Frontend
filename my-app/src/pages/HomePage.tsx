import { type FC } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../Routes";
import Header from '../components/Header/Header';
import { BreadCrumbs } from '../components/BreadCrumbs/BreadCrumbs';
import { Button } from "react-bootstrap";
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
          <Link to={ROUTES.PAINTS}>
            <Button className="button">Просмотреть фасадные краски</Button>
          </Link>
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