const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../utils/prisma.js')

router.post('/', async (req, res) => {
    const { username, password } = req.body;
    // Get the username and password from the request body

    // Check that a user with that username exists in the database
    console.log("username", username)
    try {
        const user = await prisma.user.findUniqueOrThrow({
            where: { username: username },
        });
        const compare = await bcrypt.compare(password, user.password)
        console.log("user", user, password, user.password, compare)
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
        if(compare !== true){
            return res.status(400).json({error: "Password incorrect"})
        }
        if(compare === true){
            const token = jwt.sign({username: username}, process.env.JWT_SECRET);
            return res.status(200).json({jwt: token})
        }
        res.status(200).json({ user: user });
      } catch (error) {
        if (error instanceof NotFoundError) {
          res.status(404).json({ error: error.message });
        } else {
          res.status(500).json({ error: error.message });
        }
      }

    // Use bcrypt to check that the provided password matches the hashed password on the user
    // If either of these checks fail, respond with a 401 "Invalid username or password" error

    // If the user exists and the passwords match, create a JWT containing the username in the payload
    // Use the JWT_SECRET environment variable for the secret key

    // Send a JSON object with a "token" key back to the client, the value is the JWT created
});

module.exports = router;
