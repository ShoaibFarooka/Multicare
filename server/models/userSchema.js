const mongoose = require('mongoose');
// const bcryptjs = require('bcryptjs');
// const jwt = require('jsonwebtoken');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    contact: {
        type: String,
        required: true
    },
    age: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'user'
    },
    image: {
        type: String,
    },
    specialty: {
        type: String,
    }
})

//Hash password to secure
// userSchema.pre('save', async function (next) {
//     if (this.isModified('password')) {
//         this.password = bcryptjs.hashSync(this.password, 10);
//     }
//     next();
// })

// //Generate Tokens to verify User
// userSchema.methods.generateToken = async function () {
//     try {
//         let generatedToken = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
//         this.tokens = this.tokens.concat({ token: generatedToken });
//         await this.save();
//         return generatedToken;
//     } catch (error) {
//         console.log(error)
//     }
// }


//Create Model
const Users = new mongoose.model("Users", userSchema);

module.exports = Users;