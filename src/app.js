const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const usersRouter = require('./routes/users');
const sessionsRouter = require('./routes/sessions');
require('./passport/strategies');

dotenv.config();

const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());

// API routes
app.use('/api/users', usersRouter);
app.use('/api/sessions', sessionsRouter);

// Basic health
app.get('/', (req, res) => res.json({ ok: true }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

// DB connect helper
async function connectDB(uri) {
  await mongoose.connect(uri, { family: 4 });
}

module.exports = { app, connectDB };
