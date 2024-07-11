const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../utils/prisma.js')
const saltRounds = 10;

router.post('/', async (req, res) => {
    // Get the username and password from request body
    const {username, password} = req.body;

    const salt = await bcrypt.genSalt(saltRounds);

    console.log("salt: ", salt, password, req.body)

    if(!username || !password){
        res.json(400).json({error: "must contain password and username"})
    }

    const hashedPassword = await bcrypt.hash(password, salt);
    let createdUser = {}
    try{
    createdUser = await prisma.user.create({
        data: {
            username,
            password: hashedPassword
        },
    });
    }
    catch(er){
        res.json({"error" :"error adding user"})
    }


    
    // Hash the password: https://github.com/kelektiv/node.bcrypt.js#with-promises
    
    // Save the user using the prisma user model, setting their password to the hashed version
    
    // Respond back to the client with the created users username and id
    res.status(201).json({ user: { id: createdUser?.id, username: createdUser?.username }  })
});

module.exports = router;
