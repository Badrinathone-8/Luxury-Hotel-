const express=require("express")
const app=express();
const router=express.Router();
router.get("/post",(req,res)=>{

    res.send("post is getting");
})
router.get("/post/posts",(req,res)=>{
    res.send("Post is posting");
})
router.delete("/post/delete",(req,res)=>{
    res.send("Post is deleting");
})
module.exports=router;