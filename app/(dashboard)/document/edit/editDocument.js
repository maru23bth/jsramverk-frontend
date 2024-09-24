'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { TextField, Box, Typography } from '@mui/material';
import CustomizedMenuBtn from './optionsMenuBtn';

export default function EditDocument() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const url = 'https://jsramverk-maru23-dxfhbmhkbdd4e4ep.northeurope-01.azurewebsites.net';

    const [documentTitle, setDocumentTitle] = useState('');
    const [documentContent, setDocumentContent] = useState('');
    const document = { title: documentTitle, content: documentContent };

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

    if (!document) return <div>Loading...</div>;

    return (
        <Box sx={{ padding: 2 }}>
        <Typography variant="h6" gutterBottom>
        Document
        </Typography>
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
        <CustomizedMenuBtn data={document} id={id} />
    </Box>
    );
}
