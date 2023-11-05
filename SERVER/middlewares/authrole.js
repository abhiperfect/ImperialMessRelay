const authrole = (permissions) => {
    return (req, res, next) => {
        const userRole = req.user.role;
        console.log(userRole);
        if(permissions.includes(userRole)){
            next();
        }
        else{
            res.status(422).send("You don't have the permissions");
        }
    }
}

module.exports = {authrole};