const router = require('express').Router();
let User = require('../models/User.model');

router.route('/').get((req, res) => {
    User.find()
        .then(users => res.json(users))
        .catch(err => res.status(400).json('Error: '+ err));
});

router.route('/register').post((req, res) => {

    const FirstName = req.body.FirstName;
    const LastName = req.body.LastName;
    const EmailAddress = req.body.EmailAddress;
    const Password = req.body.Password;

    const NewUser = new User({FirstName,LastName,EmailAddress,Password});

    NewUser.save()
        .then(() => res.json("User Added!!"))
        .catch(err => res.status(400).json('Error: '+ err));
});

router.route('/:email/:password').get((req,res) => {
    User.find({EmailAddress: req.params.email, Password: req.params.password})
        .then(user => res.json(user))
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;