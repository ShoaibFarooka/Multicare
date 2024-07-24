const Sample = require("../models/sampleSchema");
const nodemailer = require("nodemailer");

const sampleController = {};

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_EMAIL_PASSWORD,
  },
});

sampleController.createSample = async (req, res) => {
  const { userID, date, time, address } = req.body;

  if (!userID || !date || !time || !address) {
    return res.status(400).json("All fields are required");
  }
  try {
    const newSample = new Sample({
      user: userID,
      date,
      time,
      address
    });

    await newSample.save();

    return res.status(200).json("BOOKED");
  } catch (err) {
    console.log('Eroor while creating sample collection request: ', err);
    return res.status(500).json("Internal server error");
  }
};

sampleController.fetchReports = async (req, res) => {
  const id = req.params.id;
  try {
    const reports = await Sample.find({ user: id });
    if (reports) {
      res.status(200).json(reports);
    }
    else {
      res.status(404).send('Reports not found!');
    }
  } catch (error) {
    console.log('Error in fetching reports: ', error);
    res.status(500).send('Internal Server Error!');
  }
};

sampleController.fetchSamples = async (req, res) => {
  try {
    const samples = await Sample.find().populate('user');
    if (samples) {
      res.status(200).json(samples);
    }
    else {
      res.status(404).send('Samples not found!');
    }
  } catch (error) {
    console.log('Error in fetching samples: ', error);
    res.status(500).send('Internal Server Error!');
  }
};

sampleController.acceptSample = async (req, res) => {
  const { id, email } = req.body;
  try {
    const updatedSample = await Sample.findOneAndUpdate(
      { _id: id },
      { status: 'accepted' },
      { new: true }
    );
    if (updatedSample) {
      const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: "Your Sample Collection Update!",
        text: `Your sample collection request is accepted so confirmed date is ${new Date(updatedSample.date).toISOString().split('T')[0]} and time is ${updatedSample.time}.`,
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("Error sending email:", error);
          return res.status(500).send("Error sending email.");
        }
        console.log("Email sent:", info.response);
        res.status(200).send('Sample updated and email sent!');
      });
    }
    else {
      res.status(404).send('Sample not found!');
    }
  } catch (error) {
    console.log('Error while updating sample status: ', error);
    res.status(500).send('Internal Server Error!');
  }
};

sampleController.rescheduleSample = async (req, res) => {
  const { id, date, time, email } = req.body;
  try {
    const updatedSample = await Sample.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          date,
          time,
          status: 'rescheduled'
        },
      },
      { new: true }
    );
    if (updatedSample) {
      const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: "Your Sample Collection Update!",
        text: `Your sample collection request is rescheduled so updated date is ${date} and time is ${time}.`,
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("Error sending email:", error);
          return res.status(500).send("Error sending email.");
        }
        console.log("Email sent:", info.response);
        res.status(200).send('sample updated and email sent!');
      });
    }
    else {
      res.status(404).send('Sample not found!');
    }
  } catch (error) {
    console.log('Error while updating sample schedule: ', error);
    res.status(500).send('Internal Server Error!');
  }
};

sampleController.sampleFeedback = async (req, res) => {
  const { id, feedback } = req.body;
  try {
    const updatedSample = await Sample.findOneAndUpdate(
      { _id: id },
      { report: feedback },
      { new: true }
    );
    if (updatedSample) {
      res.status(200).send('sample feedback added!');
    }
    else {
      res.status(404).send('Sample not found!');
    }
  } catch (error) {
    console.log('Error while updating sample status: ', error);
    res.status(500).send('Internal Server Error!');
  }
};


module.exports = sampleController;
