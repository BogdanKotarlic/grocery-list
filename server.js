const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors());

let groceryItems = [
  { id: 1, title: 'Apples', amount: 2, bought: false },
  { id: 2, title: 'Milk', amount: 1, bought: false },
  { id: 3, title: 'Bread', amount: 1, bought: true }
];

app.use(express.json());

app.get('/groceryItems', (req, res) => {
  res.json(groceryItems);
});

app.post('/groceryItems', (req, res) => {
  const newItem = { id: Date.now(), ...req.body };
  groceryItems.push(newItem);
  res.json(newItem);
});

app.put('/groceryItems/:id', (req, res) => {
  const { id } = req.params;
  const itemIndex = groceryItems.findIndex((item) => item.id.toString() === id);

  if (itemIndex !== -1) {
    groceryItems[itemIndex] = { ...groceryItems[itemIndex], ...req.body };
    res.json(groceryItems[itemIndex]);
  } else {
    res.status(404).json({ error: 'Item not found' });
  }
});

app.delete('/groceryItems/:id', (req, res) => {
  const { id } = req.params;
  groceryItems = groceryItems.filter((item) => item.id.toString() !== id);
  res.json({ message: 'Item deleted successfully' });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});