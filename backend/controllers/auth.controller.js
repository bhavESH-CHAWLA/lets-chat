export async function checkAuth(req,res,next){
        if(!req.user){
            return res.status(401).json("User is not authrozised");
            
        }
        res.status(200).json(req.user);

}