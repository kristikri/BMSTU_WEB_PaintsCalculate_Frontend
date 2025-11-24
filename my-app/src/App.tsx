import { BrowserRouter, Route, Routes } from "react-router-dom";
import PaintsPage from "./pages/PaintsPage";
import { ROUTES } from "./Routes";
import { HomePage } from "./pages/HomePage";
import PaintPage from './pages/PaintPage';
import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
  return (
    <BrowserRouter basename="">
      <Routes>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.PAINTS} element={<PaintsPage />} />
        <Route path={ROUTES.PAINT} element={<PaintPage />} />     
      </Routes>
    </BrowserRouter>
  );
}

export default App;