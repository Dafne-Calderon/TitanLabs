import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

function Login() {
  const navigate = useNavigate();

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");

  const iniciarSesion = async (e) => {
    e.preventDefault();

    if (!correo || !password) {
      alert("Ingresa correo y contraseña");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, correo, password);
      alert("Sesión iniciada correctamente");
      navigate("/");
    } catch (error) {
      alert("Correo o contraseña incorrectos");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          TITAN<span>LABS</span>
        </div>

        <h1>Iniciar sesión</h1>
        <p>Ingresa a tu cuenta para ver tus compras y seguimiento.</p>

        <form onSubmit={iniciarSesion} className="auth-form">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Ingresar</button>
        </form>

        <div className="auth-links">
          <Link to="/registro">Crear cuenta</Link>
          <Link to="/">Volver al inicio</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;