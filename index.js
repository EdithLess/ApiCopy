require("dotenv").config()
const express=require("express")
const { getCategories, getProducts,getUsers } = require('./db');
let categoriesData = [];
let productsData = [];

async function fetchData() {
    try {
        categoriesData = await getCategories();
        productsData = await getProducts();
    } catch (err) {
        console.error(err);
    }
}

// Викликаємо функцію для отримання даних
fetchData();
 
const app= express()
const PORT = 5000
const jwt=require("jsonwebtoken")
const cookieParser=require('cookie-parser')
const swaggerJsDoc=require("swagger-jsdoc")
const swaggerUI=require("swagger-ui-express")
const options= {
    definition:{
        openapi:"3.0.0",
        info:{
            title:"API doc",
            version:"1.0",
            description:"this is a simple API documentation"

        },
        servers:[
            {
                url: "http://localhost:5000"
            },
        ],
    },
    apis:['./index.js'],
}

const spacs=swaggerJsDoc(options)

app.use(express.urlencoded({
    extended:true
}))
app.use(cookieParser())
app.use(express.json())
app.use("/api-docs",
    swaggerUI.serve,
    swaggerUI.setup(spacs)
)

//middleware function

const cookiewJwtAuth=(req,res,next)=>{
const token=req.cookies.token
try {
    const user=jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    req.user=user
    next()
} catch (error) {
    res.clearCookie("token")
    return res.send("Some error")
    
}
}

/**
 * @swagger
 * /:
 *   get:
 *     description: Welcome to the API
 *     responses:
 *       200:
 *         description: Returns a greeting message.
 */
app.get('/',(req,res)=>{
    res.send("Hey there")
})


//Виведення всіх товарів
/**
 * @swagger
 * /products:
 *   get:
 *     summary: Retrieve all products
 *     responses:
 *       200:
 *         description: A list of products.
 */
app.get("/products",(req,res)=>{
    res.status(200).json(productsData)
})

//Виведення одного товару
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
app.get("/products/:id",(req,res)=>{
   const {id} = req.params
   res.status(200).json(productsData[id])
})

//Виведення всіх категорій
/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Retrieve all categories
 *     responses:
 *       200:
 *         description: A list of categories.
 */
app.get("/categories",(req,res)=>{
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
app.get("/categories/:id",(req,res)=>{
    const {id} = req.params
    res.status(200).json(categoriesData[id])
 })


//Додавання товарів
/**
 * @swagger
 * /products:
 *   post:
 *     summary: Add a new product
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
 *         description: The created product.
 */
app.post('/products',(req,res)=>{
    const newId=productsData[productsData.length-1].id+1
   const {body} = req
   const newProduct = {id: newId, ...body}
   productsData.push(newProduct)
   res.status(200).json(productsData)
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
app.post('/categories',(req,res)=>{
    const newId=categoriesData[categoriesData.length-1].id+1
   const {body} = req
   const newProduct = {id: newId, ...body}
   categoriesData.push(newProduct)
   res.status(200).json(categoriesData)
})


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
app.patch('/products/:id',(req,res)=>{
    const {id} =req.params
    const {body} =req
    const parsedId= parseInt(id)
    if(isNaN(parsedId)) return res.sendStatus(400)
    const findProduct = productsData.findIndex((product)=>product.id === parsedId)
if(findProduct ===-1)return res.sendStatus(404)
    const found = productsData[findProduct] = {...productsData[findProduct],...body}
res.status(200).json(found)
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
app.patch('/categories/:id',(req,res)=>{
    const {id} =req.params
    const {body} =req
    const parsedId= parseInt(id)
    if(isNaN(parsedId)) return res.sendStatus(400)
    const findCategory = categoriesData.findIndex((category)=>category.id === parsedId)
if(findCategory ===-1)return res.sendStatus(404)
    const found = categoriesData[findCategory] = {...categoriesData[findCategory],...body}
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
app.delete('/products/:id',(req,res)=>{
    const {id} =req.params
    const parsedId= parseInt(id)
    const findProduct = productsData.findIndex((product)=>product.id === parsedId)
    productsData.splice(findProduct, 1)
    return res.sendStatus(200)
})

//Видалення елементу в categories
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
app.delete('/categories/:id',(req,res)=>{
    const {id} =req.params
    const parsedId= parseInt(id)
    const findCategory = categoriesData.findIndex((category)=>category.id === parsedId)
    categoriesData.splice(findCategory, 1)
    return res.sendStatus(200)
})

//jwt
/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login to get JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login.
 *       403:
 *         description: Invalid login.
 */
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const users = await getUsers();
    const user = users.find(user => user.nickname === username);

    if (!user || user.password !== password) {
        return res.status(403).json({ error: "Invalid login" });
    }

    delete user.password;

    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });

    res.cookie("token", token, {
        httpOnly: true
    });

    return res.status(200).json(user);
});


//check 
/**
 * @swagger
 * /add:
 *   post:
 *     summary: Check JWT and redirect to products
 *     responses:
 *       302:
 *         description: Redirects to products.
 */
app.post('/add',cookiewJwtAuth,(req,res)=>{
    res.redirect("/products")
})


app.listen(PORT,()=>{
    console.log(`running on port ${PORT}`)
})