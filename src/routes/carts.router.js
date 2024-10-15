import Router from "express";
import CartManager from "../data/carts.manager.js";

const router = Router();

const { createCart, getCartById, createProductToCart } = new CartManager();

router.post("/api/carts", async (req, res) => {
  try {
    const cartCreated = await createCart();
    res.setHeader("Content-type", "application/json");
    return res.status(201).send(cartCreated);
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    return res.status(400).json({ error: error.message });
  }
});
router.get("/api/carts/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await getCartById(cid);
    res.setHeader("Content-type", "application/json");
    console.log("Entró en el 200");
    return res.status(200).send(cart);
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    return res.status(400).json({ error: error.message });
  }
});
router.post("/api/carts/:cid/products/:pid", async (req, res) => {
  try {
    const { cid } = req.params;
    const { pid } = req.params;
    const createdProduct = await createProductToCart(pid, cid);
    res.setHeader("Content-type", "application/json");
    return res.status(200).json({
      message: `Producto agregado al carrito ${cid} correctamente`,
      data: createdProduct,
    });
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    return res.status(400).json({ error: error.message });
  }
});
export default router;
