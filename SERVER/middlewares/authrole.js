const authrole = (permissions) => {
    return (req, res, next) => {
        console.log(req.user);
        const userRole = req.user.role;
        if(permissions.includes(userRole)){
            next();
        }
        else{
            res.status(422).send({"error": "You don't have the permissions"});
        }
    }
}

module.exports = {authrole};