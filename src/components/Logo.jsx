// Logo de la marca (mapa de Uruguay con la moneda + "finanfocus").
// "grande" usa la versión con todos los detalles de la moneda; la normal es la
// versión para tamaños chicos (menú, pie), que se lee mejor por debajo de 200 px.
const Logo = ({ grande = false, className = "" }) => (
  <img
    src={grande ? "/brand/finanfocus-logo-completo-sobre-oscuro.svg" : "/brand/finanfocus-logo-completo-sobre-oscuro-chico.svg"}
    alt="FinanFocus"
    className={`logo ${grande ? "logo-grande" : ""} ${className}`.trim()}
  />
);

export default Logo;
