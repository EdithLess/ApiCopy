const {Router} = require("express")
const express=require("express")
const router=Router()
const {getCategories, getCategorytById, addCategory, updateCategoryById,deleteCategoryById} = require("../db")
let categoriesData = [];


async function fetchData() {
    try {
        categoriesData = await getCategories();
    } catch (err) {
        console.error(err);
    }
}
fetchData()

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Retrieve all categories
 *     responses:
 *       200:
 *         description: A list of categories.
 */
router.get("/categories",async (req,res)=>{
    res.status(200).json(await getCategories())
})

//Виведення однієї категорії
/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Retrieve a single category by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the category to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single category.
 */
router.get("/categories/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const category = await getCategorytById(id);

        if (!category) {
            return res.status(404).json({ error: "Category not found" });
        }

        res.status(200).json(category);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Failed to retrieve category" });
    }
});

 //Додавання категорій
/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Add a new category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: The created category.
 */
 router.post('/categories', async (req,res)=>{
    try {
        const { name, image,creationAt, updatedAt  } = req.body;
        await addCategory({
            name,
            image,
            creationAt,
            updatedAt 
        });

        res.status(201).json({ message: 'Category added successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Failed to add product' });
    }
})

//Оновлення поля даних в categories
/**
 * @swagger
 * /categories/{id}:
 *   patch:
 *     summary: Update a category by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the category to update.
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
 *     responses:
 *       200:
 *         description: The updated category.
 */
router.patch('/categories/:id',async (req,res)=>{
    try {
        const { id } = req.params;
        const { body } = req;

        const parsedId = parseInt(id);
        if (isNaN(parsedId)) return res.sendStatus(400); // Перевірка, чи id є числом

        const updatedCategory = await updateCategoryById(parsedId, body); // Виклик функції оновлення продукту

        if (!updatedCategory) return res.sendStatus(404); // Якщо продукт не знайдено, повертаємо 404

        res.status(200).json(updatedCategory); // Повертаємо оновлений продукт
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Failed to update category' });
    }
})

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Delete a category by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the category to delete.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully deleted.
 */
router.delete('/categories/:id',async (req,res)=>{
    try {
        const { id } = req.params;
        const parsedId = parseInt(id);

        if (isNaN(parsedId)) {
            return res.status(400).json({ error: 'Invalid product ID' });
        }

        const deletedCategory = await deleteCategoryById(parsedId);

        if (!deletedCategory) {
            return res.status(404).json({ error: 'Product not found' });
        }

        return res.status(200).json({ message: 'Product deleted successfully', category: deletedCategory });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: 'Failed to delete product' });
    }
})




module.exports =router