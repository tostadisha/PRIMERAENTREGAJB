import express from "express";
import productsRouter from "../routes/products.router.js";
import cartRouter from "../routes/carts.router.js";
const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.listen(PORT, () => {
  console.log("escuchando en el puerto: ", PORT);
});
app.use(productsRouter);
app.use(cartRouter);
