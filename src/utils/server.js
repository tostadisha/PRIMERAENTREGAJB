import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import productsRouter from "../routes/products.router.js";
import cartRouter from "../routes/carts.router.js";
import viewsRouter from "../routes/views.router.js";
import ProductManager from "../data/products.manager.js";
import path from "path";
import { fileURLToPath } from "url";

const productManager = new ProductManager();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8080;
const httpServer = app.listen(PORT, () => {
  console.log("escuchando en el puerto: ", PORT);
});
const io = new Server(httpServer);

io.on("connection", (socket) => {
  console.log("Un usuario se ha conectado");

  (async () => {
    try {
      const products = await productManager.getProducts();
      console.log("Productos enviados al cliente:", products);
      socket.emit("actualizarProductos", products);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  })();

  socket.on("nuevoProducto", async (producto) => {
    console.log("Nuevo producto recibido:", producto);
    try {
      const result = await productManager.createProduct(producto);
      console.log(result);
      if (result.error) {
        console.log("Error al crear producto:", result.error);
        socket.emit("errorProducto", result.error);
      } else {
        const products = await productManager.getProducts();
        console.log(
          "Productos actualizados enviados a todos los clientes:",
          products
        );
        io.emit("actualizarProductos", products);
      }
    } catch (error) {
      console.log("Error general:", error.message);
      socket.emit("errorProducto", error.message);
    }
  });

  socket.on("borrarProducto", async (idProducto) => {
    try {
      await productManager.deleteProduct(idProducto);
      const products = await productManager.getProducts();
      io.emit("actualizarProductos", products);
    } catch (error) {
      console.error("Error al borrar producto:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("Un usuario se ha desconectado");
  });
});

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de handlebars
app.use(express.static(path.join(__dirname, "public")));
app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "handlebars");

// Routers
app.use("/", viewsRouter);
app.use(productsRouter);
app.use(cartRouter);
