const {Router} = require("express")
const router=Router()
const {getAllProducts,getProductById, addProduct, updateProductById,deleteProductById} = require("../db")

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Отримати список продуктів
 *     responses:
 *       200:
 *         description: Успішний запит
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   title:
 *                     type: string
 *                     example: "Classic Heather Gray Hoodie"
 *                   price:
 *                     type: number
 *                     example: 69.99
 */
router.get("/products", async (req, res) => {
    try {
      const products = await getAllProducts();
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Retrieve a single product by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the product to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single product.
 */
router.get("/products/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const product = await getProductById(id);

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.status(200).json(product);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Failed to retrieve product" });
    }
});

 /**
 * @swagger
 * /products:
 *   post:
 *     summary: Додати новий продукт
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *               creationAt:
 *                 type: string
 *                 format: date-time
 *               updatedAt:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Продукт успішно додано
 */
 router.post('/products', async (req, res) => {
    try {
        const { title, price, description, images, creationAt, updatedAt } = req.body;
        await addProduct({
            title,
            price,
            description,
            images,
            creationAt,
            updatedAt
        });

        res.status(201).json({ message: 'Product added successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Failed to add product' });
    }
});

//Оновлення поля даних в products

/**
 * @swagger
 * /products/{id}:
 *   patch:
 *     summary: Update a product by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the product to update.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: The updated product.
 */
router.patch('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { body } = req;

        const parsedId = parseInt(id);
        if (isNaN(parsedId)) return res.sendStatus(400); // Перевірка, чи id є числом

        const updatedProduct = await updateProductById(parsedId, body); // Виклик функції оновлення продукту

        if (!updatedProduct) return res.sendStatus(404); // Якщо продукт не знайдено, повертаємо 404

        res.status(200).json(updatedProduct); // Повертаємо оновлений продукт
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Failed to update product' });
    }
});

//Видалення елементу в products
/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the product to delete.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully deleted.
 */
router.delete('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const parsedId = parseInt(id);

        if (isNaN(parsedId)) {
            return res.status(400).json({ error: 'Invalid product ID' });
        }

        const deletedProduct = await deleteProductById(parsedId);

        if (!deletedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        return res.status(200).json({ message: 'Product deleted successfully', product: deletedProduct });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: 'Failed to delete product' });
    }
});


module.exports =router