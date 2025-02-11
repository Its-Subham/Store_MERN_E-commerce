import User from '../models/userModel.js';
import asyncHandler from '../middlewares/asyncHandeler.js';
import bcrypt from "bcryptjs"
import creatToken from '../utils/createToken.js'
import { Error } from 'mongoose';

const createUser = asyncHandler(async (req, res) => {
    const { username, email, password, phoneNumber } = req.body;
  
    // Check for all required fields
    if (!username || !email || !password || !phoneNumber) {
      throw new Error("Please fill all the inputs.");
    }
  
    // Validate phone number: must be exactly 10 digits
    if (!/^\d{10}$/.test(phoneNumber)) {
      throw new Error("Phone number must be exactly 10 digits.");
    }
  
    // Check if a user already exists with the same email
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }
  
    // Encrypt the original password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
  
    // Create a new user, including the phoneNumber field
    const newUser = new User({
      username,
      email,
      phoneNumber,
      password: hashedPassword,
    });
  
    try {
      await newUser.save();
      creatToken(res, newUser._id);
  
      res.status(201).json({
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        phoneNumber: newUser.phoneNumber,
        isAdmin: newUser.isAdmin,
      });
    } catch (error) {
      res.status(400);
      throw new Error("Invalid user data");
    }
  });

const loginUser =asyncHandler(async (req, res)=>{
    const {email, password} = req.body;

    const existingUser = await User.findOne({email})

    if(existingUser){
        const isPawsswordValid = await bcrypt.compare(password, existingUser.password)

        if(isPawsswordValid){
            creatToken(res, existingUser._id)

            res.status(201).json({
                _id: existingUser._id, 
                username: existingUser.username, 
                email: existingUser.email, 
                isAdmin: existingUser.isAdmin
            });
            return; // Exit the function after sending the response
        }
    }
})

const logoutCurrentUser = asyncHandler(async (req,res)=>{
    res.cookie('jwt', '', {
        httpOnly : true,
        expires: new Date(0),
    });
    res.status(200).json({message: "Logged out successfully"})
})

const getAllUsers = asyncHandler(async (req, res)=>{
    const users = await User.find({});
    res.json(users);
})

const getCurrentUserProfile = asyncHandler(async (req, res)=>{
    const users = await User.findById(req.user._id)

    if(users){
        res.json({
            _id: users._id,
            username: users.username,
            email: users.email
        })
    } else{
        res.status(404)
        throw new Error("User not found.");
    }
})

const updateCurrentUserProfile = asyncHandler(async (req, res)=>{
    const user = await User.findById(req.user._id);

    if(user){
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;

        if(req.body.password){
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            user.password = hashedPassword;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id, 
            username: updatedUser.username, 
            email: updatedUser.email, 
            isAdmin: updatedUser.isAdmin
        });
    } else {
        res.status(404);
        throw new Error("User not found"); 
    }
})

const deleteUserById = asyncHandler(async (req, res)=>{
    const user = await User.findById(req.params.id)

    if(user){
        if(user.isAdmin){
            res.status(400)
            throw new Error('Cannot delete admin user');
        }

        await User.deleteOne({_id: user._id});
        res.json({message: "User Removed"});
    } else{
        res.status(404);
        throw new Error("User not found.");
    }
})

const getUserById = asyncHandler(async(req, res)=>{
    const user = await User.findById(req.params.id).select('-password');

    if(user){
        res.json(user);
    } else{
        throw new Error("User not found");
    }
})

const updateUserById = asyncHandler(async (req, res)=>{
    const user = await User.findById(req.params.id);

    if(user){
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;
        user.isAdmin = Boolean(req.body.isAdmin);

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin
        })
    } else {
        res.status(404);
        throw new Error("User not found");
    }
})

export {createUser, loginUser, logoutCurrentUser, getAllUsers, getCurrentUserProfile, updateCurrentUserProfile, deleteUserById, getUserById, updateUserById};