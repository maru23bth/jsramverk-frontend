'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { TextField, Box, Typography } from '@mui/material';
import CustomizedMenuBtn from './optionsMenuBtn';
import { fetchDocument } from '@/app/apiRequests';

export default function EditDocument() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const [documentTitle, setDocumentTitle] = useState('');
    const [documentContent, setDocumentContent] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const document = { title: documentTitle, content: documentContent };


    useEffect(() => {
        let errorFetching = false;
        if (id) {
            fetchDocument(id).then(({title, content}) => { 
                setDocumentTitle(title);
                setDocumentContent(content); 
            }).catch(() => {
                errorFetching != errorFetching;
                setErrorMessage(`Failed to fetch document`);
            });
        }
        }, [id]);

    const handleTitleChange = (event) => {
        setDocumentTitle(event.target.value);
    };

    const handleContentChange = (event) => {
        setDocumentContent(event.target.value);
    };

    if (!document) return <div>Loading...</div>;
    if (errorMessage) return <div>{errorMessage}</div>;

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
        <CustomizedMenuBtn data={ { 'document': document, 'id': id } } />
    </Box>
    );
}
