const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;


const User = new Schema({
    email : {type:String, unique:true},
    name : String,
    password : String
})

const ToDo = new Schema({

    title : String,
    done : Boolean,
    UserId : ObjectId
})

const UserModel = mongoose.model('users' , User);
const TodoModel = mongoose.model('to-do' , ToDo);

module.exports= {
    UserModel: UserModel,
    TodoModel: TodoModel
}
