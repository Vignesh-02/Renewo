import User from "../models/user.model.js";

 export const getUsers = async (req, res, next) => {
     try{
        const users = await User.find();
        console.log('users ',users);
        res.status(200).json({ success: true, data: users });
     }catch(error){
        next(error)
     }
}


export const getUser = async (req, res, next) => {
     try{
        console.log('req', req);
        const user = await User.findById(req.params.id).select('-password');

        console.log('rcvd user', user);
        
        if(!user){
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({ success: true, data: user });
     }catch(error){
        console.log(error);
        next(error);
     }
}