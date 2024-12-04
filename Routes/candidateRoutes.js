const express = require('express')
const router = express.Router();
const Candidate = require('./../models/candidate')
const User = require('./../models/user')
const {jwtAuthMiddleware, generateToken} = require('./../jwt')

const checkAdminRole = async(userID) =>{
  try {
    const user = await User.findById(userID);
    return user.role === 'admin'
  } catch (error) {
    return false;
  }
}

//Post method to create a candidate
router.post('/', jwtAuthMiddleware,async (req, res) => {
    try {
      if(! await checkAdminRole(req.user.id)){
        res.status(403).json({message :'user does not have admin role'});
      }
      const data = req.body;
  
      //Create a new Candidate document using the mongoose model
      const newCandidate = new Candidate(data)
  
      //Save the new user to the database
      const response = await newCandidate.save();
      console.log('data saved');
      res.status(200).json({response})
  
    } catch (error) {
      console.log(error);
      res.status(500).json({error : 'Internal server error'})
    }
  })

  
//PUT methode to update candidate data
router.put('/:candidateID', jwtAuthMiddleware,async(req, res)=>{
  try {
    if(! await checkAdminRole(req.user.id)){
      res.status(403).json({message :'user does not have admin role'});
    }

      const candidateID = req.params.candidateID //Extract the candidateID from URL parameter
      const updateCandidateData = req.body //updated data for the person

      const response = await Candidate.findByIdAndUpdate(candidateID, updateCandidateData,{
          new : true,
          runValidators : true
      })
      console.log('Candidate data updated')
      res.status(200).json(response)

      if(!response){
          return res.status(404).json({error : 'Candidate not found'})
      }
  } catch (error) {
      console.log(error);
      res.status(500).json({error : 'Internal server error'})
  }
})

//DELETE methode to delete candidate data
router.delete('/:candidateID',jwtAuthMiddleware, async(req, res)=>{
  try {
    if(! await checkAdminRole(req.user.id)){
      res.status(403).json({message :'user does not have admin role'});
    }
      const candidateID = req.params.candidateID //Extract the candidateID from URL parameter
  
      const response = await Candidate.findByIdAndDelete(candidateID)
      console.log('Candidate data deleted')
      res.status(200).json(response)

      if(!response){
          return res.status(404).json({error : 'Candidate not found'})
      }
  } catch (error) {
      console.log(error);
      res.status(500).json({error : 'Internal server error'})
  }
})

//let's start voting
router.post('/vote/:candidateID', jwtAuthMiddleware, async(req, res) => {
  try {
    const candidateID = req.params.candidateID;
    const userID = req.user.id;

    const candidate = await Candidate.findById(candidateID)
    const user = await User.findById(userID)

    if(!candidate){
      return res.status(404).json({error : 'candidate not found'})
    }
    if(!user){
    return res.status(404).json({error : 'user not found'})
    }
    //Conditions-->1. user can only vote once   2. admin can't vote
    if(user.isVoted){
      return res.status(400).json({error : 'you have already voted'})
    }

    if(user.role == 'admin'){
      return res.status(400).json({error : 'admin is not allowed'})
    }
     
    //update the candidate to record the votes
    candidate.votes.push({user :userID});
    candidate.voteCount++;
    await candidate.save();

    //update the user documents
    user.isVoted = true;
    await user.save();

    res.status(200).json({message : 'vote recorded succes[sfully'})

  } catch (error) {
    console.log(error);
    res.status(500).json({error : 'Internal server error'})
  }
})

//vote count
router.get('/vote/count', async(req, res) =>{
  try {
    //find all candidates and sort their voteCount in descending order
    const candidate = await Candidate.find().sort({voteCount: 'desc'});

    //map the candidate to only return their name and voteCount
    const voteRecord = candidate.map((data)=>{
      return{
        party : data.party,
        count : data.voteCount
      }
    })

    return res.status(200).json({voteRecord})
  } catch (error) {
    console.log(error);
    res.status(500).json({error : 'Internal server error'})
  }
})

module.exports = router