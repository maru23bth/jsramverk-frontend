'use client';

import { TextField, Box, Typography, IconButton, Tooltip } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import { useEffect, useState } from 'react';
import { fetchDocument } from '@/app/apiRequests';
import { addCollaborator, removeCollaborator, fetchCollaboratorIdByEmail } from '@/app/apiRequests';
import FeedbackAlert from '../../FeedbackAlert';

export default function Collaborator({ documentId }) {
    const [collaboratorEmail, setCollaboratorEmail] = useState('');
    /* Feedback Alert */
    const [feedback, setFeedback] = useState('');
    const [feedbackType, setFeedbackType] = useState('');
    const [collaborators, setCollaborators] = useState([]);

    useEffect(() => {
        // get collaborators
        fetchDocument(documentId)
        .then(result => { setCollaborators(result.collaborators) })
        .catch((error) => alert(error));
    }, [documentId]);

    const handleValueChange = (event) => {
        const value = event.target.value;
        setCollaboratorEmail(value);
    };

    const handleAddCollaborator = async () => {
        try {
            if (collaboratorEmail) {
                await addCollaborator(documentId, collaboratorEmail);

                // get collaborators
                fetchDocument(documentId)
                .then(result => { setCollaborators(result.collaborators) })
                .catch((error) => alert(error));

                setFeedback(`User '${collaboratorEmail}' can now edit this document`);
                setFeedbackType('success');
            } else {
                setFeedback('To add a collaborator, enter their registered email');
                setFeedbackType('error');
            }
        } catch (error) {
            setFeedback(error.message);
            setFeedbackType('error');
            console.error(error.message);
        }
    };

    // userId to delete as collaboratorEmail
    const handleRemoveCollaborator = async () => {
        try {
            if (collaboratorEmail) {
                // Fetch collaborator ID
                const { collaboratorId } = await fetchCollaboratorIdByEmail(collaboratorEmail);
                if (collaboratorId) {
                    const document = await removeCollaborator(documentId, collaboratorId);
                    if (document) {
                        setCollaborators(prevCollaborators => {
                            return prevCollaborators.filter((c) => c.id !== collaboratorId);
                        });
                        setFeedback(`User '${collaboratorEmail}' can not longer edit this document`);
                        setFeedbackType('success');
                    }

                } else {
                    setFeedback(`User could not be deleted`);
                    setFeedbackType('error');
                }
            } else {
                setFeedback('To remove a collaborator, enter their registered email');
                setFeedbackType('error');
            }
        } catch (error) {
            setFeedback(error.message);
            setFeedbackType('error');
            console.error(error.message);
        }
    };

    return (
        <Box>
            <Box sx={{ marginBottom: 1 }}>
                <Typography variant="h6" gutterBottom  sx={{ marginBottom: 2 }}>
                Collaborator
                </Typography>
                <TextField
                    label="Registered user email"
                    variant="outlined"
                    placeholder="email@example.com"
                    value={collaboratorEmail}
                    onChange={handleValueChange}
                />
                {/* Show list of collaborators */}
                <ul>
                    {
                        collaborators?.map((person) => (<li key={person.email}>{person.email}</li>))
                    }
                </ul>
            </Box>
            <Box sx={{ marginBottom: 1 }}>
                <Box>
                <Tooltip title="Add">
                    <IconButton edge="end" aria-label="add" onClick={handleAddCollaborator} sx={{ marginRight: 1 }}>
                        <PersonAddIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Remove">
                    <IconButton edge="end" aria-label="remove" onClick={handleRemoveCollaborator}>
                        <PersonRemoveIcon />
                    </IconButton>
                </Tooltip>
                </Box>
            </Box>
            {/* User feedback */}
            <FeedbackAlert feedback={feedback} feedbackType={feedbackType} />
        </Box>
    );
}