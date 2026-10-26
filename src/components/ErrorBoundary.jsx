import { Component } from "react";

// Si un componente falla al dibujarse, se muestra un mensaje en vez de dejar la pantalla en blanco.
// (Los errores de las peticiones no llegan acá: los maneja cada slice y se muestran en su pantalla.)
class ErrorBoundary extends Component {
  state = { fallo: false };

  static getDerivedStateFromError() {
    return { fallo: true };
  }

  componentDidCatch(error, info) {
    console.error("Error de interfaz:", error, info.componentStack);
  }

  render() {
    if (!this.state.fallo) return this.props.children;
    return (
      <div className="auth-fondo">
        <div className="tarjeta auth-tarjeta" role="alert">
          <h1>Algo salió mal</h1>
          <p className="suave">Ocurrió un error inesperado en la pantalla. Tus datos están a salvo.</p>
          <button className="btn" onClick={() => window.location.assign("/")}>Volver al inicio</button>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
