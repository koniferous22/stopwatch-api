const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const DB_URL = 'ayo';
mongoose.connect(DB_URL);

const User = mongoose.model('User', {
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  intervals: [{
    username: {
      type: String,
      required: true
    },
    start: {
      type: Date,
      required: true,
    },
    end: {
      type: Date,
      required: true
    },
    working: {
      type: Boolean,
      required: true
    }
  }]
}, 'Users');

app.use(bodyParser.json());

const app = express();

const auth = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.find({ username });
    const isPwdValid = await bcrypt.compare(password, user.password);
    if (!isPwdValid) {
      res.status(401).send('Ayo, wrong pwd');
    }
    req.user = user;
    next();
  } catch(e) {
    res.status(400).send('Ayo sth wrong');
  }
}

app.post('/intervals', auth, async (req, res) => {
  res.status(200).send(req.user?.intervals);
});

app.post('/submit', auth, async (req, res) => {
  const user = req.user;
  const newIntervals = req.body.intervals;
  if (!user) {
    throw new Error('no user');
  }
  if (!Array.isArray(newIntervals)) {
    throw new Error('data not attached as array');
  }
  user.intervals.concat(newIntervals);
  user.save().then(() => res.status(200).send('Submitted')).catch((e) => res.status(400).send(e));
});

const PORT = 2999;
app.listen(PORT);
