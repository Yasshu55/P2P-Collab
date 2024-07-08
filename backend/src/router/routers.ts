import { Router } from 'express';
import { Request, Response } from 'express';
import User from '../db/models/User';
const router = Router();

router.post('/sign-up', async (req: Request,res: Response) => {
    try {
        const {username,email,password} = req.body
        console.log(username, " ",email, " ", password);

        const userExists = await User.findOne({email:email})
        if(userExists){
           return res.status(400).json({message: "User already exists" })
        }

        const user = new User({
            username:username,
            email:email,
            password:password
        })
        await user.save()

        console.log("Signed up successfully!");
        
        return res.status(200).json({message: "User created successfully" })
    } catch (error) {
        console.log(error);
    }
})

router.post('/sign-in', async (req: Request,res: Response) => {
    try {
        const {email,password} = req.body
        console.log(email, " ", password);

        const user = await User.findOne({email})
        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }

        if(user.password !== password){
            res.status(400).json({message: "Password is incorrect" })
        }

        console.log("Signed up successfully!");
        
        return res.status(200).json({ message: "User authenticated successfully", user });
    } catch (error) {
        console.log(error);
    }
})

export default router;
