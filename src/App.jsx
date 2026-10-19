import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import RutaPrivada from "./components/RutaPrivada";
import RutaPublica from "./components/RutaPublica";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Registro from "./pages/Registro";

const App = () => (
  <Routes>
    <Route element={<RutaPublica />}>
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
    </Route>

    <Route element={<RutaPrivada />}>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
      </Route>
    </Route>

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default App;
