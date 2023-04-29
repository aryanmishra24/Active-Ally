const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require ('validator')

const Schema=mongoose.Schema

// Define the userSchema
const userSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    }
  });
  
  // Define the signup method on the userSchema
  userSchema.statics.signup = async function(email, password) {
    //valiadation
    if(!email || !password){
        throw Error('All fielsa must be filled')
    }

    // Check if the email already exists
    const user = await this.findOne({ email });
    if (user) {
      throw new Error('Email already in use');
    }
    if (!validator.isEmail(email)) {
        throw Error('Email is not valid')
    }
    if (!validator.isStrongPassword(password)) {
        throw Error('password is not strong enough')
    }
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
  
    // Create the new user document
    const newUser = await this.create({
      email,
      password: hash
    });
  
    return newUser;
  };
  
  //static login method
  userSchema.statics.login = async function(email, password) {
    
    //valiadation
    if(!email || !password){
      throw Error('All fields must be filled')
  }
   // Check if the email doesn't exists
   const user = await this.findOne({ email });
   if (!user) {
     throw Error('No account by this email exists');
   }

   const match = await bcrypt.compare(password, user.password)
   if(!match)throw Error('Invalid login credentials')
   return user
  }
  // Create the User model from the userSchema
  const User = mongoose.model('User', userSchema);
  
  // Export the User model
  module.exports = User;
  