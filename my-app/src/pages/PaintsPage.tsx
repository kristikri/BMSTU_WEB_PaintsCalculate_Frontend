import { useEffect } from 'react';
import Header from '../components/Header/Header';
import Search from '../components/Search/Search';
import PaintsList from '../components/PaintsList/PaintsList';
import { BreadCrumbs } from '../components/BreadCrumbs/BreadCrumbs';
import { ROUTE_LABELS } from '../Routes';
import { listPaints } from '../modules/PaintsApi';
import { PAINTS_MOCK } from '../modules/mock'; 
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setPaints, setLoading } from '../store/slices/paintSlice';
import { setSearchTitle, addToHistory } from '../store/slices/searchSlice';
import './PaintsPage.css';
import CalculatorImage from '../assets/calculate.png';
import { getCalculateCart } from '../store/slices/calculateSlice';
import { Link } from 'react-router-dom';

export default function PaintsPage() {
  const dispatch = useAppDispatch();
  const { paints, loading } = useAppSelector(state => state.paints);
  const { searchTitle } = useAppSelector(state => state.search);
  const { isAuthenticated } = useAppSelector(state => state.user);
  const { calculateCart, paints_count } = useAppSelector(state => state.calculate);

  useEffect(() => {
  if (isAuthenticated) {
    dispatch(getCalculateCart());
    }
  }, [isAuthenticated, dispatch]);

    const loadData = async (searchQuery?: string) => {
    dispatch(setLoading(true));
    try {
      const apiData = await listPaints({ title: searchQuery });
      
      let dataToDisplay = apiData.length > 0 ? apiData : PAINTS_MOCK;
      if (searchQuery) {
      dataToDisplay = dataToDisplay.filter(paint =>
        paint.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    dispatch(setPaints(dataToDisplay));
    
  } catch (error) {
    let filteredMock = PAINTS_MOCK;
    if (searchQuery) {
      filteredMock = PAINTS_MOCK.filter(paint =>
        paint.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    dispatch(setPaints(filteredMock));
  } finally {
    dispatch(setLoading(false));
  }
};
      /*if (apiData.length > 0) {
        dispatch(setPaints(apiData));
      } else {
        let filteredMock = PAINTS_MOCK;
        if (searchQuery) {
          filteredMock = PAINTS_MOCK.filter(paint =>
            paint.title.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        dispatch(setPaints(filteredMock));
      }
    } catch (error) {
      let filteredMock = PAINTS_MOCK;
      if (searchQuery) {
        filteredMock = PAINTS_MOCK.filter(paint =>
          paint.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      dispatch(setPaints(filteredMock));
    } finally {
      dispatch(setLoading(false));
    }
  };*/

   useEffect(() => {
    loadData();
  }, []);

  const handleSearch = async () => {
    if (searchTitle) {
      dispatch(addToHistory(searchTitle));
    }
    await loadData(searchTitle);
  };

  return (
    <div className="paints">
      <Header />
      
      <BreadCrumbs
        crumbs={[
          { label: ROUTE_LABELS.PAINTS },
        ]}
      />
      <p style={{fontSize: '34px', backgroundColor: 'white', paddingLeft: '35px', height: '70px', paddingTop: '20px', margin: '0px'}}>
        Продукты
      </p>
      <div className="services-wrapper">
        <div className="search-container">
          <Search 
            query={searchTitle}
            onQueryChange={(value) => dispatch(setSearchTitle(value))}
            onSearch={handleSearch}
          />
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>Загрузка...</div>
        ) : (
          <div className="paints-container">
            {paints.length > 0 ? (
              <PaintsList paints={paints} />
            ) : (
              <div className="no-paints"  style={{ textAlign: 'center', padding: '40px' }}>
                {searchTitle 
                  ? `По запросу "${searchTitle}" краски не найдены` 
                  : 'Краски не найдены'
                }
              </div>
            )}
          </div>
        )}
      </div>
      {isAuthenticated ? (
        <Link
          to={calculateCart?.id ? `/calculate/${calculateCart.id}` : '#'} 
          className={`calculate-button ${!calculateCart?.id ? 'inactive-calculate-button' : ''}`}
          onClick={(e) => {
            if (!calculateCart?.id) {
              e.preventDefault();
              alert('Корзина пуста');
            }
          }}
        >
          <img src={CalculatorImage} alt="Раcчеты" className="calculate-logo"/>
          {paints_count > 0 && (
            <span className="cart-badge">{paints_count}</span>
          )}
        </Link>
      ) : (
        <div 
          className="inactive-calculate-button"
          onClick={() => alert('Для доступа к расчетам необходимо войти в систему')}
        >
          <img src={CalculatorImage} alt="Раcчеты"/>
        </div>
      )}
    </div>
  );
}