const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

const Card = require('./models/card');

app.get('/ping', (req, res) => res.send('Server is running'));

// Create a card
app.post('/cards', async (req, res) => {
  const { title, description } = req.body;
  const card = new Card({ title, description });
  await card.save();
  res.status(201).send(card);
});

// Get all cards
app.get('/cards', async (req, res) => {
  const cards = await Card.find();
  res.status(200).send(cards);
});

// Get a card by title
app.get('/cards/:title', async (req, res) => {
  const { title } = req.params;
  const card = await Card.findOne({ title });
  if (!card) return res.status(404).send('Card not found');
  res.status(200).send(card);
});

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
