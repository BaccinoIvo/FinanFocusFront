// Íconos de línea usados en la landing. Son decorativos (aria-hidden):
// el texto que los acompaña es el que describe la acción.
const base = { "aria-hidden": true, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" };

export const IconoFlecha = () => (
  <svg {...base} width="18" height="18" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);

export const IconoCheck = () => (
  <svg {...base} width="22" height="22" strokeWidth="1.8" stroke="#D9A45B"><path d="M4 12l5 5L20 6" /></svg>
);

export const IconoCruz = () => (
  <svg {...base} width="22" height="22" strokeWidth="1.8" stroke="#6E6A62"><path d="M6 6l12 12M18 6L6 18" /></svg>
);

export const IconoRecibo = () => (
  <svg {...base} width="18" height="18" strokeWidth="1.8" stroke="#D9A45B">
    <path d="M6 3h12v18l-3-2-3 2-3-2-3 2z" /><path d="M9 8h6M9 12h6" />
  </svg>
);

export const IconoMenu = () => (
  <svg {...base} width="20" height="20" strokeWidth="2"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
);

export const IconoCerrar = () => (
  <svg {...base} width="20" height="20" strokeWidth="2"><path d="M6 6l12 12M18 6L6 18" /></svg>
);

export const IconoLinkedin = () => (
  <svg {...base} width="16" height="16" strokeWidth="1.8">
    <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7" />
  </svg>
);

export const IconoGithub = () => (
  <svg {...base} width="16" height="16" strokeWidth="1.8">
    <path d="M9 19c-4 1.5-4-2-6-2.5M15 21v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1-.3-3.4 1.3a11.6 11.6 0 0 0-6 0C6.8 2.8 5.8 3.1 5.8 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4.4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />
  </svg>
);

// Grabado tipo billete del fondo del hero.
const ANGULOS = Array.from({ length: 24 }, (_, i) => i * 7.5);
export const Grabado = ({ className }) => (
  <svg aria-hidden="true" className={className} viewBox="0 0 800 800" fill="none" stroke="#1E1E1E" strokeWidth="0.9">
    <g transform="translate(400 400)">
      {ANGULOS.map((a) => <ellipse key={a} rx="360" ry="120" transform={`rotate(${a})`} />)}
      <circle r="128" stroke="#2E2618" /><circle r="122" stroke="#2E2618" /><circle r="60" stroke="#2E2618" />
    </g>
  </svg>
);

// Ondas del cierre de la página.
const ONDAS = [100, 115, 130, 145, 160];
const onda = (y) => `M0 ${y} Q 60 ${y - 60} 120 ${y} ` + Array.from({ length: 11 }, (_, i) => `T ${240 + i * 120} ${y}`).join(" ");
export const Ondas = ({ className }) => (
  <svg aria-hidden="true" className={className} viewBox="0 0 1440 200" preserveAspectRatio="none" fill="none" stroke="#2E2618" strokeWidth="1">
    {ONDAS.map((y) => <path key={y} d={onda(y)} />)}
  </svg>
);
