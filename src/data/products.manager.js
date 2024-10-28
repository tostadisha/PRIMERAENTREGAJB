import fs from "fs";
import { type } from "os";
import path from "path"; // Importar path

class ProductManager {
  constructor() {
    this.path = path.resolve("./dbjson/productsDb.json");
  }

  readProducts = async () => {
    try {
      if (fs.existsSync(this.path)) {
        const data = await fs.promises.readFile(this.path, "utf-8");
        const products = JSON.parse(data);
        return products;
      } else {
        return []; // Devuelve un array vacío si no existe el archivo
      }
    } catch (error) {
      throw error;
    }
  };
  getProducts = async () => {
    try {
      //Me traigo los productos y los muestro
      const products = await this.readProducts();
      return products;
    } catch (error) {
      throw error;
    }
  };
  getProduct = async (productId) => {
    try {
      // Me traigo los productos
      const products = await this.readProducts();
      // ¿Existe el producto?
      const searchedProduct = products.find(
        (product) => product.id === Number(productId)
      );
      if (searchedProduct) {
        return searchedProduct;
      } else if (searchedProduct == undefined) {
        return `Su producto no fue encontrado, por lo que tiene valor ${searchedProduct}`;
      }
    } catch (error) {
      throw error;
    }
  };
  createProduct = async (newProduct) => {
    try {
      // Me traigo los productos
      const products = await this.getProducts();

      // Reviso si el producto ya existe
      const duplicated = products.find((e) => e.title === newProduct.title);
      if (duplicated) {
        throw new Error(
          `El producto que usted ha ingresado ya existe dentro de la lista`
        );
      }

      // Reviso que me haya dado los tipos de datos correctos
      if (typeof newProduct.title != "string" || newProduct.title == "") {
        throw new Error(
          "Verifique el título. No debe llegar ni vacío ni con otro tipo de dato que no sea de tipo texto."
        );
      } else if (
        typeof newProduct.description != "string" ||
        newProduct.description == ""
      ) {
        throw new Error(
          `Verifique la descripción. No debe de llegar ni vacía ni con otro tipo de dato que no sea de tipo texto.`
        );
      } else if (typeof newProduct.stock != "number") {
        throw new Error(
          `Verifique el stock.No debe de llegar con otro tipo de dato que no sea de tipo número.`
        );
      } else if (
        typeof newProduct.category != "string" ||
        newProduct.category == ""
      ) {
        throw new Error(
          `Verifique la categoría. No debe de llegar ni vacía ni con otro tipo de dato que no sea de tipo texto.`
        );
      } else if (
        typeof newProduct.status === "number" ||
        typeof newProduct.status === "string"
      ) {
        throw new Error(
          `Verifique el status, tiene que ser en valores booleanos. Puede ir vacío también.`
        );
      }

      // Ahora verifico las IDS, no se deben repetir.
      if (products.length === 0) {
        newProduct.id = 1;
      } else {
        newProduct.id = products[products.length - 1].id + 1;
      }
      // Y verifico que no exista el status ya en el body
      if (newProduct.status !== false && newProduct.status !== true) {
        newProduct.status = true;
      }
      newProduct.code = crypto.randomUUID();

      // Por último lo pusheo al array y ese array irá al archivo correspondiente.
      products.push(newProduct);
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(products, null, "\t")
      );
      return "Su producto se ha creado";
    } catch (error) {
      throw error;
    }
  };

  updateProduct = async (PId, changedProduct) => {
    try {
      // Me traigo los productos
      const products = await this.getProducts();
      // Antes de nada verifico el ID y si me dió algún producto.
      if (isNaN(Number(PId))) {
        throw new Error(`Porfavor, el ID tiene que ser un número.`);
      }
      if (!changedProduct) {
        throw new Error(`No se ha proporcionado un producto a modificar`);
      }
      // Saco el INDEX de el producto a revisar para poder hacer validacionesh
      const productToChangeIndex = products.findIndex(
        (e) => e.id === Number(PId)
      );
      let productToUpdate = products[productToChangeIndex];
      if (productToChangeIndex == -1) {
        throw new Error(`El producto no se encuentra en el listado`);
      }
      if (changedProduct.description) {
        productToUpdate.description = changedProduct.description;
      }
      if (changedProduct.title) {
        let titleDuplicated = products.some(
          (product) => product.title === changedProduct.title
        );
        if (titleDuplicated) {
          throw new Error(
            `El título que usted ha ingresado ya existe dentro de la lista`
          );
        } else {
          productToUpdate.title = changedProduct.title;
        }
      }
      if (changedProduct.price && typeof changedProduct.price === "number") {
        productToUpdate.price = changedProduct.price;
      }
      if (changedProduct.stock && typeof changedProduct.stock === "number") {
        productToUpdate.stock = changedProduct.stock;
      }
      products[productToChangeIndex] = productToUpdate;
      // Actualizo el array de productos
      products[productToChangeIndex] = productToUpdate;

      // Guardo el array actualizado en el archivo
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(products, null, "\t")
      );

      return productToUpdate;
    } catch (error) {
      throw error;
    }
  };
  deleteProduct = async (PId) => {
    try {
      // Me traigo los productos
      const products = await this.getProducts();
      // Verifico el ID
      if (Number(PId) === NaN) {
        throw new Error(`Porfavor, el ID tiene que ser un número.`);
      }
      // Luego saco su Index para borrarlo del array.
      const productToDeleteIndex = products.findIndex(
        (e) => e.id === Number(PId)
      );
      if (productToDeleteIndex == -1) {
        throw new Error(`Su producto no se ha encontrado`);
      }
      products.splice(productToDeleteIndex, 1);
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(products, null, "\t")
      );
      return products[productToDeleteIndex];
    } catch (error) {
      throw error;
    }
  };
}

export default ProductManager;
