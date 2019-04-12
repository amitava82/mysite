const functions = require('firebase-functions');
const axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const config = functions.config();
const app = express();
const router = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

router.post('/contact', (req, res) => {
  const data = req.body;
  const { email, name, budget, duration, msg } = data;
  const captcha = data['g-recaptcha-response'];

  if (!captcha || !email || !name) {
    return res.status(400).send({ message: 'Bad request'});
  }

  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${config.captcha.secret}&response=${captcha}`;
  axios.post(url).then(
    ({ data }) => {
      if (data.success) {
        axios.post('https://getform.io/f/72329e8c-0ff4-4027-8b0b-4440adb1c5c7', {
          email, name, budget, duration, msg
        }).then(
          resp => res.send({ message: 'success' }),
          err => res.status(400).send({ message: err.message })
        );
      } else {
        res.status(400).send({ message: 'Invalid captcha code'});
      }
    }
  )
});


app.use('/api', router);

exports.main = functions.https.onRequest(app);