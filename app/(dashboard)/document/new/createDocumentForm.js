'use client';
import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';

export default function CreateDocumentForm() {
    const [documentTitle, setDocumentTitle] = useState('');
    const [documentContent, setDocumentContent] = useState('');
    const [feedback, setFeedback] = useState('');
    const [feedbackType, setFeedbackType] = useState('');

    const handleTitleChange = (event) => {
    setDocumentTitle(event.target.value);
    };

    const handleContentChange = (event) => {
    setDocumentContent(event.target.value);
    };

    const handleButtonClick = async () => {
    const url = 'https://jsramverk-maru23-dxfhbmhkbdd4e4ep.northeurope-01.azurewebsites.net';
    const data = { title: documentTitle, content: documentContent };

    try {
        const response = await fetch(`${url}/documents`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        });

        if (response.ok) {
            setFeedback(`Document titled "${data.title}" has been created successfully.`);
            setFeedbackType('success');
            setDocumentTitle('');
            setDocumentContent('');
        } else {
            setFeedback('Failed to create document.');
            setFeedbackType('error');
        }
    } catch (error) {
        setFeedback('Error creating document.');
        setFeedbackType('error');
        console.log("Error creating document:", error);
    }
    };

    return (
    <Box sx={{ padding: 2 }}>
        <Typography variant="h6" gutterBottom>
        Document
        </Typography>{/* feedback && () - Conditional Rendering: The alert is only rendered if feedback is truthy */}
        {feedback && (
            <Alert severity={feedbackType} sx={{ marginBottom: 2 }}>
                {feedback}
            </Alert>
        )}
        <Box sx={{ marginBottom: 2 }}>
        <TextField
            label="Title"
            variant="outlined"
            value={documentTitle}
            onChange={handleTitleChange}
            fullWidth
        />
        </Box>
        <Box sx={{ marginBottom: 2 }}>
        <TextField
            label="Content"
            variant="outlined"
            multiline
            rows={4}
            value={documentContent}
            onChange={handleContentChange}
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
