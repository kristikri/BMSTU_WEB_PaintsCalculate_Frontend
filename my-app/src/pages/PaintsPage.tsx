import { useEffect } from 'react';
import Header from '../components/Header/Header';
import Search from '../components/Search/Search';
import PaintsList from '../components/PaintsList/PaintsList';
import { BreadCrumbs } from '../components/BreadCrumbs/BreadCrumbs';
import { ROUTE_LABELS } from '../Routes';
import { listPaints } from '../modules/PaintsApi';
import { PAINTS_MOCK } from '../modules/mock'; 
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setPaints, setLoading } from '../store/slices/paintsSlice';
import { setSearchTitle, addToHistory } from '../store/slices/searchSlice';
import './PaintsPage.css';

export default function PaintsPage() {
  const dispatch = useAppDispatch();
  const { paints, loading } = useAppSelector(state => state.paints);
  const { searchTitle } = useAppSelector(state => state.search);

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
    // Тот же подход для моков
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
    </div>
  );
}