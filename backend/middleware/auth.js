import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: "Not Authorized. Token is missing or invalid." });
    }

    try {
        const token = authHeader.split(' ')[1];
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

        // Standard practice: create a 'user' object on the request
        req.user = { id: tokenDecode.id };

        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ success: false, message: "Error: Your token is not valid." });
    }
}

export default authMiddleware;