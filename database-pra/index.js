const express = require('express');
const app = express();
const { UserModel, TodoModel } = require("./db");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "blowwwjob22";
const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://admin:Pranav$25@cluster0.uwlhvre.mongodb.net/to-do-app-database");

app.use(express.json());

app.post('/signup' , async function(req, res){
        const email = req.body.email;
        const password = req.body.password;
        const name = req.body.name;

        await UserModel.create({
            email : email,
            password: password,
            name: name
        })

        res.json({
            message: "you are logged in"
        })
});

app.post('/signin' , async function(req, res){
        const email = req.body.email;
        const password = req.body.password;

        const user =  await UserModel.findOne({
            email: email,
            password: password
        })

        console.log(user);

        if(user){
            const token = jwt.sign({
                id : user._id.toString()
            }, JWT_SECRET);
            res.json({
                token
            });
        }
        else{
            res.status(403).json({
                message: "Incorrect credentials"
            });
        }

});


app.post('/todo' , auth , function(req, res){
    const userId = req.userId;
    res.json({
        userId : userId 
    })
});


app.get('/todos' , auth , function(req, res){
    const userId = req.userId;

    res.json({
        userId : userId 
    })
});


function auth( req , res , next){
    const token = req.headers.token;

    const decodeddata = jwt.verify(token , JWT_SECRET);

    if(decodeddata){
        req.userId = decodeddata.userId;
        next();
    }
    else{
        res.status(403).json({
            message : "Incorrect credentials"
        });
    }
}

app.listen(3000);