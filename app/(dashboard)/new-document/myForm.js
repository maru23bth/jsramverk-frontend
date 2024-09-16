"use client";
import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';

export default function MyForm() {
    // state hook input:value
    const [inputValue, setInputValue] = useState('');
    // state hook input:text
    const [textValue, setTextValue] = useState('');

    const handleInputChange = (event) => {
    setInputValue(event.target.value);
    };

    const handleTextChange = (event) => {
    setTextValue(event.target.value);
    };

    const handleButtonClick = () => {
    console.log('Input Value:', inputValue);
    console.log('Text Value:', textValue);
    // Additional logic for button click can go here
    };

    return (
    <Box sx={{ padding: 2 }}>
        <Typography variant="h6" gutterBottom>
        Create new document
        </Typography>
        <Box sx={{ marginBottom: 2 }}>
        <TextField
            label="Title"
            variant="outlined"
            value={inputValue}
            onChange={handleInputChange}
            fullWidth
        />
        </Box>
        <Box sx={{ marginBottom: 2 }}>
        <TextField
            label="Description"
            variant="outlined"
            multiline
            rows={4}
            value={textValue}
            onChange={handleTextChange}
            fullWidth
        />
        </Box>
        <Button
        variant="contained"
        color="primary"
        onClick={handleButtonClick}
        >
        Submit
        </Button>
    </Box>
    );
}