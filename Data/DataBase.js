const mongoose=require("mongoose");
//const express=require("express");
const initdata=require("./data.js");
const listing=require("../models/listing.js");
main().then((res)=>{
    
}).catch((err)=>{
    console.log(err);
})
async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
   
}

 async function initdb(){
    console.log("saved");
    await listing.deleteMany({});
    await listing.insertMany(initdata.data);
    
}
initdb()
