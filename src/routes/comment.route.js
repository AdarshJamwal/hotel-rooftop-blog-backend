const express = require('express')
const Comment = require('../model/comment.model')
const router = express.Router()

// create a comment 

router.post('/post-comment', async(req, res)=>{
   try {
    const newComment = new Comment(req.body);
    await newComment.save();
    res.status(200).send({message: "Comment created successfully", comment:newComment})
   } catch (error) {
    console.error("An error occured while posting new comment", error);
    res.status(500).send({message: "An error occured while creating a new post"})
    
   }
})


// get all comments count 

router.get("/total-comments", async(req, res)=>{
    try {
        const totalComment = await Comment.countDocuments({})
        res.status(200).send({message:"Total comments Count", totalComment})
    } catch (error) {
         console.error("An error occured while getting  comment count ", error);
         res.status(500).send({message: "An error occured while getting  comment count"})
    }
})


module.exports = router; 


