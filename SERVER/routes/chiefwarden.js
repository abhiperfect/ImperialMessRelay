const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
var _ = require("lodash");
const userModel = mongoose.model("userModel");
const postModel = mongoose.model("postModel");
require("../middlewares/flash");


// Parse incoming JSON requests
app.use(bodyParser.json());

// Handle POST requests to '/state'
app.post('/state', (req, res) => {
  const checkboxState = parseInt(req.body.checkboxState);

  // Process checkbox state here
  if (checkboxState === 1) {
    console.log('Checkbox checked');
  } else {
    console.log('Checkbox unchecked');
  }

  res.json({ message: 'Checkbox state received' });
});


module.exports = router;