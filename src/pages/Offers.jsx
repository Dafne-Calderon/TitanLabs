import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

function Offers() {
  const navigate = useNavigate();

  const [ofertas, setOfertas] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [carritoAbierto, setCarritoAbierto] = useState(false);

  useEffect(() => {
    const carritoGuardado = JSON.parse(localStorage.getItem("carrito")) || [];
    setCarrito(carritoGuardado);

    const cancelarOfertas = onSnapshot(collection(db, "ofertas"), (snapshot) => {
      const lista = snapshot.docs.map((documento) => ({
        id: documento.id,
        ...documento.data(),
      }));

      setOfertas(lista);
    });

    return () => cancelarOfertas();
  }, []);

  const total = carrito.reduce((acc, item) => acc + item.precio, 0);

  const agregarOferta = (oferta) => {
    const nuevoCarrito = [...carrito, oferta];

    setCarrito(nuevoCarrito);
    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
    setCarritoAbierto(true);
  };

  const eliminarProducto = (index) => {
    const nuevoCarrito = carrito.filter((_, i) => i !== index);

    setCarrito(nuevoCarrito);
    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
  };

  return (
    <div className="ofertas-page">
      <header className="navbar">
        <div className="logo">
          TITAN<span>LABS</span>
        </div>

        <nav>
          <a href="/">INICIO</a>
          <a href="/#productos">PRODUCTOS</a>
          <a href="/ofertas">OFERTAS</a>
          <a href="/#nosotros">NOSOTROS</a>
          <a href="/#contacto">CONTACTO</a>
        </nav>

        <div className="acciones-navbar">
          <Link to="/">
            <button className="btn-login">Volver</button>
          </Link>
        </div>
      </header>

      <div className="carrito-flotante-ofertas">
        <div
          className="carrito-icono"
          onClick={() => setCarritoAbierto(!carritoAbierto)}
        >
          🛒
          <span>{carrito.length}</span>
        </div>

        {carritoAbierto && (
          <div className="dropdown-carrito">
            <div className="carrito-header">
              <h3>TU CARRITO</h3>
              <button onClick={() => setCarritoAbierto(false)}>×</button>
            </div>

            {carrito.length === 0 ? (
              <p className="carrito-vacio">Tu carrito está vacío 🛒</p>
            ) : (
              <>
                {carrito.map((item, index) => (
                  <div className="item-dropdown" key={index}>
                    <img src={item.imagen} alt={item.nombre} />

                    <div>
                      <h4>{item.nombre}</h4>
                      <p>{item.descripcion}</p>
                      <strong>${item.precio.toLocaleString("es-CL")}</strong>
                    </div>

                    <button onClick={() => eliminarProducto(index)}>🗑️</button>
                  </div>
                ))}

                <div className="subtotal">
                  <span>SUBTOTAL</span>
                  <strong>${total.toLocaleString("es-CL")}</strong>
                </div>

                <button
                  className="btn-finalizar"
                  onClick={() =>
                    navigate("/checkout", { state: { carrito, total } })
                  }
                >
                  FINALIZAR COMPRA
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <div className="ofertas-header">
        <h1>Ofertas TitanLabs</h1>
      </div>

      {ofertas.length === 0 ? (
        <div className="compra-card">
          <p>No hay ofertas disponibles por ahora.</p>
        </div>
      ) : (
        <div className="ofertas-grid">
          {ofertas.map((oferta) => (
            <div className="oferta-card" key={oferta.id}>
              <img src={oferta.imagen} alt={oferta.nombre} />

              <h3>{oferta.nombre}</h3>
              <p>{oferta.descripcion}</p>

              <strong>${oferta.precio.toLocaleString("es-CL")}</strong>

              <button onClick={() => agregarOferta(oferta)}>
                🛒 Comprar oferta
              </button>
            </div>
          ))}
        </div>
      )}

      <Link to="/">
        <button className="btn-volver-ofertas">Volver al inicio</button>
      </Link>
    </div>
  );
}

export default Offers;