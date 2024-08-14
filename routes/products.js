const {Router} = require("express")
const router=Router()
const {getProducts, addProduct} = require("../db")
let productsData = [];

async function fetchData() {
    try {
        productsData = await getProducts();
    } catch (err) {
        console.error(err);
    }
}

fetchData()


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
router.get("/products",(req,res)=>{
    res.status(200).json(productsData)
})

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
router.get("/products/:id",(req,res)=>{
    const {id} = req.params
    res.status(200).json(productsData[id])
 })

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
router.patch('/products/:id',(req,res)=>{
    const {id} =req.params
    const {body} =req
    const parsedId= parseInt(id)
    if(isNaN(parsedId)) return res.sendStatus(400)
    const findProduct = productsData.findIndex((product)=>product.id === parsedId)
if(findProduct ===-1)return res.sendStatus(404)
    const found = productsData[findProduct] = {...productsData[findProduct],...body}
res.status(200).json(found)
})

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
router.delete('/products/:id',(req,res)=>{
    const {id} =req.params
    const parsedId= parseInt(id)
    const findProduct = productsData.findIndex((product)=>product.id === parsedId)
    productsData.splice(findProduct, 1)
    return res.sendStatus(200)
})
module.exports =router