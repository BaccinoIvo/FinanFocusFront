# FinanFocus – Frontend (Obligatorio 2)

Aplicación web para freelancers y estudios contables de Uruguay: ingresos y egresos en 7 monedas convertidos a pesos, comprobantes con lectura por IA, estadísticas y panel para estudios.

**Aplicación publicada:** https://finan-focus-front-gamma.vercel.app
**API (Obligatorio 1):** https://finan-focus.vercel.app/v1

## Tecnologías
React 19 + Vite · React Router 7 · Redux Toolkit · React Hook Form · Recharts.

```
npm install
npm run dev      # http://localhost:5173
npm run lint
npm run build    # genera dist/
```

Variable: `VITE_API_URL` (ver `.env.example`; si no se define usa la API publicada).
El backend debe tener la URL del frontend en `CORS_ORIGIN`.

## Estructura (src/)
| Carpeta | Contenido |
|---|---|
| `api/` | `api.js`: único wrapper de `fetch` (token, errores, timeout, 401 global, descarga de archivos). `comprobantes.js`: lectura por IA. |
| `store/` | Redux Toolkit: `auth`, `categorias`, `movimientos`, `uso` (informe y cambio de plan), `perfil`, `estadisticas`, `cotizaciones`, `resumen`, `estudio`. |
| `pages/` | Landing, Login, Registro, Dashboard, Movimientos, Categorias, Planes, Perfil, Invitacion, Clientes, ClienteDetalle. |
| `components/` | Formularios, listas, informe de uso, cambio de plan, gráficos, cotizaciones, resumen fiscal, rutas protegidas. |
| `utils/` | Constantes, formato, token, estadísticas, planes. |

## Requisitos de la letra → dónde están
1. **Registro**: `pages/Registro.jsx` (repetir contraseña, botón deshabilitado mientras haya datos inválidos, errores de la API en pantalla, auto-login).
2. **Login**: `pages/Login.jsx` (botón deshabilitado con campos vacíos, errores en pantalla).
3. **Logout**: `components/Layout.jsx` + `authSlice` (limpia el estado de todos los slices).
4. **Alta de movimiento según plan**: `pages/Movimientos.jsx` + `MovimientoFormulario.jsx` (el plan Gratuito permite 4 por mes).
5. **Listado, eliminar, editar en línea y filtros**: `MovimientoItem.jsx`, `FiltrosMovimientos.jsx`, `movimientosSlice.js`.
6. **Informe de uso y cambio de plan**: `UsoPlan.jsx` y `CambioPlan.jsx` (+ `pages/Planes.jsx`).
7. **Gráficos**: `Estadisticas.jsx`, `GraficoMensual.jsx`, `GraficoCategorias.jsx` (Recharts, carga diferida).
8. **Routing y estado global**: `App.jsx` (rutas públicas, privadas y por tipo de cuenta) y `store/`.

## Planes
Usuarios: **Gratuito** (4 movimientos por mes), **Referido Seguro** (USD 5, se activa al vincularse con un contador) y **Directo Premium** (USD 9).
Estudios: **Free Trial** (30 días), **Independiente** (USD 35), **Estudio Boutique** (USD 89) y **Estudio Escala** (USD 149). No se realizan cobros reales.

## Diseño
Marca en `public/brand/`. Hanken Grotesk para textos y Spline Sans Mono para cifras. Estilos de la app en `src/index.css`; la portada usa `src/styles/landing.css`.

## Calidad y robustez
- **Tests** (`npm test`, Vitest): estadísticas del gráfico, token JWT, nombres de planes, `authSlice` (logout y sesión vencida).
- **CI** (`.github/workflows/ci.yml`): en cada push corre lint, tests y build.
- **Sesión vencida**: si la API responde 401, se cierra la sesión y el login explica el motivo.
- **Pantallas de error**: página 404 y un `ErrorBoundary` que evita la pantalla en blanco.
- **Rendimiento**: pantallas con `React.lazy`; el gráfico (Recharts) se descarga solo al abrir el inicio. Lighthouse: accesibilidad 100, rendimiento 94–97, buenas prácticas 96, SEO 92.
- **Accesibilidad**: enlace "Saltar al contenido", etiquetas asociadas a cada campo, título distinto por pantalla, respeto de `prefers-reduced-motion`.
- **Comprobantes CFE**: la IA lee también el tipo (e-Ticket, e-Factura...). Además el navegador busca el código QR de la DGI (`jsqr`; en PDF, sobre la primera página dibujada con `pdf.js`) y completa RUT, serie/número y fecha; solo acepta QR que apunten a `dgi.gub.uy`. Si la IA falla, el QR igual completa esos datos.
- **Efectos de la portada** (`src/hooks/useEfectosLanding.js`): barra de progreso de lectura, aparición suave de las secciones (IntersectionObserver), brillo dorado que sigue al cursor y cotizaciones en cinta continua. Todo se desactiva con `prefers-reduced-motion`.
- **Apertura con el Palacio Salvo** (`components/landing/EscenaPalacio.jsx`, `hooks/useProgresoEscena.js`): la foto de la Plaza Independencia va en dos capas (la foto completa y una copia con el cielo transparente). El título queda entre ambas, así que el edificio lo tapa; al scrollear el edificio se queda fijo, el título sube y se desvanece y la plaza va anocheciendo hasta fundirse con el resto del sitio. La foto se usa con sus colores originales y se exporta en WebP de alta calidad en tres tamaños (1280, 1920 y 2880 px, `srcset`). El menú es transparente sobre la escena y se vuelve sólido al scrollear. Foto: agregar autor y licencia aquí si corresponde: ______.
