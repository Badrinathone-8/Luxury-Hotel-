const express=require("express");
const mongoose=require("mongoose");
const review=require("./review.js");
const { required } = require("joi");

const user=new mongoose.Schema({
    title:{
        type:String
    },
    description:String,
    image: {
      type: {
        url: {
          type: String,
          default: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=60",
          set: (v) => v === "" ? "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=60" : v
        }
      },
      default: undefined
    },
    


    //  image:{
    //      type:String,
    
    //     //url:"https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhY2glMjBob3VzZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",

    //     default: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhY2glMjBob3VzZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    //     set: (v) => v ==="" ?  "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhY2glMjBob3VzZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
    //      :v,
    // },
    // image: {
    //   type: String,
    //   default: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=60",
    //   set: (v) => v === "" ? "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=60" : v
    // },
    


    // image: {
    //     type: {
    //       url: {
    //         type: String,
    //         default: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=60",
    //         set: (v) =>
    //           v === ""
    //             ? "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=60"
    //             : v,
    //       }
    //     },
    //     default: undefined // ensures the object gets created
    //   },
      
    location:String,
    country:String,
    price:{
        type:Number,
        default:0,
        required:true
    },
    reviews:[
      {
        type:mongoose.Schema.Types.ObjectId,
        ref:review,
        
      }
    ]

})
const listing=mongoose.model("listing",user);
module.exports=listing;
