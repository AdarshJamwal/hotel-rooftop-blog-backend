const express = require('express');
const Blog = require('../model/blog.model');
const verifyToken = require('../middleware/verifyToken');
const isAdmin = require('../middleware/isAdmin');
const Comment = require('../model/comment.model');
const router = express.Router();

// create a blogPost 
router.post('/create-post',verifyToken, isAdmin, async(req, res)=>{
    try {
        const newPost = new Blog({...req.body, author:req.userId}) // author:req.userId, when you have token verify 
        await newPost.save();
        res.status(201).send({
            message:"Post Created Successfully" ,
            post : newPost
        })
        
    } catch (error) {
        console.error("Error creating post:", error); 
        res.status(500).send({message: "Error creating the post"})
        
    }
})



// get all blogs and search filtering
router.get('/', async(req, res)=>{
     try {
        const {search, category, location} = req.query;

        let query = {}

        if(search){
            query = {...query, 
                $or:[
                    {title:{$regex:search, $options:"i"}},
                    {content:{$regex:search, $options:"i"}}
                ]
            }
        }
        if(category){
            query = {...query, 
                category 
            }
        }
        if(location){
            query = {...query, 
                location
            }
        }
        const posts = await Blog.find(query).populate('author', 'email').sort({createdAt:-1})
        res.status(200).send(posts)
     } catch (error) {
        console.error("Error creating post:", error); 
        res.status(500).send({message: "Error creating the post"})
     }
})

// get Single Blog by id 

router.get("/:id", async(req, res)=>{
    try {
        const postId = req.params.id 
        const post = await Blog.findById(postId);
        if(!post){
            return res.status(404).send({message:"Post not Found"})
        }

        // Todo: with also fetch comment related to the post

        const comments = await Comment.find({postId:postId}).populate('user', "username email")
        res.status(200).send({
            post, comments
        })        
    } catch (error) {
        
        console.error("Error Fetching Single Post:", error);
        res.status(500).send({message:"Error fetching single post"})
            
    }
    
})


// update a blog post 

router.patch('/update-post/:id',verifyToken, isAdmin, async(req, res)=>{
    try {
        const postId = req.params.id;
        const  updatedPost = await Blog.findByIdAndUpdate(postId, {
            ...req.body
        }, {new:true}); 

        if(!updatedPost){
            return res.status(404).send({message:"Page not found"})
        }
        res.status(200).send({
            message: "Post Updated Successfully",
            post: updatedPost
        })
    } catch (error) {
        
        console.error("Error Updating Post:", error);
        res.status(500).send({message:"Error fetching Updating"})
    }
})


// delete a blog post 

router.delete("/:id", verifyToken, isAdmin,  async(req, res)=>{
    try {
        const postId = req.params.id;
        const post = await Blog.findByIdAndDelete(postId)
        if(!post){
            return res.status(404).send({message: "Post not found"})
        }
        // delete related comments
        await Comment.deleteMany({postId:postId})
        res.status(200).send({
            message: "Post Deleted Successfully",
            post : post
        })
    } catch (error) {
        console.error("Error Deleting Post:", error);
        res.status(500).send({message:"Error Deleting a Post"})
    }
})


// related post blog 

router.get('/related/:id', async(req, res)=>{
    try {
        const {id} = req.params;
        if(!id){
            return res.status(400).send({message: "Post id is not required"})
        }
        const blog = await Blog.findById(id)

        if(!blog){
            return res.status(404).send({message: "Post is not found"})

        }
        const titleRegex = new RegExp(blog.title.split(' ').join('|'), 'i');

        const relatedQuery = {
            _id: {$ne:id}, // exclude the current blog by id 
            title:{$regex: titleRegex}
        }

        const relatedPost = await Blog.find(relatedQuery)
        res.status(200).send(relatedPost)


    } catch (error) {
        console.error("Error related Post:", error);
        res.status(500).send({message:"Error Fetching related a Post"})
    }
})



module.exports = router; 


