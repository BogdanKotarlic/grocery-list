import { useQuery, useQueryClient } from 'react-query';
import { useState } from 'react';
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, TextField, Checkbox } from '@material-ui/core';
import { Delete, Edit, Check } from '@material-ui/icons';

const fetchGroceryList = async () => {
  const response = await fetch('http://localhost:3001/groceryItems');
  const data = await response.json();
  return data;
};

const updateGroceryItem = async (itemId, updates) => {
  const response = await fetch(`http://localhost:3001/groceryItems/${itemId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });
  const data = await response.json();
  return data;
};

const deleteGroceryItem = async (itemId) => {
    const response = await fetch(`http://localhost:3001/groceryItems/${itemId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete item');
    }
};

const GroceryList = () => {
  const queryClient = useQueryClient();
  const [editItemId, setEditItemId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [filter, setFilter] = useState('');

  const handleEditItem = (item) => {
    setEditItemId(item.id);
    setEditTitle(item.title);
    setEditAmount(item.amount);
  };

  const handleUpdateItem = async () => {
    if (!editTitle || !editAmount) {
      return;
    }

    await updateGroceryItem(editItemId, { title: editTitle, amount: parseInt(editAmount) });
    queryClient.invalidateQueries('groceryList');
    setEditItemId(null);
    setEditTitle('');
    setEditAmount('');
  };

  const handleDeleteItem = async (itemId) => {
    await deleteGroceryItem(itemId);
    queryClient.invalidateQueries('groceryList');
  };

  const handleToggleBought = async (itemId, bought) => {
    await updateGroceryItem(itemId, { bought: !bought });
    queryClient.invalidateQueries('groceryList');
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const { data, isLoading, error } = useQuery('groceryList', fetchGroceryList);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>An error occurred: {error.message}</p>;
  }

  const filteredData = filter
    ? data.filter((item) => item.title.toLowerCase().includes(filter.toLowerCase()))
    : data;

  return (
    <div>
        <TextField
            label="Filter by name"
            value={filter}
            onChange={handleFilterChange}
            fullWidth
            style={{ marginBottom: '16px' }}
        />
        <List style={{width: '400px'}}>
        {filteredData.map((item) => (
            <ListItem key={item.id}>
            {editItemId === item.id ? (
                <>
                <TextField
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    fullWidth
                />
                <TextField
                    type="number"
                    value={editAmount}
                    onChange={(e) => setEditAmount(e.target.value)}
                    fullWidth
                />
                <IconButton edge="end" aria-label="Save" onClick={handleUpdateItem}>
                    <Check />
                </IconButton>
                </>
            ) : (
                <>
                <Checkbox
                    checked={item.bought}
                    style={{marginRight: '10px'}}
                    onChange={() => handleToggleBought(item.id, item.bought)}
                />
                <ListItemText
                    primary={item.bought ? <del>{item.title}</del> : item.title}
                    secondary={`Amount: ${item.amount}`}
                />
                <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="Edit" disabled={item.bought} style={{ color: item.bought ? 'rgba(0, 0, 0, 0.26)' : 'inherit' }} onClick={() => handleEditItem(item)}>
                    <Edit />
                    </IconButton>
                    <IconButton edge="end" aria-label="Delete" onClick={() => handleDeleteItem(item.id)}>
                    <Delete />
                    </IconButton>
                </ListItemSecondaryAction>
                </>
            )}
            </ListItem>
        ))}
        </List>
    </div>
    
  );
};

export default GroceryList;