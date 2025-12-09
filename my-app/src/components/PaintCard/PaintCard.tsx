import { Link } from "react-router-dom";
import type { Paint } from "../../modules/PaintsTypes";
import './PaintCard.css';
import { useState, useEffect } from 'react';
import defaultPaintImage from '../../assets/default_paint.png';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../store';
import { addToCalculate } from '../../store/slices/calculateSlice';


export default function PaintCard({ paint}:{paint:Paint}) {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.user);
  const { loading } = useSelector((state: RootState) => state.calculate);
    
  const [imageError, setImageError] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState('');
  
  const getImageUrl = (photo: string) => {
    if (!photo) return defaultPaintImage;
    return `http://localhost:9000/paints/${photo}`;
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

    const handleAddToRequest = async() => {
    if (!isAuthenticated) {
      return;
    }

    setAddLoading(true);
    setAddError('');
    try {
      await dispatch(addToCalculate({paintId: paint.id})).unwrap();
      console.log('Краска добавлена в расчет');
    } catch (error: any) {
      if (error.response?.status === 409) {
        setAddError('Краска уже добавлена в расчет');
      } else {
        setAddError('Ошибка добавления в расчет');
      }
      console.error('Ошибка добавления в расчет:', error);
    } finally {
      setAddLoading(false);
    }
  };

 return (
    <div className="paint">
      <p className="paint-title">{paint.title}</p>
      <Link to={`/paint/${paint.id}`} className="paint-image-container">
        <img 
          src={imageError ? defaultPaintImage : imageUrl}
          alt={paint.title}
          className="paint-image"
          onError={handleImageError}
        />
      </Link>
      
      <p className="hiding-power">{paint.hiding_power} г/м²</p>
      
      <div className="paint-footer">
        <button 
          type="button" 
          className="paint-button"
          onClick={handleAddToRequest}
          disabled={addLoading || loading}
        >
          Добавить
        </button>
        
        <Link to={`/paint/${paint.id}`} className="paint-button">Подробнее</Link>
      
        {addError && (
          <div className="error-message">
            {addError}
          </div>
        )}
      </div>
    </div>
  );
}