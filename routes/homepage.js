const {Router} = require("express")
const router=Router()

router.get('/',(req,res)=>{
    res.send("Hey there")

})

module.exports=router