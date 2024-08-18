const {Router} = require("express")
const router=Router()

router.get('/',(req,res)=>{
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <button> <a href="/products">Products</a></button>
    <button> <a href="/categories">Categories</a></button>
</body>
</html>`)

})

module.exports=router