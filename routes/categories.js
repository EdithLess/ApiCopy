const {Router} = require("express")
const express=require("express")
const router=Router()
const {getCategories} = require("../db")
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
router.get("/categories",(req,res)=>{
    res.status(200).json(categoriesData)
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
router.get("/categories/:id",(req,res)=>{
    const {id} = req.params
    res.status(200).json(categoriesData[id])
 })

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
 router.post('/categories',(req,res)=>{
    const newId=categoriesData[categoriesData.length-1].id+1
   const {body} = req
   const newProduct = {id: newId, ...body}
   categoriesData.push(newProduct)
   res.status(200).json(categoriesData)
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
router.patch('/categories/:id',(req,res)=>{
    const {id} =req.params
    const {body} =req
    const parsedId= parseInt(id)
    if(isNaN(parsedId)) return res.sendStatus(400)
    const findCategory = categoriesData.findIndex((category)=>category.id === parsedId)
if(findCategory ===-1)return res.sendStatus(404)
    const found = categoriesData[findCategory] = {...categoriesData[findCategory],...body}
res.status(200).json(found)
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
router.delete('/categories/:id',(req,res)=>{
    const {id} =req.params
    const parsedId= parseInt(id)
    const findCategory = categoriesData.findIndex((category)=>category.id === parsedId)
    categoriesData.splice(findCategory, 1)
    return res.sendStatus(200)
})




module.exports =router