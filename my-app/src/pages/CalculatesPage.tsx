import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header/Header';
import { BreadCrumbs } from '../components/BreadCrumbs/BreadCrumbs';
import { ROUTE_LABELS, ROUTES } from '../Routes';
import { useAppSelector } from '../store/hooks';
import { api } from '../api';
import './CalculatesPage.css';

interface Calculate {
  id?: number;
  status?: string;
  creator_login?: string;
  moderator_login?: string;
  date_create?: string;
  dateFinish?: string;
  dateForm?: string;
  min_layers?: number;
}

export default function CalculatesPage() {
  const navigate = useNavigate();
  
  const { isAuthenticated, username } = useAppSelector(state => state.user);
  const [calculates, setCalculates] = useState<Calculate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadCalculates();
  }, [isAuthenticated, navigate]);

  const loadCalculates = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await api.requests.requestsList();
      
      // Фильтруем: убираем черновики И показываем только расчеты текущего пользователя
      const filteredCalculates = response.data.filter((calculate: Calculate) => 
        calculate.status !== 'draft' && calculate.creator_login === username
      );
      
      setCalculates(filteredCalculates);
    } catch (error: any) {
      setError(error.response?.data?.description || 'Ошибка загрузки расчетов');
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status: string | undefined) => {
    if (!status) return 'Неизвестно';
    
    const statusMap: { [key: string]: string } = {
      'draft': 'Черновик',
      'formed': 'Сформирована', 
      'completed': 'Завершена',
      'rejected': 'Отклонена',
    };
    return statusMap[status] || status;
  };

  const getStatusClass = (status: string | undefined) => {
    if (!status) return '';
    
    const classMap: { [key: string]: string } = {
      'draft': 'status-draft',
      'formed': 'status-formed',
      'completed': 'status-completed',
      'rejected': 'status-rejected'
    };
    return classMap[status] || '';
  };

  const filteredCalculates = statusFilter === 'all' 
    ? calculates 
    : calculates.filter(calculate => calculate.status === statusFilter);

  const handleCalculateClick = (calculateId: number) => {
    navigate(`/calculate/${calculateId}`);
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '—';
    try {
      return new Date(dateString).toLocaleDateString('ru-RU');
    } catch {
      return '—';
    }
  };

  if (loading) {
    return (
      <div className="calculates-page">
        <Header />
        <div className="loading">Загрузка расчетов...</div>
      </div>
    );
  }

  return (
    <div className="calculates-page">
      <Header />
      
      <BreadCrumbs
        crumbs={[
          { label: ROUTE_LABELS.PAINTS, path: ROUTES.PAINTS },
          { label: 'Мои расчеты' },
        ]}
      />
      
      <main>
        <div className="calculates-header">
          <h1>Мои расчеты красок</h1>
          <p>Пользователь: {username}</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Фильтры по статусу */}
        <div className="filters-section">
          <div className="status-filters">
            <button 
              className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
              onClick={() => setStatusFilter('all')}
            >
              Все
            </button>
            <button 
              className={`filter-btn ${statusFilter === 'formed' ? 'active' : ''}`}
              onClick={() => setStatusFilter('formed')}
            >
              Сформированы
            </button>
            <button 
              className={`filter-btn ${statusFilter === 'completed' ? 'active' : ''}`}
              onClick={() => setStatusFilter('completed')}
            >
              Завершены
            </button>
            <button 
              className={`filter-btn ${statusFilter === 'rejected' ? 'active' : ''}`}
              onClick={() => setStatusFilter('rejected')}
            >
              Отклонены
            </button>
          </div>
        </div>

        <div className="calculates-table-container">
          {filteredCalculates.length > 0 ? (
            <table className="calculates-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Статус</th>
                  <th>Дата создания</th>
                  <th>Дата завершения</th>
                  <th>Дата формирования</th>
                  <th>Мин. слоев</th>
                  <th>Модератор</th>
                </tr>
              </thead>
              <tbody>
                {filteredCalculates.map((calculate) => (
                  <tr 
                    key={calculate.id}
                    className="calculate-row"
                    onClick={() => calculate.id && handleCalculateClick(calculate.id)}
                  >
                    <td className="calculate-id">#{calculate.id}</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(calculate.status)}`}>
                        {getStatusText(calculate.status)}
                      </span>
                    </td>
                    <td>{formatDate(calculate.date_create)}</td>
                    <td>{formatDate(calculate.dateFinish)}</td>
                    <td>{formatDate(calculate.dateForm)}</td>
                    <td>{calculate.min_layers || '—'}</td>
                    <td>{calculate.moderator_login || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-calculates">
              <p>Расчеты не найдены</p>
              {statusFilter !== 'all' && (
                <button 
                  className="btn-clear-filter"
                  onClick={() => setStatusFilter('all')}
                >
                  Показать все расчеты
                </button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}