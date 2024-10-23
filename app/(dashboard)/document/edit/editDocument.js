'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { TextField, Box, Typography, CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';
import CustomizedMenuBtn from './optionsMenuBtn';
import { fetchDocument, updateDocument, addComment, deleteComment } from '@/app/apiRequests';
// socket
import { io } from "socket.io-client";
import { useUserStore } from '@/lib/auth';
import Collaborator from '@/app/components/document/collaborator/collaborator';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import CodeMode from '@/components/code-mode/CodeMode';

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
    const [codeMode, setCodeMode] = useState(false);
    const [documentComments, setDocumentComments] = useState([]);
    const [commentChange, setCommentChange] = useState(false);

    const document = {
        title: documentTitle,
        content: documentContent
    };

    // updateDocument('67178dd44f57ed783d0308e3',  { "comments": [] });


    // Define client socket
    const socket = useRef(null);
    // Comments
    // const comments = useRef([]);
    // Handle comments
    useEffect(() => {
        /* fetch document object from db */
        fetchDocument(documentId)
        .then(result => setDocumentComments(result.comments))
        .catch((error) => alert(error));
            // alert(`Current doc: ${JSON.stringify(result)}`);
    }, [documentId, commentChange])

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

    }, [documentId, router]);


    useEffect(() => {
        let errorFetching = false;
        if (documentId) {
            fetchDocument(documentId).then(({ title, content }) => {
                setDocumentTitle(title);
                setDocumentContent(content);
            }).catch(() => {
                errorFetching != errorFetching;
                setErrorMessage(`Failed to fetch document`);
            });
        }
    }, [documentId]);

    /* Toggle code-mode */
    const toggleCodeMode = () => {
        setCodeMode(!codeMode);
    }

    const handleTitleChange = (event) => {
        const title = event.target.value;
        setDocumentTitle(title);
        socket.current.emit('document-title-change', { documentId, title });
        setDocSavingStatus('Saving changes ...');
    };

    const handleContentChange = (event) => {
        const content = event.target.value;
        // update locally
        setDocumentContent(content);
        // send to server
        socket.current.emit('document-content-change', { documentId, content });
        setDocSavingStatus('Saving changes ...');
    };

    /* Add comment via CodeMode */
    const handleAddComment = async (content, location) => {
        await addComment(documentId, content, location);
        setCommentChange(commentChange => !commentChange);
    }
    /* Delete comment via CodeMode */
    const handleDeleteComment = async (comment) => {
        await deleteComment(documentId, comment);
        setCommentChange(commentChange => !commentChange); 
    }
    /* Save document via CodeMode */
    const handleOnSave = async (content, title, documentComments) => {
        setDocSavingStatus('Saving changes ...');
        const document = { 
            type: 'code', 
            content, 
            title, 
            comments: documentComments
        }
        await updateDocument(documentId, document);
        setCommentChange(commentChange => !commentChange);
        setDocSavingStatus('');
    }


    if (!document) return <div>Loading...</div>;
    if (errorMessage) return <div>{errorMessage}</div>;

    return (
        <Box sx={{ padding: 2 }}>
            {/* Collaborator handling */}
            <Collaborator documentId={documentId} socket={socket.current} />
            {/* Toggle button */}
            <FormControl component="fieldset" variant="standard">
                <FormLabel component="legend">Switch to code-mode</FormLabel>
                <FormControlLabel
                    control={
                        <Switch checked={codeMode} onChange={toggleCodeMode} />
                    }
                    label="Code Mode"
                />
            </FormControl>
            <Typography variant="h6" gutterBottom>
                Document
            </Typography>
            {docSavingStatus && <Box sx={{ marginBottom: 2 }}>{docSavingStatus}</Box>}
            {docSavingStatus && <Box sx={{ margin: 4 }}><CircularProgress size="2rem" /></Box>}
            <Box sx={{ marginBottom: 2 }}>
                {/* Render code-mode or title/content editor */}
                { codeMode ?
                    <CodeMode 
                        title={documentTitle}
                        code={documentContent}
                        comments={documentComments}
                        onSave={handleOnSave}
                        addComment={handleAddComment}
                        deleteComment={handleDeleteComment}
                    /> :
                    <>
                        <Box sx={{ marginBottom: 2 }}>
                            <TextField
                                label="Title"
                                variant="outlined"
                                value={documentTitle}
                                onChange={handleTitleChange}
                                fullWidth
                            />
                        </Box>
                        <TextField
                            label="Content"
                            variant="outlined"
                            multiline
                            rows={10}
                            value={documentContent}
                            onChange={handleContentChange}
                            fullWidth
                        />
                    </>
                }
            </Box>
            {/* Button save or update */}
            <CustomizedMenuBtn data={{ 'document': document, 'documentId': documentId }} />
        </Box>
    );
}
