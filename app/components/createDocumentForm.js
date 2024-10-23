'use client';
import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import FeedbackAlert from '@/app/components/FeedbackAlert';
import { createDocument } from '@/app/apiRequests';

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

    const handleButtonClick = () => {

        const document = { 
            title: documentTitle, 
            content: documentContent 
        };

        createDocument(document).then(() => {
            setFeedback(`Document titled "${document.title}" has been created successfully.`);
            setFeedbackType('success');
            setDocumentTitle('');
            setDocumentContent('');
        }).catch((error)=> {
            setFeedback(`${error}`);
            setFeedbackType('error');
        });
    };

    return (
    <Box sx={{ padding: 2 }}>
        <Typography variant="h6" gutterBottom>
        Document
        </Typography>
        <FeedbackAlert feedback={feedback} feedbackType={feedbackType} />
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
