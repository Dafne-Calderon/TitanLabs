import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import "./Admin.css";

function AdminOrders() {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    const cancelar = onSnapshot(collection(db, "pedidos"), (snapshot) => {
      const lista = snapshot.docs.map((documento) => ({
        id: documento.id,
        ...documento.data(),
      }));

      setPedidos(lista);
    });

    return () => cancelar();
  }, []);

  const cambiarEstadoPedido = async (id, estado) => {
    await updateDoc(doc(db, "pedidos", id), { estado });
    alert("Estado actualizado");
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1>Pedidos TitanLabs</h1>
          <p>Administra entregas, clientes y estados</p>
        </div>

        <Link to="/admin">
          <button className="btn-volver">⬅ Volver al admin</button>
        </Link>
      </div>

      <section className="admin-section">
        <h2>Pedidos recibidos</h2>

        {pedidos.length === 0 ? (
          <p className="admin-empty">Todavía no hay pedidos.</p>
        ) : (
          <div className="pedidos-admin-lista">
            {pedidos.map((pedido) => (
              <div className="pedido-editor-card" key={pedido.id}>
                <div className="pedido-info">
                  <h3>Pedido #{pedido.id.slice(0, 6)}</h3>
                  <p><strong>Cliente:</strong> {pedido.nombre || "Sin nombre"}</p>
                  <p><strong>Correo:</strong> {pedido.correo || "Sin correo"}</p>
                  <p><strong>Teléfono:</strong> {pedido.telefono || "No ingresado"}</p>
                  <p><strong>Dirección:</strong> {pedido.direccion || "No ingresada"}</p>
                  <p><strong>Total:</strong> ${pedido.total?.toLocaleString("es-CL")}</p>
                </div>

                <div className="pedido-estado">
                  <label>Estado del pedido</label>

                  <select
                    value={pedido.estado || "Pagado"}
                    onChange={(e) =>
                      cambiarEstadoPedido(pedido.id, e.target.value)
                    }
                  >
                    <option>Pagado</option>
                    <option>Preparando</option>
                    <option>Enviado</option>
                    <option>Entregado</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default AdminOrders;