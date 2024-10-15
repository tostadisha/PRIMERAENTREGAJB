import Router from "express";
import ProductManager from "../data/products.manager.js";

const router = Router();

const { getProduct, getProducts, createProduct, updateProduct, deleteProduct } =
  new ProductManager();

router.get("/api/products", async (req, res) => {
  try {
    const allProducts = await getProducts();
    res.setHeader("Content-type", "application/json");
    return res.status(200).send(allProducts);
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    return res.status(404).json({ error: error.message });
  }
});
router.get("/api/products/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const thisProduct = await getProduct(pid);
    if (thisProduct) {
      console.log(thisProduct);
      res.setHeader("Content-type", "application/json");
      return res.status(200).send(thisProduct);
    } else {
      console.log(thisProduct);
      res.setHeader("Content-Type", "application/json");
      return res.status(404).json({ error: `Su producto no se ha encontrado` });
    }
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    res.status(404).json({ message: error.message });
  }
});
router.post("/api/products/", async (req, res) => {
  try {
    const { body } = req;
    console.log(body);
    const response = await createProduct(body);
    if (response.error) {
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Content-Type", "application/json");
      return res.status(201).json({
        message: "Producto creado correctamente",
        data: response,
      });
    } else {
      res.send({ status: "success", data: response });
    }
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    res.status(400).json({ message: error.message });
  }
});
router.put("/api/products/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const { body } = req;
    const updatedProduct = body;
    const response = await updateProduct(pid, updatedProduct);
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({
      message: "Producto actualizado correctamente",
      data: response,
    });
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    return res.status(400).json({ error: error.message });
  }
});
router.delete("/api/products/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const response = await deleteProduct(pid);
    res.setHeader("Content-type", "application/json");
    return res
      .status(200)
      .send(
        `El producto que ha eliminado era: ${JSON.stringify(response, null, 2)}`
      );
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    return res.status(404).json({ error: error.message });
  }
});
export default router;
