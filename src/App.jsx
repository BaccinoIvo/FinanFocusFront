import { lazy, Suspense, useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Layout from "./components/Layout";
import RutaPrivada from "./components/RutaPrivada";
import RutaPublica from "./components/RutaPublica";
import RutaTipo from "./components/RutaTipo";
import Login from "./pages/Login";
import Registro from "./pages/Registro";

// Cada pantalla se descarga recién cuando se visita: la primera carga pesa menos.
const Landing = lazy(() => import("./pages/Landing"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Movimientos = lazy(() => import("./pages/Movimientos"));
const Categorias = lazy(() => import("./pages/Categorias"));
const Planes = lazy(() => import("./pages/Planes"));
const Perfil = lazy(() => import("./pages/Perfil"));
const Invitacion = lazy(() => import("./pages/Invitacion"));
const Clientes = lazy(() => import("./pages/Clientes"));
const ClienteDetalle = lazy(() => import("./pages/ClienteDetalle"));
const NoEncontrada = lazy(() => import("./pages/NoEncontrada"));

const TITULOS = {
  "/": "Tus finanzas en foco", "/login": "Ingresar", "/registro": "Crear cuenta", "/movimientos": "Movimientos",
  "/categorias": "Categorías", "/planes": "Planes", "/perfil": "Mi perfil", "/clientes": "Clientes", "/invitacion": "Invitación",
};

// Un título distinto por pantalla: ayuda a la navegación, al historial y a los lectores de pantalla.
const useTitulo = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    const base = pathname.startsWith("/clientes/") ? "Cliente" : TITULOS[pathname] ?? "Página no encontrada";
    document.title = pathname === "/" ? `FinanFocus · ${base}` : `${base} · FinanFocus`;
  }, [pathname]);
};

const App = () => {
  // "/" muestra la landing a quien no inició sesión y el inicio de la app a quien sí.
  const { token, vencida } = useSelector((s) => s.auth);
  useTitulo();

  return (
    <Suspense fallback={<p className="suave cargando-pagina" role="status">Cargando...</p>}>
      <Routes>
        {/* Si la sesión venció, en vez de la portada se lleva a quien estaba usando la app al login (con el aviso). */}
        {!token && <Route path="/" element={vencida ? <Navigate to="/login" replace /> : <Landing />} />}

        {/* La invitación se puede abrir con o sin sesión: si falta, se pide iniciar sesión y se recuerda el código. */}
        <Route path="/invitacion" element={<Invitacion />} />

        <Route element={<RutaPublica />}>
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
        </Route>

        <Route element={<RutaPrivada />}>
          <Route element={<Layout />}>
            {token && <Route path="/" element={<Dashboard />} />}
            <Route element={<RutaTipo tipo="usuario" />}>
              <Route path="/movimientos" element={<Movimientos />} />
            </Route>
            <Route element={<RutaTipo tipo="estudio" />}>
              <Route path="/clientes" element={<Clientes />} />
              <Route path="/clientes/:id" element={<ClienteDetalle />} />
            </Route>
            <Route path="/categorias" element={<Categorias />} />
            <Route path="/planes" element={<Planes />} />
            <Route path="/perfil" element={<Perfil />} />
          </Route>
        </Route>

        <Route path="*" element={<NoEncontrada />} />
      </Routes>
    </Suspense>
  );
};

export default App;
