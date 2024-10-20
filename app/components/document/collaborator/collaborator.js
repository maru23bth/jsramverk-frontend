'use client';

import { TextField, Box, Button, Typography, IconButton, Tooltip } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import { useState } from 'react';
import { addCollaborator, removeCollaborator } from '@/app/apiRequests';
import FeedbackAlert from '../../FeedbackAlert';
import { useUserStore } from '@/lib/auth';

export default function Collaborator({ documentId }) {
    const [collaborator, setCollaborator] = useState('');
    /* Feedback Alert */
    const [feedback, setFeedback] = useState('');
    const [feedbackType, setFeedbackType] = useState('');

    const handleValueChange = (event) => {
        const value = event.target.value;
        setCollaborator(value);
    };

    const handleAddCollaborator = async () => {
        try {
            if (collaborator) {
                await addCollaborator(documentId, collaborator);
                setFeedback(`User '${collaborator}' can now edit this document`);
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

    // i need current user
    // userId to delete as collab
    const handleRemoveCollaborator = async () => {
        try {
            if (collaborator) {
                await addCollaborator(documentId, collaborator);
                setFeedback(`User '${collaborator}' can now edit this document`);
                setFeedbackType('success');
            }
            setFeedback('To remove a collaborator, enter their registered email');
            setFeedbackType('error');
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
                    value={collaborator}
                    onChange={handleValueChange}
                />
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