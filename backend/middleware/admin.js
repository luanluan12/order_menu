module.exports = (...roles) => {

    return (req, res, next) => {

        console.log("Current role:", req.user.role);
        console.log("Allowed roles:", roles);
        console.log("URL:", req.originalUrl);

        if (!roles.includes(req.user.role)) {

            return res.status(403).json({
                message: "Permission denied"
            });

        }

        next();

    };

};