/* A custom component that gives a feedback to user
    Important!!! 
    const [feedback, setFeedback] = useState('');
    const [feedbackType, setFeedbackType] = useState('');
    must be withing parent component
    Example:
    const ParentComponent = () => {
        const [feedback, setFeedback] = useState('');
        const [feedbackType, setFeedbackType] = useState('');
    
    Add <FeedbackAlert feedback={feedback} feedbackType={feedbackType} /> component to notify the user with the feedback.
 */

import React from 'react';
import Alert from '@mui/material/Alert';

const FeedbackAlert = ({ feedback, feedbackType }) => {
    return (
        feedback && (
            <Alert severity={feedbackType} sx={{ marginBottom: 2 }}>
                {feedback}
            </Alert>
        )
    );
};

export default FeedbackAlert;
