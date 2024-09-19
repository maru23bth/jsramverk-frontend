'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';

export default function EditDocument() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const url = 'https://jsramverk-maru23-dxfhbmhkbdd4e4ep.northeurope-01.azurewebsites.net';

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

    useEffect(() => {
    if (id) {
        // Fetch the document data using the id
        fetch(`${url}/documents/${id}`)
        .then(response => response.json())
        .then(({title, content}) => { 
            setDocumentTitle(title);
            setDocumentContent(content); 
        });
    }
    }, [id]);

    const handleSubmit = async () => {
    const updatedDocument = {
        title: documentTitle,
        content: documentContent,
    };

    try {
        const response = await fetch(`${url}/documents/${id}`, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedDocument),
        });

        if (response.ok) {
            setFeedback(`Document titled "${documentTitle}" has been updated successfully.`);
            setFeedbackType('success');
        } else {
            setFeedback('Failed to update document.');
            setFeedbackType('error');
        }
    } catch (error) {
        setFeedback('Error updating document.');
        setFeedbackType('error');
        console.log("Error updating document:", error);
    }

    // router.push('/');
    };

    if (!document) return <div>Loading...</div>;

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
        onClick={handleSubmit}
        >
        Submit
        </Button>
    </Box>
    );
}
