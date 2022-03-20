const asyncHandler = require("express-async-handler");
import User from "../models/user";
import generateToken from "../config/generateToken";


 export const registerUser = asyncHandler( async (req,res) => { // asyncHandler is a middleware that is used to handle async functions

    const {name, email, password, pic} = req.body;   

if (!name || !email || !password) { // if the user does not provide the required fields, then return an error
     res.status(400)
     throw new Error("Please provide all required fields");
    }

    const userExists = await User.findOne({email}); // check if the user already exists, in the model we set the email as unique!!'

    if (userExists) {
        res.status(400)
        throw new Error("User already exists");
    }

    const user = await User.create({ // if the user does not exist, then create a new user
        name, 
        email, 
        password, 
        pic}); // create a new user

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                pic: user.pic,
                token: generateToken(user._id) // generate a token for the user

            });
        } else {
            res.status(400)
            throw new Error("Failed to create user");
        }
});

 export const authUser = asyncHandler( async (req,res) => {
    const {email, password} = req.body;

    const user = await User.findOne({email});

    if (user && (await user.matchPassword(password))) {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id)
        });
    } else {
        res.status(400)
        throw new Error("Invalid email or password");
    }

    
});

// /api/users?search=name
export const allUsers = asyncHandler( async (req,res) => {
    const keyword = req.query.search ? {
        $or: [ // $or is a mongodb operator that allows us to search for multiple fields
            {name: {$regex: req.query.search, $options: 'i'}}, // $regex is a mongodb operator that allows us to search for a string
            {email: {$regex: req.query.search, $options: 'i'}}
        ]
    } : {};
    
    const users = await User.find(keyword).find({_id: {$ne: req.user._id}}); // find all users except the current user
    res.send(users);

});




    



