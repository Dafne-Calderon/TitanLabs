import "./App.css";
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Offers from "./pages/Offers";
import AdminOrders from "./pages/AdminOrders";

import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, onSnapshot, doc, getDoc } from "firebase/firestore";

import { auth } from "./firebase";
import { db } from "./firebase";

function Home() {
  const navigate = useNavigate();

  // Productos desde Firebase
  const [productos, setProductos] = useState([]);

  // Carrito
  const [carrito, setCarrito] = useState([]);
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const [mensaje, setMensaje] = useState("");

  // Usuario
  const [usuario, setUsuario] = useState(null);
  const [datosUsuario, setDatosUsuario] = useState(null);

  // Banner editable desde admin
  const [bannerOferta, setBannerOferta] = useState(null);

  // Carga carrito guardado
  useEffect(() => {
    const carritoGuardado = JSON.parse(localStorage.getItem("carrito")) || [];
    setCarrito(carritoGuardado);
  }, []);

  // Escucha usuario, productos y banner
  useEffect(() => {
    // Detecta sesión iniciada
    const cancelarUsuario = onAuthStateChanged(auth, async (user) => {
      setUsuario(user);

      if (user) {
        const refUsuario = doc(db, "usuarios", user.uid);
        const infoUsuario = await getDoc(refUsuario);

        if (infoUsuario.exists()) {
          setDatosUsuario(infoUsuario.data());
        }
      } else {
        setDatosUsuario(null);
      }
    });

    // Carga productos
    const cancelarProductos = onSnapshot(collection(db, "productos"), (snapshot) => {
      const lista = snapshot.docs.map((documento) => ({
        id: documento.id,
        ...documento.data(),
      }));

      setProductos(lista);
    });

    // Carga banner editable
    const cancelarBanner = onSnapshot(
      doc(db, "configuracion", "bannerOferta"),
      (documento) => {
        if (documento.exists()) {
          setBannerOferta(documento.data());
        }
      }
    );

    return () => {
      cancelarUsuario();
      cancelarProductos();
      cancelarBanner();
    };
  }, []);

  // Baja a sección cuando viene desde /#productos, /#contacto, etc.
  useEffect(() => {
    const hash = window.location.hash;

    if (hash) {
      setTimeout(() => {
        const elemento = document.querySelector(hash);

        if (elemento) {
          elemento.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 300);
    }
  }, []);

  // Agrega producto al carrito
  const agregarAlCarrito = (producto) => {
    const nuevoCarrito = [...carrito, producto];

    setCarrito(nuevoCarrito);
    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));

    setMensaje(`${producto.nombre} agregado al carrito`);
    setCarritoAbierto(true);

    setTimeout(() => {
      setMensaje("");
    }, 2500);
  };

  // Elimina producto del carrito
  const eliminarProducto = (index) => {
    const nuevoCarrito = carrito.filter((_, i) => i !== index);

    setCarrito(nuevoCarrito);
    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
  };

  // Cierra sesión
  const cerrarSesion = async () => {
    await signOut(auth);
    alert("Sesión cerrada");
  };

  // Calcula total carrito
  const total = carrito.reduce((acc, item) => acc + item.precio, 0);

  return (
    <div className="app">
      <div className="topbar">
        🚀 ENVÍOS GRATIS EN COMPRAS SOBRE $49.990
      </div>

      <header className="navbar">
        <div className="logo">
          TITAN<span>LABS</span>
        </div>

        <nav>
          <a href="#inicio">INICIO</a>
          <a href="#productos">PRODUCTOS</a>
          <Link to="/ofertas">OFERTAS</Link>
          <a href="#nosotros">NOSOTROS</a>
          <a href="#contacto">CONTACTO</a>
        </nav>

        <div className="acciones-navbar">
          {usuario ? (
            <>
              <span className="usuario-texto">
                Hola, {datosUsuario?.nombre || usuario.email}
              </span>
            <Link to="/mis-compras">
              <button className="btn-login">
               Mis compras
              </button>
            </Link>
              <button className="btn-login" onClick={cerrarSesion}>
                Salir
              </button>

              {datosUsuario?.tipo === "admin" && (
                <Link to="/admin">
                  <button className="btn-login">Admin</button>
                </Link>
              )}
            </>
          ) : (
            <>
              <Link to="/login">
                <button className="btn-login">Ingresar</button>
              </Link>

              <Link to="/registro">
                <button className="btn-login">Registro</button>
              </Link>
            </>
          )}

          <div
            className="carrito-icono"
            onClick={() => setCarritoAbierto(!carritoAbierto)}
          >
            🛒
            <span>{carrito.length}</span>
          </div>
        </div>
      </header>

      {carritoAbierto && (
        <div className="dropdown-carrito">
          <div className="carrito-header">
            <h3>TU CARRITO</h3>
            <button onClick={() => setCarritoAbierto(false)}>×</button>
          </div>

          {mensaje && <div className="mensaje-carrito">{mensaje}</div>}

          {carrito.length === 0 ? (
            <p className="carrito-vacio">Agrega un producto al carrito 🛒</p>
          ) : (
            <>
              {carrito.map((item, index) => (
                <div className="item-dropdown" key={index}>
                  <img src={item.imagen} alt={item.nombre} />

                  <div>
                    <h4>{item.nombre}</h4>
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
                    className="btn-pagar-dropdown"
                    onClick={() => navigate("/carrito")}
                  >
                    IR AL CARRITO
                </button>
              <button
                className="btn-finalizar"
                onClick={() => navigate("/checkout", { state: { carrito, total } })}
              >
                FINALIZAR COMPRA
              </button>
            </>
          )}
        </div>
      )}

      <main className="layout-principal">
        <section id="inicio" className="hero">
          <div className="hero-text">
            <p className="subtitulo">+ SUPERA TUS LÍMITES</p>

            <h1>
              TU MEJOR VERSIÓN
              <span>COMIENZA AQUÍ</span>
            </h1>

            <p>
              Suplementos de alta calidad para atletas que buscan rendimiento,
              fuerza y resultados reales.
            </p>

            <div className="botones">
              <button onClick={() => document.querySelector("#productos")?.scrollIntoView({ behavior: "smooth" })}>
                VER PRODUCTOS
              </button>

              <button className="secundario" onClick={() => navigate("/ofertas")}>
                OFERTAS DEL MES
              </button>
            </div>
          </div>
        </section>

        <section className="beneficios">
          <div>
            🚚 <strong>ENVÍOS RÁPIDOS</strong>
            <p>A todo Chile en 24/48hrs</p>
          </div>

          <div>
            🛡️ <strong>PAGOS SEGUROS</strong>
            <p>Con Mercado Pago</p>
          </div>

          <div>
            🏅 <strong>PRODUCTOS ORIGINALES</strong>
            <p>Calidad garantizada</p>
          </div>

          <div>
            🎧 <strong>ATENCIÓN 24/7</strong>
            <p>Estamos para ayudarte</p>
          </div>
        </section>

        <section
          className="ofertas"
          id="ofertas"
          style={{
            background: bannerOferta?.imagen
              ? `linear-gradient(to right, rgba(255,255,255,0.92), rgba(230,248,255,0.72)), url(${bannerOferta.imagen})`
              : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="oferta-texto">
            <p>OFERTA ESPECIAL</p>

            <h2>{bannerOferta?.titulo || "PACK TITAN POWER"}</h2>

            <span>
              {bannerOferta?.descripcion || "Whey Protein + Creatina + Pre Workout"}
            </span>

            <h3>{bannerOferta?.precio || "$89.990"}</h3>

            <button onClick={() => navigate("/ofertas")}>
              Ver más ofertas
            </button>
          </div>
        </section>

        <section id="productos" className="productos">
          <h2>
            PRODUCTOS <span>DESTACADOS</span>
          </h2>

          <div className="grid-productos">
            {productos.map((producto) => (
              <div className="card" key={producto.id}>
                <img src={producto.imagen} alt={producto.nombre} />

                <h3>{producto.nombre}</h3>
                <p>{producto.descripcion}</p>

                <div className="estrellas">
                  ★★★★★ <small>(128)</small>
                </div>

                <strong>${producto.precio.toLocaleString("es-CL")}</strong>

                <button onClick={() => agregarAlCarrito(producto)}>🛒</button>
              </div>
            ))}
          </div>
        </section>

        <section id="nosotros" className="nosotros">
          <div className="nosotros-box">
            <h2>NOSOTROS</h2>

            <p>
              En TitanLabs trabajamos con suplementos deportivos de alta calidad
              para ayudarte a mejorar tu rendimiento, fuerza y recuperación.
            </p>

            <p>
              Nuestro objetivo es entregar productos originales, seguros y con
              resultados reales para deportistas de todo Chile.
            </p>
          </div>
        </section>

        <footer id="contacto" className="footer">
          <div className="footer-box">
            <h2>CONTACTO</h2>

            <div className="footer-contactos">
              <a
                href="https://maps.google.com/?q=Santiago+Chile"
                target="_blank"
                rel="noreferrer"
                className="contacto-btn"
              >
                📍 Santiago, Chile
              </a>

              <a
                href="https://wa.me/56957505995"
                target="_blank"
                rel="noreferrer"
                className="contacto-btn"
              >
                📞 +56 9 5750 5995
              </a>

              <a href="mailto:contacto@titanlabs.cl" className="contacto-btn">
                📧 contacto@titanlabs.cl
              </a>
            </div>

            {/* Banner redes para usar después
            <div className="footer-redes">
              <span>Instagram</span>
              <span>Facebook</span>
              <span>TikTok</span>
            </div>
            */}
          </div>
        </footer>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/carrito" element={<Cart />} />
        <Route path="/mis-compras" element={<Orders />} />
        <Route path="/ofertas" element={<Offers />} />
        <Route path="/admin-pedidos" element={<AdminOrders />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;