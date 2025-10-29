import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BreadCrumbs } from '../components/BreadCrumbs/BreadCrumbs';
import { ROUTES, ROUTE_LABELS } from '../Routes';
import { getPaint } from '../modules/PaintsApi';
import type { Paint } from '../modules/PaintsTypes';
import { Spinner } from 'react-bootstrap';
import Header from '../components/Header/Header';
import { PAINTS_MOCK } from '../modules/mock';
import './PaintPage.css';

export default function PaintPage() {
  const [paint, setPaint] = useState<Paint | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    if (!id) return;
    
    const fetchPaint = async () => {
      try {
        setLoading(true);
        const paintData = await getPaint(Number(id));
    
        if (!paintData) {
          const mockPaint = PAINTS_MOCK.find(p => p.id === Number(id)) || null;
          setPaint(mockPaint);
        } else {
          setPaint(paintData);
        }
      } catch (error) {
        console.error('Error fetching paint, using mocks:', error);
        const mockPaint = PAINTS_MOCK.find(p => p.id === Number(id)) || null;
        setPaint(mockPaint);
      } finally {
        setLoading(false);
      }
    };

    fetchPaint();
  }, [id]);


  const getImageUrl = (filename: string) => {
    if (!filename || imageError) return '/src/assets/error_paint.png';
    return `http://localhost:9000/test/${filename}`;
  };

  const handleImageError = () => {
    setImageError(true);
  };

  if (loading) {
    return (
      <div className="paint-page">
        <Header />
        <div className="paint-page-loader">
          <Spinner animation="border" />
        </div>
      </div>
    );
  }

  if (!paint) {
    return (
      <div className="paint-page">
        <Header />
        <div className="paint-not-found">
          <h1>Краска не найдена</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="paint-page">
      <Header />
      
      <BreadCrumbs
        crumbs={[
          { label: ROUTE_LABELS.PAINTS, path: ROUTES.PAINTS },
          { label: paint.title },
        ]}
      />

      <div className="paint-container">
        <div className="paint-image-container">
          <img 
            src={getImageUrl(paint.photo)} 
            alt={paint.title}
            className="paint-image"
            onError={handleImageError}
          />
        </div>
        <div className="paint-info">
          <h1 className="paint-title">{paint.title}</h1> 
          <div className="paint-hiding-power">Укрывистость {paint.hiding_power} г/м²</div>
        </div>
      </div>
      
      <div className="paint-description">
        <p>{paint.description}</p>
      </div>
    </div>
  );
}