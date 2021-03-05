//imports
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const postModal = require('./postsModel');
const postModel = require('./postsModel');
const Pusher = require("pusher");

//configure application
const app = express();
const PORT = process.env.PORT || 5000
const pusher = new Pusher({
    appId: "1166653",
    key: "58a0828f61ce82332ee9",
    secret: "999e5122da530af19744",
    cluster: "us2",
    useTLS: true
  });
  
//middlewares
app.use(express.json());
app.use(cors());
app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Headers","*");
    next();
})


//db connection 
const mongodbURI= "mongodb+srv://admin:nirrep98@cluster0.ulj9g.mongodb.net/facebookPosts?retryWrites=true&w=majority";
mongoose.connect(mongodbURI,{
    useCreateIndex:true,
    useNewUrlParser: true,
    useUnifiedTopology:true
})

const db = mongoose.connection;
db.once('open',()=>{
    console.log("Connected to mongoDb Database🟢")
    const postCollections = db.collection('posts')
    const changeStream = postCollections.watch()
    changeStream.on('change',(change)=>{
        if(change.operationType === 'insert')
        {
            const details = change.fullDocument;
            pusher.trigger("posts", "insert", {
                user:details.user,
                post:details.post,
                timeStamp:details.timeStamp
              });
        }
        else
        {
            console.log("TRIGGER USHER NOT WORKING CORRECTLY 🔴")
        }
    })
})
db.on('error',(err)=>{console.log("Error: 🔴",err)})


//api routes
app.get('/',(req,res)=>{
    res.status(200).send("Welcome to my facebook clone ✨")
})

app.get('/posts',(req,res)=>{
    postModel.find({},(err,data)=>{
        if(err)res.status(500).send("THERE was an error entering data into the database 🔴",err)
        res.status(200).send(data);
    })
})


app.post('/post/create',(req,res)=>{
    const body = req.body;
    const aPost =  
    postModel.create(body,(err)=>{
        if(err){
            res.status(500).send(err)
        }
        else{
            res.status(201).send("DATA IS ENTERED IN THE DATABASE 🟢")
        }
    })

})

//listeners
app.listen(PORT,(err)=>{
    if(err)console.log("ERROR 🔴",err)
    console.log("The server is up and running 🟢")
})


// nirrep98
//for this app mongodb's networs access is set to from anywhere.