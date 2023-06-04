import { useMutation, useQueryClient } from 'react-query';
import { useState } from 'react';
import { TextField, Button, Grid, Container } from '@material-ui/core';
import GroceryList from '../components/GroceryList';

const createGroceryItem = async (item) => {
  const response = await fetch('http://localhost:3001/groceryItems', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(item)
  });
  const data = await response.json();
  return data;
};

const HomePage = () => {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');

  const handleAddItem = async () => {
    if (!title || !amount) {
      return;
    }

    await createGroceryItem({ title, amount: parseInt(amount), bought: false });
    queryClient.invalidateQueries('groceryList');
    setTitle('');
    setAmount('');
  };

  return (
    <Container maxWidth="sm">
      <Grid container spacing={2} direction="column" alignItems="center">
        <Grid item>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item>
          <TextField
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item>
          <Button variant="contained" color="primary" onClick={handleAddItem}>
            Add Item
          </Button>
        </Grid>
        <Grid item>
          <GroceryList />
        </Grid>
      </Grid>
    </Container>
  );
};

export default HomePage;