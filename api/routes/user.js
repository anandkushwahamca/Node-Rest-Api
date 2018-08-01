const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../models/user');

router.post("/signup", (req, res, next) => {
  User.find( {email: req.body.email })
  .exec()
  .then(user => {
  	  if(user.length >= 1){
  	  	return res.status(409).json({
  	  		status: 0,
  	  		message: 'Mail Exists'
  	  	});
  	  } else {
	  	  	bcrypt.hash(req.body.password, 10, (err, hash) => {
			if(err) {
				return res.status(500).json({
					error: err
				});
			} else {
				const user = new User({
					_id: new mongoose.Types.ObjectId(),
					name: req.body.name,
					email: req.body.email,
					password: hash
				});
				user
				.save()
				.then(result => {
					console.log(result);
					res.status(201).json({
						status: 1,
						message: 'User Created'
					});
				})
				.catch(err => {
					console.log(err);
					res.status(500).json({
						error: err
					});
				});
			}
		})
  	  }
  })	
});

router.delete('/:userId', (req, res, next)=> {
	User.remove( {_id: req.param.userId })
	.exec()
	.then(result => {
		res.status(200).json({
			Status: 1,
			message: 'User deleted' 
		})
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({
			error: err
		});
	});	
});

module.exports = router;