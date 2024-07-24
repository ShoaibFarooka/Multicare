const Appointment = require("../models/appointmentSchema");
require("dotenv").config({ path: './config.env' });
const nodemailer = require("nodemailer");
const appointmentController = {};

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_EMAIL_PASSWORD,
  },
});

appointmentController.createAppointment = async (req, res) => {
  const {
    name, email, contact, date, time, reason, user, doctor
  } = req.body;
  if (!name || !email || !contact || !date || !time || !reason || !user || !doctor) {
    console.log('Invalid data');
    return res.status(400).json("All fields are required");
  }

  try {
    const newAppointment = new Appointment({
      name,
      email,
      contact,
      date,
      time,
      reason,
      user,
      doctor
    });

    await newAppointment.save();

    return res.status(200).json("Appointment created successfully");
  } catch (err) {
    return res.status(500).json("Internal server error");
  }
};

appointmentController.fetchAppointments = async (req, res) => {
  const id = req.params.id;
  try {
    const appointments = await Appointment.find({ doctor: id });
    if (appointments) {
      res.status(200).json(appointments);
    }
    else {
      res.status(404).send('Appointments not found!');
    }
  } catch (error) {
    console.log('Error in fetching appointments: ', error);
    res.status(500).send('Internal Server Error!');
  }
};

appointmentController.acceptAppointment = async (req, res) => {
  const { id, email } = req.body;
  try {
    const updatedAppointment = await Appointment.findOneAndUpdate(
      { _id: id },
      { status: 'accepted' },
      { new: true }
    );
    if (updatedAppointment) {
      const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: "Your Appointment Update!",
        text: `Your appointment is accepted so confirmed date is ${new Date(updatedAppointment.date).toISOString().split('T')[0]} and time is ${updatedAppointment.time}.`,
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("Error sending email:", error);
          return res.status(500).send("Error sending email.");
        }
        console.log("Email sent:", info.response);
        res.status(200).send('Appointment updated and email sent!');
      });
    }
    else {
      res.status(404).send('Appointment not found!');
    }
  } catch (error) {
    console.log('Error while updating appointment status: ', error);
    res.status(500).send('Internal Server Error!');
  }
};

appointmentController.rescheduleAppointment = async (req, res) => {
  const { id, date, time, email } = req.body;
  try {
    const updatedAppointment = await Appointment.findOneAndUpdate(
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
    if (updatedAppointment) {
      const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: "Your Appointment Update!",
        text: `Your appointment is rescheduled so updated date is ${date} and time is ${time}.`,
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("Error sending email:", error);
          return res.status(500).send("Error sending email.");
        }
        console.log("Email sent:", info.response);
        res.status(200).send('Schedule updated and email sent!');
      });
    }
    else {
      res.status(404).send('Appointment not found!');
    }
  } catch (error) {
    console.log('Error while updating appointment schedule: ', error);
    res.status(500).send('Internal Server Error!');
  }

};


module.exports = appointmentController;
