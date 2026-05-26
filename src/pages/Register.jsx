import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

function Register() {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");

  const registrarUsuario = async (e) => {
    e.preventDefault();

    if (!nombre || !telefono || !direccion || !correo || !password) {
      alert("Completa todos los campos");
      return;
    }

    try {
      const respuesta = await createUserWithEmailAndPassword(
        auth,
        correo,
        password
      );

      await setDoc(doc(db, "usuarios", respuesta.user.uid), {
        nombre,
        telefono,
        direccion,
        correo,
        tipo: "cliente",
        creado: new Date(),
      });

      alert("Cuenta creada correctamente");
      navigate("/");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        alert("Ese correo ya está registrado. Inicia sesión.");
      } else {
        alert("Error al crear cuenta");
      }
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card register-card">
        <div className="auth-logo">
          TITAN<span>LABS</span>
        </div>

        <h1>Crear cuenta</h1>
        <p>Regístrate para comprar y revisar el estado de tus pedidos.</p>

        <form onSubmit={registrarUsuario} className="auth-form">
          <input
            type="text"
            placeholder="Nombre completo"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />

          <input
            type="text"
            placeholder="Teléfono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />

          <input
            type="text"
            placeholder="Dirección de despacho"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
          />

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

          <button type="submit">Crear cuenta</button>
        </form>

        <div className="auth-links">
          <Link to="/login">Ya tengo cuenta</Link>
          <Link to="/">Volver al inicio</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;