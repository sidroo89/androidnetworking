
const express = require('express')
const app= express()
// const dotenv = require('dotenv')
const mongoose = require('mongoose');
require('dotenv').config();
const mongoClient= require('mongodb').MongoClient
mongoose.Promise = global.Promise;
// const url="mongodb://localhost:27017"
const port = process.env.PORT || 3000;
const uri=process.env.MONGOLAB_URI;

app.get('/',(req,res)=>{
    res.send('hieee sid here :)')
})


app.use(express.json())
// mongoose.connect(uri, {  useNewUrlParser: true,  useUnifiedTopology: true}).then(() => 
// {  console.log('MongoDB Connected…')}).catch(err => console.log(err))


mongoClient.connect(uri,{  useNewUrlParser: true,  useUnifiedTopology: true},(err,db) =>{
    if(err){
        console.log(`Your port is ${uri}`);
        console.log("error while connecting mongodb client")
        // console.log(err)
    }else{
        console.log('mongodb connected')
        const mydb=db.db('myDb')
        const collection=mydb.collection('myTable')

        app.post('/signup', (req,res) => {

            const newUser = {
                name: req.body.name,
                email:req.body.email,
                password: req.body.password
            }
            const query ={
                email: newUser.email
            }

            collection.findOne(query,(err,result) =>{
                if(result==null){
                    collection.insertOne(newUser,(err,result) =>{
                        res.status(200).send()
                    })
                }
                else{
                    res.status(400).send()
                }
            })

            
        })

        app.post('/login', (req,res)=>{
            const query={
                email: req.body.email,
                password: req.body.password
            }
            collection.findOne(query, (err,result) =>{
                if(result!=null)
                {
                    const objToSend={
                        name: result.name,
                        email: result.email
                    }
                    res.status(200).send(JSON.stringify(objToSend))
                }else {
                    res.status(404).send()
                }
            })
        })
    }
})


app.listen(port,() =>{

    console.log("listening on port 3000...")

})