const PORT = 5000
//Routers
const productsRouter=require("./routes/products")
const categoriesRouter=require("./routes/categories")
const homeRouter=require("./routes/homepage")
const loginRouter=require("./routes/login")
//libraries
const express=require("express")
const app= express()
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swaggerConfig');
const cookieParser=require('cookie-parser')


//middleware 
app.use(express.urlencoded({
    extended:true
}))
app.use(cookieParser())
app.use(express.json())
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(productsRouter)
app.use(categoriesRouter)
app.use(loginRouter)
app.use(homeRouter)


app.listen(PORT,()=>{
    console.log(`running on port ${PORT}`)
})