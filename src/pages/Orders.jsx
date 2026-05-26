import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, onSnapshot } from "firebase/firestore";
import { db, auth } from "../firebase";

function Orders() {
  const [pedidos, setPedidos] = useState([]);

  // Carga todos los pedidos
  useEffect(() => {
    const cancelar = onSnapshot(collection(db, "pedidos"), (snapshot) => {
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPedidos(lista);
    });

    return () => cancelar();
  }, []);

  // Filtra solo compras del usuario actual
  const pedidosUsuario = pedidos.filter((pedido) => {
    if (!auth.currentUser) return false;
    return pedido.correo === auth.currentUser.email;
  });

  return (
    <div className="mis-compras-page">
      <div className="mis-compras-header">
        <h1>Mis compras</h1>
        <p>Revisa el estado y detalle de tus pedidos</p>
      </div>

      {pedidosUsuario.length === 0 ? (
        <div className="compra-card">
          <p>No tienes compras registradas.</p>
        </div>
      ) : (
        <div className="mis-compras-lista">
          {pedidosUsuario.map((pedido) => (
            <div className="compra-card" key={pedido.id}>
              <div className="compra-top">
                <div>
                  <h2>Pedido #{pedido.id.slice(0, 6)}</h2>
                  <p className="compra-total">
                    Total: ${pedido.total?.toLocaleString("es-CL")}
                  </p>
                </div>

                <div className={`estado-badge ${pedido.estado?.toLowerCase()}`}>
                  {pedido.estado || "Pagado"}
                </div>
              </div>

              <div className="productos-pedido">
                {pedido.productos?.map((producto, index) => (
                  <div className="producto-pedido-card" key={index}>
                    <img src={producto.imagen} alt={producto.nombre} />

                    <div>
                      <h3>{producto.nombre}</h3>
                      <p>{producto.descripcion}</p>
                      <strong>
                        ${producto.precio?.toLocaleString("es-CL")}
                      </strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <Link to="/">
        <button className="btn-volver-compras">Volver al inicio</button>
      </Link>
    </div>
  );
}

export default Orders;