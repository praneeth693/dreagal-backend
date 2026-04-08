const express = require("express");
const router = express.Router();

router.post("/login", (req, res) => {
  const { password } = req.body;

  console.log("Entered:",password);
  console.log("ENV:",process.env.ADMIN_PASSWORD);
  
//  if(!password){
//   return res.status(400).json({message:"password required"});
//  }


  if (password === process.env.ADMIN_PASSWORD) {
    return res.json({ message: "Admin authenticated" ,success:true});
  }

  res.status(401).json({ message: "Invalid password",success:false });
});

module.exports = router;