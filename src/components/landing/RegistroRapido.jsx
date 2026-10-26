import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { IconoFlecha } from "./Iconos";

// Mismo patrón de email que el formulario de registro.
const PATRON_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Formulario de la portada: valida el email y lleva al registro con el email ya cargado.
const RegistroRapido = ({ id }) => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: { email: "" } });

  const onSubmit = ({ email }) => navigate("/registro", { state: { email: email.trim() } });

  return (
    <>
      <form id={id} className="signup" onSubmit={handleSubmit(onSubmit)} noValidate>
        <label htmlFor="email-portada" className="sr">Tu email</label>
        <input id="email-portada" type="email" placeholder="tu@email.com" autoComplete="email"
          aria-invalid={errors.email ? "true" : "false"}
          {...register("email", {
            required: "Escribí tu email para empezar",
            pattern: { value: PATRON_EMAIL, message: "Ese email no parece válido" },
          })} />
        <button type="submit" className="lbtn lbtn-gold">Crear cuenta gratis <IconoFlecha /></button>
      </form>
      {errors.email && <p className="signup-error" role="alert">{errors.email.message}</p>}
    </>
  );
};

export default RegistroRapido;
