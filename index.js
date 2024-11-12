
const mongoose = require('mongoose')
const express = require('express')
const app = express()
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')

const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 5000;



// parse options 
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json({limit: "10mb"}))
app.use(bodyParser.urlencoded({limit:"10mb", extended:true}))

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true,               
}));


//routes 

const blogRoutes = require('./src/routes/blog.route');
const commentRoutes = require('./src/routes/comment.route');
const userRoutes = require('./src/routes/auth.user.route');


app.use('/api/auth', userRoutes)
app.use('/api/blogs', blogRoutes)
app.use('/api/comments', commentRoutes)



// Database connection 
async function main(){
    await mongoose.connect(process.env.MONGODB_URL)
    
    app.get('/', (req, res) => {
        res.send('App is running Successfully !')
      })
      
}

main().then(()=>console.log("Mongo DB Connected Successfully")).catch(err=>console.log(err));





app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})




