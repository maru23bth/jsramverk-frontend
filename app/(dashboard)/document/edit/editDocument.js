'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { TextField, Box, Typography, CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';
import CustomizedMenuBtn from './optionsMenuBtn';
import { fetchGraphQL } from '@/lib/graphql'
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

    // Define client socket
    const socket = useRef(null);

    // Handle comments
    useEffect(() => {
        /* Fetch using GraphQL */
        const getDocumentCommentsQuery = `
            query getDocumentComments($id: String!) {
                getDocumentById(id: $id) {
                    comments {
                        id        
                        author {
                            username
                            email
                        }     
                        content   
                        location
                    }
                }
            }
        `;
        fetchGraphQL(getDocumentCommentsQuery, { id: documentId })
            .then(result => {
                console.log('GraphQL Data:', result.data);
                const comments = result.data.getDocumentById.comments
                { setDocumentComments(comments) }
            })
            .catch(
                (error) => console.error(error)
            );
    }, [documentId, commentChange])

    // Handle socket
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

        /* CodeMode */
        // Listen for `change-to-code-mode` events from the server
        socket.current.on('change-to-code-mode', ({ documentId: receivedDocId, codeMode }) => {
            // Ensure the event is for the current document
            if (receivedDocId === documentId) {
                setCodeMode(codeMode);  // Update local state to reflect the new mode
            }
        });

        // Listen for `add-comment-code-mode` events from the server
        socket.current.on('add-comment-code-mode', ({ documentId: receivedDocId, location }) => {
            // Ensure the event is for the current document
            if (receivedDocId === documentId) {
                setCommentChange(commentChange => !commentChange);  // Update local state to reflect change in comments
                alert(`New comment at line ${location}`);
            }
        });
         // Listen for `remove-comment-code-mode` events from the server
        socket.current.on('remove-comment-code-mode', ({ documentId: receivedDocId }) => {
            // Ensure the event is for the current document
            if (receivedDocId === documentId) {
                setCommentChange(commentChange => !commentChange);  // Update local state to reflect change in comments
                alert(`Comment has been removed`);
            }
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
        // Toggle the codeMode state and get the new state value
        setCodeMode(prevCodeMode => {
            const newCodeMode = !prevCodeMode;
    
            // Emit the new codeMode value via the socket
            socket.current.emit('change-to-code-mode', { documentId, codeMode: newCodeMode });
    
            return newCodeMode;
        });
    };
    

    const handleTitleChange = (title) => {
        setDocumentTitle(title);
        socket.current.emit('document-title-change', { documentId, title });
        setDocSavingStatus('Saving changes ...');
    };

    const handleContentChange = (content) => {
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
        // send to server
        socket.current.emit('add-comment-code-mode', { documentId, location });
    }
    /* Delete comment via CodeMode */
    const handleDeleteComment = async (comment) => {
        await deleteComment(documentId, comment);
        setCommentChange(commentChange => !commentChange); 
        // send to server
        socket.current.emit('remove-comment-code-mode', { documentId });
        
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
            <Collaborator documentId={ documentId } />
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
                        onChange={handleContentChange}
                        onTitleChange={handleTitleChange}
                    /> :
                    <>
                        <Box sx={{ marginBottom: 2 }}>
                            <TextField
                                label="Title"
                                variant="outlined"
                                value={documentTitle}
                                onChange={(event) => { handleTitleChange(event.target.value)}}
                                fullWidth
                            />
                        </Box>
                        <TextField
                            label="Content"
                            variant="outlined"
                            multiline
                            rows={10}
                            value={documentContent}
                            onChange={(event) => {handleContentChange(event.target.value)}}
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
