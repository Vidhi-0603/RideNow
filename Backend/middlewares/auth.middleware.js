import jwt from 'jsonwebtoken';
import userModel from '../models/user.model.js';
import blacListTokenModel from '../models/blacklist.model.js';
import captainModel from '../models/captain.model.js';

export const authUser = async (req, res, next) => {
    const { accessToken } = req.cookies;
    // console.log(accessToken,"auth");
    
    if (!accessToken) return res.status(401).json({ message: "Unauthorized" });

    const isblacklisted = await blacListTokenModel.findOne({ token: accessToken }); 
    console.log(isblacklisted,"blacklisted user auth...");
    
    if(isblacklisted) return res.status(401).json({ message: "Unauthorized" });

    try {
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

        console.log(decoded,"decoded user auth...");
        
        const user = await userModel.findById(decoded._id);
        console.log(user,"user auth...");
        
        if (!user) return res.status(401).json({ message: 'Unauthorized' });  
        
        req.user = user;
        req.role = decoded.role;
        next(); 
        
    } catch (err) {
        console.log(err,"auth err");
        return res.status(401).json({ message: 'Unauthorized' });
    }
}

export const authCaptain = async (req, res, next) => {
    const { accessToken } = req.cookies;    
    console.log(accessToken,"acc");
    
    if (!accessToken) return res.status(401).json({ message: "Unauthorized" });

    const isblacklisted = await blacListTokenModel.findOne({ token: accessToken }); 
    console.log(isblacklisted,"bll");
    
    if(isblacklisted) return res.status(401).json({ message: "Unauthorized" });

    try {
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

        const captain = await captainModel.findById(decoded._id);     
        console.log(captain,"cpp");
        
        if (!captain) return res.status(401).json({ message: 'Unauthorized' });  
        
        req.captain = captain;
        req.role = decoded.role;
        next(); 
        
    } catch (err) {
        console.log(err,"err");
        
        return res.status(401).json({ message: 'Unauthorized' });
    }
}