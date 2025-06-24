const express = require('express');
const app = express();
const { UserModel, TodoModel } = require("./db");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "blowwwjob22";
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const {z} = require("zod");


mongoose.connect("mongodb+srv://admin:Pranav$25@cluster0.uwlhvre.mongodb.net/to-do-app-database");

app.use(express.json());

app.post('/signup' , async function(req, res){

    const requireBody = z.object({
        email : z.string().min(5).max(50).email(),
        name : z.string().min(3).max(50),
        password : z.string().min(6).max(20).refine(
            (password) => /[A-Z]/.test(password),
            {
                message: "Password must contain atleast on UpperCase character"
            }
        ).refine(
            (password) => /[a-z]/.test(password),
            {
                message: "Password must contain atleast one Lowercase character"
            }
        )
    });

    const parseDatawithSuccess = requireBody.safeParse(req.body); 

    if(!parseDatawithSuccess.success){
        res.json({
            message: "failed ",
            error : parseDatawithSuccess.error
            
        })
        return
    }

    const errorflag = false;
        const email = req.body.email;
        const password = req.body.password;
        const name = req.body.name;

    try{ 
        const hashPassword = await bcrypt.hash(password, 5);
        console.log(hashPassword);

        await UserModel.create({
            email : email,
            password: hashPassword,
            name: name
        })

    }catch(e){
        res.json({
            message: "User already exists"
        })
        errorflag=true;
    }

    if(!errorflag){

        res.json({
            message: "you are logged in"
        })
    }

});

app.post('/signin' , async function(req, res){
        const email = req.body.email;
        const password = req.body.password;

        const response =  await UserModel.findOne({
            email: email
        })

        console.log(response);

        if(!response){
            res.status(403).json({
                message: "user does not exist in db"
            })
            return
        }

        const matchPassword = await bcrypt.compare(password, response.password);

        if(matchPassword){
            const token = jwt.sign({
                id : response._id.toString()
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


app.post('/todo' , auth , async function(req, res){
    const userId = req.userId;
    const title = req.body.title;
    const done = req.body.done;

    await TodoModel.create({
        title,
        userId,
        done
    });


    res.json({
        userId : userId 
    })

});


app.get('/todos' , auth , async function(req, res){
    const userId = req.userId;

    const todos  = await TodoModel.find({
        userId: userId
    });

    res.json({
        userId : userId 
    })

});


function auth( req , res , next){
    const token = req.headers.token;

    const decodeddata = jwt.verify(token , JWT_SECRET);

    if(decodeddata){
        req.userId = decodeddata.id;
        next();
    }
    else{
        res.status(403).json({
            message : "Incorrect credentials"
        });
    }
}

app.listen(3000);