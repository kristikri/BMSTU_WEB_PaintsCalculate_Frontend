import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ROUTES } from "./Routes";
import { HomePage } from "./pages/HomePage";
import PaintPage from './pages/PaintPage';
import PaintsPage from "./pages/PaintsPage";
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import CalculatePage from './pages/CalculatePage';
import CalculatesPage from './pages/CalculatesPage';
import ProfilePage from './pages/ProfilePage'; 
import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
  return (
    <BrowserRouter basename="/BMSTU_WEB_Frontend">
      <Routes>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.PAINTS} element={<PaintsPage />} />
        <Route path={ROUTES.PAINT} element={<PaintPage />} />  
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />  
        <Route path={ROUTES.REGISTER} element={<RegistrationPage />} /> 
        <Route path={ROUTES.CALCULATE} element={<CalculatePage />} />
        <Route path={ROUTES.CALCULATES} element={<CalculatesPage />} />
        <Route path={ROUTES.PROFILE} element={<ProfilePage />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;