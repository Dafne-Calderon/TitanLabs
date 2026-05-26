import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import "./Admin.css";

function Admin() {
  // Listas de Firebase
  const [productos, setProductos] = useState([]);
  const [ofertas, setOfertas] = useState([]);

  // Formulario producto
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [imagen, setImagen] = useState("");

  // Formulario oferta
  const [nombreOferta, setNombreOferta] = useState("");
  const [descripcionOferta, setDescripcionOferta] = useState("");
  const [precioOferta, setPrecioOferta] = useState("");
  const [imagenOferta, setImagenOferta] = useState("");

  // Formulario banner principal
  const [bannerTitulo, setBannerTitulo] = useState("");
  const [bannerDescripcion, setBannerDescripcion] = useState("");
  const [bannerPrecio, setBannerPrecio] = useState("");
  const [bannerImagen, setBannerImagen] = useState("");

  // Carga productos, ofertas y banner
  useEffect(() => {
    // Escucha productos
    const cancelarProductos = onSnapshot(collection(db, "productos"), (snapshot) => {
      const lista = snapshot.docs.map((documento) => ({
        id: documento.id,
        ...documento.data(),
      }));

      setProductos(lista);
    });

    // Escucha ofertas
    const cancelarOfertas = onSnapshot(collection(db, "ofertas"), (snapshot) => {
      const lista = snapshot.docs.map((documento) => ({
        id: documento.id,
        ...documento.data(),
      }));

      setOfertas(lista);
    });

    // Carga datos actuales del banner
    const cargarBanner = async () => {
      const refBanner = doc(db, "configuracion", "bannerOferta");
      const infoBanner = await getDoc(refBanner);

      if (infoBanner.exists()) {
        const data = infoBanner.data();

        setBannerTitulo(data.titulo || "");
        setBannerDescripcion(data.descripcion || "");
        setBannerPrecio(data.precio || "");
        setBannerImagen(data.imagen || "");
      }
    };

    cargarBanner();

    // Limpia escuchas Firebase
    return () => {
      cancelarProductos();
      cancelarOfertas();
    };
  }, []);

  // Agrega producto nuevo
  const agregarProducto = async () => {
    if (!nombre || !descripcion || !precio || !imagen) {
      alert("Completa todos los datos del producto");
      return;
    }

    await addDoc(collection(db, "productos"), {
      nombre,
      descripcion,
      precio: Number(precio),
      imagen,
      creado: new Date(),
    });

    setNombre("");
    setDescripcion("");
    setPrecio("");
    setImagen("");

    alert("Producto agregado");
  };

  // Agrega oferta nueva
  const agregarOferta = async () => {
    if (!nombreOferta || !descripcionOferta || !precioOferta || !imagenOferta) {
      alert("Completa todos los datos de la oferta");
      return;
    }

    await addDoc(collection(db, "ofertas"), {
      nombre: nombreOferta,
      descripcion: descripcionOferta,
      precio: Number(precioOferta),
      imagen: imagenOferta,
      creado: new Date(),
    });

    setNombreOferta("");
    setDescripcionOferta("");
    setPrecioOferta("");
    setImagenOferta("");

    alert("Oferta agregada");
  };

  // Guarda cambios de producto
  const guardarProducto = async (producto) => {
    await updateDoc(doc(db, "productos", producto.id), {
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: Number(producto.precio),
      imagen: producto.imagen,
    });

    alert("Producto guardado");
  };

  // Guarda cambios de oferta
  const guardarOferta = async (oferta) => {
    await updateDoc(doc(db, "ofertas", oferta.id), {
      nombre: oferta.nombre,
      descripcion: oferta.descripcion,
      precio: Number(oferta.precio),
      imagen: oferta.imagen,
    });

    alert("Oferta guardada");
  };

  // Guarda banner principal
  const guardarBanner = async () => {
    if (!bannerTitulo || !bannerDescripcion || !bannerPrecio || !bannerImagen) {
      alert("Completa todos los datos del banner");
      return;
    }

    await setDoc(doc(db, "configuracion", "bannerOferta"), {
      titulo: bannerTitulo,
      descripcion: bannerDescripcion,
      precio: bannerPrecio,
      imagen: bannerImagen,
    });

    alert("Banner actualizado");
  };

  // Elimina producto
  const eliminarProducto = async (id) => {
    await deleteDoc(doc(db, "productos", id));
  };

  // Elimina oferta
  const eliminarOferta = async (id) => {
    await deleteDoc(doc(db, "ofertas", id));
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1>Panel Admin TitanLabs</h1>
          <p>Administra productos, ofertas, precios e imágenes</p>
        </div>

        <div className="admin-header-buttons">
          <Link to="/admin-pedidos">
            <button className="btn-volver">Ver pedidos</button>
          </Link>

          <Link to="/">
            <button className="btn-volver">⬅ Volver al inicio</button>
          </Link>
        </div>
      </div>

      <section className="admin-section">
        <h2>Agregar producto</h2>

        <div className="admin-form">
          <input
            type="text"
            placeholder="Nombre del producto"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />

          <input
            type="text"
            placeholder="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />

          <input
            type="number"
            placeholder="Precio"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
          />

          <input
            type="text"
            placeholder="URL de imagen"
            value={imagen}
            onChange={(e) => setImagen(e.target.value)}
          />

          <button onClick={agregarProducto}>+ Agregar producto</button>
        </div>
      </section>

      <section className="admin-section">
        <h2>Agregar oferta / pack</h2>

        <div className="admin-form">
          <input
            type="text"
            placeholder="Nombre de la oferta"
            value={nombreOferta}
            onChange={(e) => setNombreOferta(e.target.value)}
          />

          <input
            type="text"
            placeholder="Descripción"
            value={descripcionOferta}
            onChange={(e) => setDescripcionOferta(e.target.value)}
          />

          <input
            type="number"
            placeholder="Precio"
            value={precioOferta}
            onChange={(e) => setPrecioOferta(e.target.value)}
          />

          <input
            type="text"
            placeholder="URL de imagen"
            value={imagenOferta}
            onChange={(e) => setImagenOferta(e.target.value)}
          />

          <button onClick={agregarOferta}>+ Agregar oferta</button>
        </div>
      </section>

      <section className="admin-section">
        <h2>Editar banner principal de ofertas</h2>

        <div className="admin-form">
          <input
            type="text"
            placeholder="Título del banner"
            value={bannerTitulo}
            onChange={(e) => setBannerTitulo(e.target.value)}
          />

          <input
            type="text"
            placeholder="Descripción del banner"
            value={bannerDescripcion}
            onChange={(e) => setBannerDescripcion(e.target.value)}
          />

          <input
            type="text"
            placeholder="Precio del banner"
            value={bannerPrecio}
            onChange={(e) => setBannerPrecio(e.target.value)}
          />

          <input
            type="text"
            placeholder="URL imagen de fondo"
            value={bannerImagen}
            onChange={(e) => setBannerImagen(e.target.value)}
          />

          <button onClick={guardarBanner}>Guardar banner</button>
        </div>
      </section>

      <section className="admin-section editar-productos-section">
        <h2>Editar productos</h2>

        {productos.length === 0 ? (
          <p className="admin-empty">Todavía no hay productos agregados.</p>
        ) : (
          <div className="productos-admin-lista">
            {productos.map((producto) => (
              <div className="producto-editor-card" key={producto.id}>
                <div className="producto-editor-img">
                  <img src={producto.imagen} alt={producto.nombre} />
                </div>

                <div className="producto-editor-form">
                  <div className="campo-admin">
                    <label>Nombre del producto</label>
                    <input
                      defaultValue={producto.nombre}
                      onChange={(e) => (producto.nombre = e.target.value)}
                    />
                  </div>

                  <div className="campo-admin">
                    <label>Precio</label>
                    <input
                      type="number"
                      defaultValue={producto.precio}
                      onChange={(e) => (producto.precio = e.target.value)}
                    />
                  </div>

                  <div className="campo-admin campo-descripcion">
                    <label>Descripción</label>
                    <textarea
                      defaultValue={producto.descripcion}
                      onChange={(e) => (producto.descripcion = e.target.value)}
                    />
                  </div>

                  <div className="campo-admin">
                    <label>URL de imagen</label>
                    <input
                      defaultValue={producto.imagen}
                      onChange={(e) => (producto.imagen = e.target.value)}
                    />
                  </div>

                  <div className="acciones-producto">
                    <button
                      className="btn-guardar"
                      onClick={() => guardarProducto(producto)}
                    >
                      Guardar cambios
                    </button>

                    <button
                      className="btn-eliminar"
                      onClick={() => eliminarProducto(producto.id)}
                    >
                      Eliminar producto
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="admin-section editar-productos-section">
        <h2>Editar ofertas</h2>

        {ofertas.length === 0 ? (
          <p className="admin-empty">Todavía no hay ofertas agregadas.</p>
        ) : (
          <div className="productos-admin-lista">
            {ofertas.map((oferta) => (
              <div className="producto-editor-card" key={oferta.id}>
                <div className="producto-editor-img">
                  <img src={oferta.imagen} alt={oferta.nombre} />
                </div>

                <div className="producto-editor-form">
                  <div className="campo-admin">
                    <label>Nombre de la oferta</label>
                    <input
                      defaultValue={oferta.nombre}
                      onChange={(e) => (oferta.nombre = e.target.value)}
                    />
                  </div>

                  <div className="campo-admin">
                    <label>Precio</label>
                    <input
                      type="number"
                      defaultValue={oferta.precio}
                      onChange={(e) => (oferta.precio = e.target.value)}
                    />
                  </div>

                  <div className="campo-admin campo-descripcion">
                    <label>Descripción</label>
                    <textarea
                      defaultValue={oferta.descripcion}
                      onChange={(e) => (oferta.descripcion = e.target.value)}
                    />
                  </div>

                  <div className="campo-admin">
                    <label>URL de imagen</label>
                    <input
                      defaultValue={oferta.imagen}
                      onChange={(e) => (oferta.imagen = e.target.value)}
                    />
                  </div>

                  <div className="acciones-producto">
                    <button
                      className="btn-guardar"
                      onClick={() => guardarOferta(oferta)}
                    >
                      Guardar cambios
                    </button>

                    <button
                      className="btn-eliminar"
                      onClick={() => eliminarOferta(oferta.id)}
                    >
                      Eliminar oferta
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Admin;