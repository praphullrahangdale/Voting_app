const express = require('express')
const router = express.Router();
const User = require('./../models/user')
const {jwtAuthMiddleware, generateToken} = require('./../jwt')

// POST route to add a user
router.post('/signup', async (req, res) => {
    try {
      const data = req.body;

      //Make sure only one person register as an admin
      const adminUser = await User.findOne({role : 'admin'});

      if(data.role === 'admin' && adminUser){
        return res.json({message : 'Only one user can register as an admin'})
      }
  
      //Create a new user document using the mongoose model
      const newUser = new User(data)
  
      //Save the new user to the database
      const response = await newUser.save();
      console.log('data saved');

      const payload = {
        id: response.id
      }
      const token = generateToken(payload);
      console.log("Token is " ,token)
      res.status(200).json({response : response , token : token});
  
    } catch (error) {
      console.log(error);
      res.status(500).json({error : 'Internal server error'})
    }
  })

  //Login Route
  router.post('/login', async(req, res)=>{
    try {
      //Extract username and password from request body
      const {aadharCardNumber , password} = req.body

    //Find the user by aadharCardNumber
    const user = await User.findOne({aadharCardNumber: aadharCardNumber});

    //If user not found or wrong password return error
    if(!user || !(await user.comparePassword(password))){
      return res.status(401).json({error: 'Invalid username and password'})
    }

    //generate Token
    const payload = {
      id: user.id
    }
    const token = generateToken(payload);

    //return token as response
    res.json({token})
    } catch (error) {
      console.error(error);
      res.status(500).json({error : 'Internal server error'})
    }
  })

  //Profil route
  router.get('/profile' ,jwtAuthMiddleware, async(req, res) =>{
    try {
      const userData = req.user
      const userId = userData.id
      const user = await User.findById({userId})

      res.status(200).json({user})
    } catch (error) {
      console.error(error);
      res.status(500).json({error : 'Internal server error'})
    }
  })
  
//PUT methode to update password data
router.put('/profile/password', jwtAuthMiddleware, async(req, res)=>{
    try {
        const userId = req.user //Extract the id from token
        const {currentPassword, newPassword} = req.body //Extract current and new password from body

        //Find the user by userId
        const user = await User.findById(userId);

         //If wrong password return error
         if(!(await user.comparePassword(currentPassword))){
            return res.status(401).json({error: 'Invalid username and password'})
        }
        
        //Update the users password
        user.password = newPassword
        await user.save()
        
        console.log('password updated')
        res.status(200).json({message : 'Password updated'})
    } catch (error) {
        console.log(error);
        res.status(500).json({error : 'Internal server error'})
    }
})


//Comment added for testing perpuse
module.exports = router