import { useEffect, useState } from 'react';
import Header from '../components/Header/Header';
import Search from '../components/Search/Search';
import PaintsList from '../components/PaintsList/PaintsList';
import { BreadCrumbs } from '../components/BreadCrumbs/BreadCrumbs';
import { ROUTE_LABELS } from '../Routes';
import { listPaints } from '../modules/PaintsApi';
import { PAINTS_MOCK } from '../modules/mock'; 
import type { Paint } from '../modules/PaintsTypes';
import './PaintsPage.css';

export default function PaintsPage() {
  const [paints, setPaints] = useState<Paint[]>([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [useMock, setUseMock] = useState(false);

  useEffect(() => {
    if (useMock) {
      setPaints(PAINTS_MOCK);
    } else {
      listPaints()
        .then((data) => {
          if (data.length > 0) {
            setPaints(data);
          } else {
            setPaints(PAINTS_MOCK);
            setUseMock(true);
          }
        })
        .catch(() => {
          setPaints(PAINTS_MOCK);
          setUseMock(true);
        });
    }
  }, [useMock]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const filtered = await listPaints({ title: searchTitle });
      
      if (filtered.length > 0) {
        setPaints(filtered);
        setUseMock(false);
      } else {
        if (useMock) {
          const filteredMock = PAINTS_MOCK.filter(paint =>
            paint.title.toLowerCase().includes(searchTitle.toLowerCase())
          );
          setPaints(filteredMock);
        } else {
          setPaints([]);
        }
      }
    } catch (error) {
      const filteredMock = PAINTS_MOCK.filter(paint =>
        paint.title.toLowerCase().includes(searchTitle.toLowerCase())
      );
      setPaints(filteredMock);
      setUseMock(true);
    } finally {
      setLoading(false);
    }
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
            onQueryChange={setSearchTitle}
            onSearch={handleSearch}
          />
        </div>

        {loading ? (
          <div>Загрузка...</div>
        ) : (
          <div className="paints-container">
            {paints.length > 0 ? (
              <PaintsList paints={paints} />
            ) : (
              <div className="no-paints">
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