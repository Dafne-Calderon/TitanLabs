import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Cart() {
  const navigate = useNavigate();

  // Productos carrito
  const [carrito, setCarrito] = useState([]);

  // Carga carrito guardado
  useEffect(() => {
    const carritoGuardado =
      JSON.parse(localStorage.getItem("carrito")) || [];

    setCarrito(carritoGuardado);
  }, []);

  // Elimina producto
  const eliminarProducto = (index) => {
    const nuevoCarrito = carrito.filter(
      (_, i) => i !== index
    );

    setCarrito(nuevoCarrito);

    localStorage.setItem(
      "carrito",
      JSON.stringify(nuevoCarrito)
    );
  };

  // Calcula total
  const total = carrito.reduce(
    (acc, item) => acc + item.precio,
    0
  );

  return (
    <div className="cart-page">

            <header className="navbar">
            <div className="logo">
                TITAN<span>LABS</span>
            </div>

            <nav>
                <a href="/#inicio">INICIO</a>

                <a href="/#productos">PRODUCTOS</a>

                <a href="/ofertas">OFERTAS</a>

                <a href="/#nosotros">NOSOTROS</a>

                <a href="/#contacto">CONTACTO</a>
            </nav>

            <div className="acciones-navbar">
                <Link to="/">
                <button className="btn-login">
                    Volver
                </button>
                </Link>
            </div>
            </header>

      {/* Banner superior */}
      <section className="cart-banner">
        <div className="cart-banner-overlay">
          <p>🛒 TU CARRITO</p>

          <h1>REVISA TU COMPRA</h1>

          <span>
            Finaliza tu pedido de forma segura
          </span>
        </div>
      </section>

      {/* Productos */}
      <div className="cart-container">
        {carrito.length === 0 ? (
          <div className="cart-empty">
            <h2>Tu carrito está vacío</h2>

            <button onClick={() => navigate("/")}>
              Ir a comprar
            </button>
          </div>
        ) : (
          <>
            <div className="cart-list">
              {carrito.map((producto, index) => (
                <div
                  className="cart-card"
                  key={index}
                >
                  <img
                    src={producto.imagen}
                    alt={producto.nombre}
                  />

                  <div className="cart-info">
                    <h3>{producto.nombre}</h3>

                    <p>{producto.descripcion}</p>

                    <strong>
                      $
                      {producto.precio.toLocaleString(
                        "es-CL"
                      )}
                    </strong>
                  </div>

                  <button
                    className="cart-delete"
                    onClick={() =>
                      eliminarProducto(index)
                    }
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h2>Resumen</h2>

              <div className="cart-total">
                <span>Total</span>

                <strong>
                  ${total.toLocaleString("es-CL")}
                </strong>
              </div>

              <button
                className="cart-checkout"
                onClick={() =>
                  navigate("/checkout", {
                    state: { carrito, total },
                  })
                }
              >
                FINALIZAR COMPRA
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Cart;