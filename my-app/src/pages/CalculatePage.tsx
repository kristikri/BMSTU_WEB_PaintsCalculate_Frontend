import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header/Header';
import { BreadCrumbs } from '../components/BreadCrumbs/BreadCrumbs';
import { ROUTE_LABELS, ROUTES } from '../Routes';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { 
  getCalculateDetail, 
  deleteCalculate,
  updateCalculateLayers,
  updatePaintParams,
  removeFromCalculate,
  formCalculate
} from '../store/slices/calculateSlice';
import './CalculatePage.css';
import defaultPaintImage from '../assets/default_paint.png';

export default function CalculatePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { calculateDetail, loading, saveLoading, error } = useAppSelector(state => state.calculate);
  const { isAuthenticated } = useAppSelector(state => state.user);
  
  const [paintAreas, setPaintAreas] = useState<{ [key: number]: number }>({});
  const [paintLayers, setPaintLayers] = useState<{ [key: number]: number }>({});
  const [imageErrors, setImageErrors] = useState<{ [key: number]: boolean }>({});
  const [minLayersValue, setMinLayersValue] = useState<number>(1);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const calculateId = id ? parseInt(id, 10) : null;

  const getStatusText = (status: string | undefined) => {
    if (!status) return 'draft';
    
    const statusMap: { [key: string]: string } = {
      'draft': 'Черновик',
      'formed': 'Сформирована', 
      'completed': 'Завершена',
      'rejected': 'Отклонена',
    };
    
    return statusMap[status] || status;
  };

  const isDraft = () => {
    const status = calculateDetail?.request?.Status;
    return status === 'draft' || status === 'черновик';
  };
  const minLayers = calculateDetail?.request?.min_layers ?? 1;

  const getPaints = () => {
    return calculateDetail?.requestPaints || [];
  };

  // Безопасное получение ID краски
  const getPaintId = (paint: any): number => {
    return paint.PaintID;
  };

  // Безопасное получение названия краски
  const getPaintTitle = (paint: any): string => {
    return paint.paint_title || 'Неизвестная краска';
  };

  // Безопасное получение укрывистости
  const getHidingPower = (paint: any): number => {
    return paint.hiding_power || 0;
  };


  // Расчет количества краски
  const calculatePaintQuantity = (paint: any) => {
    const paintId = getPaintId(paint);
    const area = paintAreas[paintId] || paint.area || 0;
    const layers = paintLayers[paintId] || paint.layers || 0;
    const hidingPower = getHidingPower(paint);
    
    if (area > 0 && layers > 0 && hidingPower > 0) {
      return ((area * layers * hidingPower)/1000).toFixed(2);
    }
    return '—';
  };

  useEffect(() => {
    if (calculateId && isAuthenticated) {
      dispatch(getCalculateDetail(calculateId));
    }
  }, [calculateId, isAuthenticated, dispatch]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (calculateDetail) {
      const areas: { [key: number]: number } = {};
      const layers: { [key: number]: number } = {};
      const paints = getPaints();
      
      paints.forEach(paint => {
        const paintId = getPaintId(paint);
        if (paint.Area !== undefined && paint.Area !== null) {
          areas[paintId] = paint.Area;
        }
        if (paint.Layers !== undefined && paint.Layers !== null) {
          layers[paintId] = Math.max(paint.Layers ?? minLayers, minLayers);
        }
      });
      
      setPaintAreas(areas);
      setPaintLayers(layers);
      setMinLayersValue(calculateDetail.request.min_layers);
    }
  }, [calculateDetail]);

  const handleAreaChange = (paintId: number, value: string) => {
    if (!isDraft()) return;
    
    const numValue = Math.max(0, parseFloat(value) || 0);
    setPaintAreas(prev => ({
      ...prev,
      [paintId]: numValue
    }));
  };

  const handleLayersChange = (paintId: number, value: string) => {
    if (!isDraft()) return;
    
    const numValue = Math.max(minLayers, parseInt(value) || minLayers);
    setPaintLayers(prev => ({
      ...prev,
      [paintId]: numValue
    }));
  };

  const handleImageError = (paintId: number) => {
    setImageErrors(prev => ({
      ...prev,
      [paintId]: true
    }));
  };

  const getImageUrl = (paint: any) => {
    const paintId = getPaintId(paint);
    if (imageErrors[paintId] || !paint.paint_photo) {
      return defaultPaintImage;
    }
    return `http://localhost:9000/test/${paint.paint_photo}`;
  };



  const handleSavePaintParams = async (paintId: number) => {
    if (!calculateId || !isDraft()) return;
    
    const areaValue = paintAreas[paintId];
    const layersValue = paintLayers[paintId];
    
    if (areaValue === undefined || layersValue === undefined) return;
    
    try {
      await dispatch(updatePaintParams({
        paintId,
        calculateId,
        area: areaValue,
        layers: layersValue
      })).unwrap();
      
      setSuccessMessage('Данные краски успешно сохранены!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error: any) {
      setSuccessMessage('Ошибка сохранения данных краски');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleRemovePaint = async (paintId: number) => {
    if (!calculateId || !isDraft()) return;
    
    try {
      await dispatch(removeFromCalculate({
        paintId,
        calculateId
      })).unwrap();
      
      dispatch(getCalculateDetail(calculateId));
      
      setSuccessMessage('Краска удалена из расчета!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error: any) {
      setSuccessMessage('Ошибка удаления краски');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleDeleteCalculate = async () => {
    if (!calculateId || !isDraft()) return;
    
    if (!window.confirm('Вы уверены, что хотите удалить этот расчет?')) {
      return;
    }
    
    try {
      await dispatch(deleteCalculate(calculateId)).unwrap();
      navigate('/paints');
    } catch (error) {
      setSuccessMessage('Ошибка удаления расчета');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleSubmitCalculate = async () => {
    if (!calculateId || !isDraft()) return;
    
    setSubmitLoading(true);
    setSuccessMessage('');
    
    try {
      await dispatch(formCalculate(calculateId)).unwrap();
      
      setSuccessMessage('Расчет успешно подтвержден!');
      
      setTimeout(() => {
        dispatch(getCalculateDetail(calculateId));
      }, 1000);
      
    } catch (error: any) {
      setSuccessMessage('Ошибка при подтверждении расчета');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="calculate-page">
        <Header />
        <div className="loading">Загрузка расчета...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="calculate-page">
        <Header />
        <div className="error-message">
          Ошибка загрузки расчета: {error}
        </div>
      </div>
    );
  }

  if (!calculateDetail || !calculateDetail.request) {
    return (
      <div className="calculate-page">
        <Header />
        <div className="empty-calculate">
          <p>Расчет не найден</p>
        </div>
      </div>
    );
  }

  const paints = getPaints();
  const currentStatus = calculateDetail?.request?.Status;
  const calculateDisplayId = calculateDetail?.request?.ID || calculateId;

  return (
    <div className="calculate-page">
      <Header />
      
      <BreadCrumbs
        crumbs={[
          { label: ROUTE_LABELS.PAINTS, path: ROUTES.PAINTS },
          { label: `Расчет #${calculateDisplayId}` },
        ]}
      />
      
      <main>
        <div className="calculate-header">
          <h1>Краски для расчета #{calculateDisplayId}</h1>
          <p>Всего красок: {paints.length}</p>
          <p>Статус: <strong>{getStatusText(currentStatus)}</strong></p>
          {calculateDetail?.request.moderator_login && (
            <p>Модератор: {calculateDetail.request.moderator_login}</p>
          )}
          <div className="min-layers-control">
            <label>Минимум слоёв</label>
            <input
            type="number"
            min={1}
            value={minLayersValue}
            disabled={!isDraft()}
            onChange={(e) => setMinLayersValue(Math.max(1, Number(e.target.value)))}
          />
          </div>

          <button
            className="btn-primary-save"
            disabled={!isDraft()}
            onClick={async () => {
              if (!calculateId) return;

              try {
                await dispatch(
                    updateCalculateLayers({
                    calculateId,
                    min_layers: minLayersValue
                  })
                ).unwrap();

                await dispatch(getCalculateDetail(calculateId));

                setSuccessMessage('Минимальное количество слоёв сохранено');
                setTimeout(() => setSuccessMessage(''), 3000);
              } catch {
                setSuccessMessage('Ошибка сохранения min_layers');
                setTimeout(() => setSuccessMessage(''), 3000);
              }
            }}
          >
            Сохранить
          </button>
        </div>

        {successMessage && (
          <div className={`success-message ${successMessage.includes('Ошибка') ? 'error' : 'success'}`}>
            {successMessage}
          </div>
        )}

        <div className="calculate-table-header">
          <span className="paint-name-header">Краска</span>
          <span className="hiding-power-header">Укрывистость</span>
          <span className="area-header">Площадь, м²</span>
          <span className="layers-header">Слои</span>
          <span className="quantity-header">Количество, кг</span>
          {isDraft() && <span className="actions-header">Действия</span>}
        </div>

        {paints.length > 0 ? (
          <ul className="calculate-grid-list">
            {paints.map((paint, index) => {
              const paintId = getPaintId(paint);
              const areaValue = paintAreas[paintId] ?? paint.Area ?? '';
              const layersValue = paintLayers[paintId] ?? paint.Layers ?? '';
              const quantity = calculatePaintQuantity(paint);
              
              return (
                <li key={paintId || index}>
                  <div className="calculate-item">
                    <Link to={`/paint/${paintId}`} className="calculate-item-thumbnail">
                      <img 
                        src={getImageUrl(paint)}
                        alt={getPaintTitle(paint)}
                        onError={() => handleImageError(paintId)}
                        className="paint-image"
                      />
                    </Link>

                    <Link to={`/paint/${paintId}`} className="calculate-item-heading">
                      <div className="calculate-paint-name">{getPaintTitle(paint)}</div>
                    </Link>

                    <div className="hiding-power-value">
                      <span>{getHidingPower(paint)} г/м²</span>
                    </div>
                    
                    {isDraft() ? (
                      <div className="param-input-container">
                        <input 
                          type="number" 
                          step="0.1"
                          min="0.1"
                          className="content-list-section param-input"
                          placeholder="Площадь" 
                          value={areaValue}
                          onChange={(e) => handleAreaChange(paintId, e.target.value)}
                        />
                      </div>
                    ) : (
                      <div className="area-value">
                        {areaValue ? `${areaValue} м²` : '—'}
                      </div>
                    )}

                    {isDraft() ? (
                      <div className="layers-control">
                         <button
                          className="layer-btn"
                          onClick={() =>
                            handleLayersChange(paintId, String((layersValue || 1) - 1))
                          }
                          disabled={(layersValue || minLayers) <= minLayers}
                        >
                          −
                        </button>

                        <span className="layers-value">
                          {layersValue || 1}
                        </span>

                        <button
                          className="layer-btn"
                          onClick={() =>
                            handleLayersChange(paintId, String((layersValue || 1) + 1))
                          }
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <div className="layers-value">
                        {layersValue ? `${layersValue}` : '—'}
                      </div>
                    )}

                    <div className="quantity-value">
                      {quantity}
                    </div>

                    {isDraft() && (
                      <div className="paint-actions">
                        <button 
                          className="btn-save-params"
                          onClick={() => handleSavePaintParams(paintId)}
                          disabled={saveLoading.paints[paintId] || !areaValue || !layersValue}
                        >
                          {saveLoading.paints[paintId] ? '...' : 'Сохранить'}
                        </button>
                        <button 
                          className="btn-remove-paint"
                          onClick={() => handleRemovePaint(paintId)}
                          title="Удалить краску из расчета"
                        >
                          <img src={defaultPaintImage} alt="Удалить" className="delete-icon" />
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="empty-calculate">
            <p>Нет красок для расчета</p>
          </div>
        )}
        <div className="calculate-actions">
          {isDraft() ? (
            <>
              <button 
                className="btn-primary-danger" 
                onClick={handleDeleteCalculate}
                disabled={submitLoading}
              >
                Удалить расчет
              </button>
              
              <button 
                className="btn-primary-confirm" 
                onClick={handleSubmitCalculate}
                disabled={submitLoading || paints.length === 0}
              >
                {submitLoading ? 'Подтверждение...' : 'Подтвердить расчет'}
              </button>
            </>
          ) : null}
        </div>
      </main>
    </div>
  );
}