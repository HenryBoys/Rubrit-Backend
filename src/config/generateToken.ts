
import jwt from 'jsonwebtoken';

const generateToken = (id: any) => {
    return jwt.sign({id}, `${process.env.JWT_SECRET}`, {expiresIn: '7d'}); // process.env.JWT_SECRET is the secret key that we set in the .env file
}

export default generateToken;