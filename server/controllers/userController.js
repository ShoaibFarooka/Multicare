const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");
const userController = {}


userController.register = async (req, res) => {
  const { name, email, contact, age, gender, password } = req.body

  if (!name || !email || !contact || !age || !gender || !password) {
    return res.status(400).json("All fields are required")
  }

  const user = await User.findOne({ email })

  if (user) {
    return res.status(400).json("User already exist")
  }
  try {
    const saltValue = await bcryptjs.genSalt(10)

    const hashedPassword = await bcryptjs.hash(password, saltValue)

    const newUser = new User({
      name,
      age,
      gender,
      email,
      contact,
      password: hashedPassword,
    });



    const savedUser = await newUser.save()

    console.log("newUser, salt", saltValue, hashedPassword, newUser)


    return res.status(200).json("User registered successfully")
  } catch (err) {
    return res.status(500).json("Internal server error")
  }
}

userController.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "User does not exist", status: false });
    }

    const validatePassword = await bcryptjs.compare(password, user.password);

    if (!validatePassword) {
      return res.status(401).json({ message: "Invalid email or password", status: false });
    }

    const tokenData = {
      id: user._id,
      email: user.email,
      role: user.role,
      // You can include additional user-related data here if needed
    };

    const token = jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    return res.status(200).json({ message: "Login successful", status: true, token, user });
  } catch (err) {
    console.error("Error during login:", err);
    return res.status(500).json({ message: "Internal server error", status: false, error: err });
  }
};

userController.fetchDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' });
    if (doctors.length > 0) {
      res.status(200).json(doctors);
    }
    else {
      res.status(404).send('Doctors not found!');
    }
  } catch (error) {
    console.error('Error while fetching doctors: ', error);
    res.status(500).send('Internal Server Error!');
  }
};


module.exports = userController;