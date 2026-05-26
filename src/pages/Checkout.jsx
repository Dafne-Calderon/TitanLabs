import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "../firebase";

function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();

  // Recibe carrito y total desde la página anterior
  const carrito = location.state?.carrito || [];
  const total = location.state?.total || 0;

  // Datos para compra como invitado
  const [correoInvitado, setCorreoInvitado] = useState("");
  const [nombreInvitado, setNombreInvitado] = useState("");
  const [telefonoInvitado, setTelefonoInvitado] = useState("");
  const [direccionInvitado, setDireccionInvitado] = useState("");

  // Evita doble compra al apretar dos veces
  const [procesandoPago, setProcesandoPago] = useState(false);

  // Guarda el pedido en Firebase
  const finalizarCompra = async () => {
    if (procesandoPago) return;

    if (carrito.length === 0) {
      alert("Tu carrito está vacío");
      return;
    }

    const usuario = auth.currentUser;

    if (!usuario) {
      if (!nombreInvitado || !correoInvitado || !telefonoInvitado || !direccionInvitado) {
        alert("Completa todos los datos para la entrega");
        return;
      }
    }

    try {
      setProcesandoPago(true);

      await addDoc(collection(db, "pedidos"), {
        usuarioId: usuario ? usuario.uid : "invitado",
        correo: usuario ? usuario.email : correoInvitado,
        nombre: usuario ? usuario.email : nombreInvitado,
        telefono: telefonoInvitado,
        direccion: direccionInvitado,
        productos: carrito,
        total,
        estado: "Pagado",
        fecha: new Date(),
      });

      // Vacía carrito guardado
      localStorage.removeItem("carrito");

      alert("Compra registrada correctamente");

      navigate("/mis-compras");
    } catch (error) {
      console.log(error);
      alert("Error al crear pedido");
      setProcesandoPago(false);
    }
  };

  return (
    <div className="auth-container checkout-container">
      <h2>Finalizar compra</h2>

      {auth.currentUser ? (
        <>
          <p>Comprarás con tu cuenta: {auth.currentUser.email}</p>

          <input
            type="text"
            placeholder="Teléfono de contacto"
            value={telefonoInvitado}
            onChange={(e) => setTelefonoInvitado(e.target.value)}
          />

          <input
            type="text"
            placeholder="Dirección de despacho"
            value={direccionInvitado}
            onChange={(e) => setDireccionInvitado(e.target.value)}
          />
        </>
      ) : (
        <>
          <p>Compra como invitado</p>

          <input
            type="text"
            placeholder="Nombre"
            value={nombreInvitado}
            onChange={(e) => setNombreInvitado(e.target.value)}
          />

          <input
            type="email"
            placeholder="Correo para enviar boleta"
            value={correoInvitado}
            onChange={(e) => setCorreoInvitado(e.target.value)}
          />

          <input
            type="text"
            placeholder="Teléfono"
            value={telefonoInvitado}
            onChange={(e) => setTelefonoInvitado(e.target.value)}
          />

          <input
            type="text"
            placeholder="Dirección de despacho"
            value={direccionInvitado}
            onChange={(e) => setDireccionInvitado(e.target.value)}
          />
        </>
      )}

      <h3>Total: ${total.toLocaleString("es-CL")}</h3>

      <button onClick={finalizarCompra} disabled={procesandoPago}>
        {procesandoPago ? "Procesando compra..." : "Confirmar compra"}
      </button>

      <Link to="/">
        <button disabled={procesandoPago}>Volver al inicio</button>
      </Link>
    </div>
  );
}

export default Checkout;