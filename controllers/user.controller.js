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

        
        // check if the user trying to access the details is the same user
        if(req.user._id.toString() !== req.params.id){
            const error = new Error('You are trying to access the details of another user, which is not permitted');
            error.statusCode = 404;
            throw error;
        }
                console.log('TESTING')


        res.status(200).json({ success: true, data: user });

     }catch(error){
        // console.log(error);
        next(error);
     }
}