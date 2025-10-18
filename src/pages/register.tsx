import "../styles/Register.scss";
import { useRegister } from "../hooks/useRegister";

export default function Register() {
  const {
    formData,
    handleChange,
    handleSubmit,
    togglePassword,
    toggleConfirmPassword,
    showPassword,
    showConfirmPassword,
  } = useRegister();

  return (
    <div className="container-register">
      <div className="form-container">
        <h1>¡Es hora de empezar!</h1>
        <p>Completa los campos y forma parte de nosotros.</p>
        <br />

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Nombres"
            value={formData.username}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="lastname"
            placeholder="Apellidos"
            value={formData.lastname}
            onChange={handleChange}
            required
          />

          <label>Fecha de Nacimiento</label>
          <input
            type="date"
            name="birthdate"
            value={formData.birthdate}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button type="button" onClick={togglePassword}>
              👁
            </button>
          </div>

          <div className="password-container">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirmar contraseña"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <button type="button" onClick={toggleConfirmPassword}>
              👁
            </button>
          </div>

          <button type="submit">¡Unirme ahora!</button>
        </form>

        <p>¿Ya tienes una cuenta? <a href="/">Ingreso</a></p>
      </div>
    </div>
  );
}
