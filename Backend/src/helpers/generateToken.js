import jwt from "jsonwebtoken";

export const generateToken = (id) => {
    //token must be retured to the client

    return jwt.sign({id}, process.env.JWT_SECRET,{
        expiresIn: "30d",
    });
};
