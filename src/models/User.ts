import { model, models, Schema, Types } from "mongoose";
import bcrypt from "bcryptjs";

const useSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    pic: {
      type: String,
      required: true,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
  },
  {
    timestamps: true,
  }
);

useSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password); // compare the entered password with the password in the database
}; // this is a method that we can use on the userSchema  to compare the password that the user entered with the password that we have in the database 

useSchema.pre("save", async function (next) { // pre is a middleware that runs before the save function
  if (!this.isModified) {
    next();
  }

  /* 
  bcrypt is used to hash the password
  for using bcrypt we need to install the package first in the terminal: npm install bcryptjs
   */

  const salt = await bcrypt.genSalt(10); // generate a salt for the password hashing algorithm (10 is the number of rounds) 
  this.password = await bcrypt.hash(this.password, salt); // hash the password  (this.password is the password that the user entered) 
}); 


export default models.Chat || model("User", useSchema);
