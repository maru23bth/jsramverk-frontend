'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { TextField, Box, Typography } from '@mui/material';
import CustomizedMenuBtn from './optionsMenuBtn';
import { fetchDocument } from '@/app/apiRequests';
// socket
import { io } from "socket.io-client";

export default function EditDocument() {
    const searchParams = useSearchParams();
    const documentId = searchParams.get('id');
    const [documentTitle, setDocumentTitle] = useState('');
    const [documentContent, setDocumentContent] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const document = { 
        title: documentTitle,
        content: documentContent
    };

    const socket = useRef(null);

    // useEffect handling socket
    useEffect(() => {
        socket.current = io('http://localhost:1337');

        // send document id to the server-socket
        socket.current.emit('my-create-room', documentId);

        socket.current.on('document-content-change', ({ content }) => {
            setDocumentContent(content);
        });

        socket.current.on('document-title-change', ({ title }) => {
            setDocumentTitle(title);
        });
        // triggered on unmount
        return () => {
            socket.current.disconnect();
        }
        
    }, [documentId]);


    useEffect(() => {
        let errorFetching = false;
        if (documentId) {
            fetchDocument(documentId).then(({title, content}) => { 
                setDocumentTitle(title);
                setDocumentContent(content); 
            }).catch(() => {
                errorFetching != errorFetching;
                setErrorMessage(`Failed to fetch document`);
            });
        }
        }, [documentId]);

    const handleTitleChange = (event) => {
        const title = event.target.value;
        setDocumentTitle(title);
        socket.current.emit('document-title-change', {documentId, title});
    };

    const handleContentChange = (event) => {
        const content = event.target.value;
        // update locally
        setDocumentContent(content);
        // send to server
        socket.current.emit('document-content-change', {documentId, content});
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
        <CustomizedMenuBtn data={ { 'document': document, 'documentId': documentId } } />
    </Box>
    );
}
