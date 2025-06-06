const express=require("express");
const router=express.Router();
router.get("/user",(req,res)=>{
    res.send("user is getting");
})
router.get("/user/post",(req,res)=>{
    res.send("User is posting");
})
router.delete("/users/delete",(req,res)=>{
    res.send("user is deleting");
})

module.exports=router;