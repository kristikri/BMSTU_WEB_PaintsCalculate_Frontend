import { Link } from "react-router-dom";
import type { Paint } from "../../modules/PaintsTypes";
import './PaintCard.css';
import { useState, useEffect } from 'react';
import defaultPaintImage from '../../assets/default_paint.png';

interface PaintCardProps {
  paint: Paint;
  currentRequestID?: number;
  onAddToRequest?: (paintId: number) => void;
}

export default function PaintCard({ paint, currentRequestID, onAddToRequest }: PaintCardProps) {
  const [imageError, setImageError] = useState(false);
  
  const getImageUrl = (filename: string) => {
    if (!filename) return defaultPaintImage;
    return `http://localhost:9000/paints/${filename}`;
  };

  const [imageUrl, setImageUrl] = useState(getImageUrl(paint.photo));

  useEffect(() => {
    if (!paint.photo) {
      setImageUrl(defaultPaintImage);
    } else {
      setImageUrl(getImageUrl(paint.photo));
    }
  }, [paint.photo]);

  const handleImageError = () => {
    setImageError(true);
    setImageUrl(defaultPaintImage);
  };

  const handleAddToRequest = () => {
    if (onAddToRequest) {
      onAddToRequest(paint.id);
    }
  };

  return (
    <div className="paint">
      <p className="paint-title">{paint.title}</p>
      
      <div className="paint-image-container">
        <img 
          src={imageError ? defaultPaintImage : imageUrl}
          alt={paint.title}
          className="paint-image"
          onError={handleImageError}
        />
      </div>
      
      <p className="hiding-power">{paint.hiding_power} г/м²</p>
      
      <div className="paint-footer">
        {currentRequestID && onAddToRequest && (
          <button type="button" className="paint-button"onClick={handleAddToRequest}>Добавить</button>
        )}
        
        <Link to={`/paint/${paint.id}`} className="paint-button">Подробнее</Link>
      </div>
    </div>
  );
}