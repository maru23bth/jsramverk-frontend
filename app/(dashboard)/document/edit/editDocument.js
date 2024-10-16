'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { TextField, Box, Typography, CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';
import CustomizedMenuBtn from './optionsMenuBtn';
import { fetchDocument } from '@/app/apiRequests';
// socket
import { io } from "socket.io-client";
import { useUserStore } from '@/lib/auth';

// Get token directly from Zustand or localStorage if needed
const getToken = () => useUserStore.getState().token;

export default function EditDocument() {
    // router to be able to redirect between pages
    const router = useRouter();
    const searchParams = useSearchParams();
    const documentId = searchParams.get('id');
    const [documentTitle, setDocumentTitle] = useState('');
    const [documentContent, setDocumentContent] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [docSavingStatus, setDocSavingStatus] = useState('');

    const document = { 
        title: documentTitle,
        content: documentContent
    };

    // Define client socket
    const socket = useRef(null);


    // useEffect handling socket
    useEffect(() => {

        const url = process.env.NEXT_PUBLIC_API_URL;

        // set token
        const token = getToken();

        if (!token) {
            // Redirect to auth if no token is found
            router.push('/auth');
        }

        socket.current = io(url,
            {
                auth: {
                    token: token
                }
            }
        );

        // Triggered if middleware throws an error
        // next(new Error(''));
        socket.current.on('connect_error', (err) => {
            alert(`Socket connection error: ${err.message}`);
        });

        // send document id to the server-socket
        socket.current.emit('my-create-room', documentId);

        socket.current.on('document-content-change', ({ content }) => {
            setDocumentContent(content);
        });

        socket.current.on('document-title-change', ({ title }) => {
            setDocumentTitle(title);
        });

        socket.current.on('document-saved', () => {
            setDocSavingStatus('');
        });

        // triggered on unmount
        return () => {
            if (socket.current) {
                socket.current.disconnect();
            }
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
        setDocSavingStatus('Saving changes ...');
    };

    const handleContentChange = (event) => {
        const content = event.target.value;
        // update locally
        setDocumentContent(content);
        // send to server
        socket.current.emit('document-content-change', {documentId, content});
        setDocSavingStatus('Saving changes ...');
    };

    if (!document) return <div>Loading...</div>;
    if (errorMessage) return <div>{errorMessage}</div>;

    return (
        <Box sx={{ padding: 2 }}>
        <Typography variant="h6" gutterBottom>
        Document
        </Typography>
        { docSavingStatus && <Box sx={{ marginBottom: 2 }}>{docSavingStatus}</Box> }
        { docSavingStatus && <Box sx={{ margin: 4 }}><CircularProgress size="2rem" /></Box> }
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
