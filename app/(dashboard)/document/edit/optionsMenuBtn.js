'use client';
import * as React from 'react';
import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { createDocument, updateDocument } from '@/app/apiRequests';
import FeedbackAlert from '@/app/FeedbackAlert';


export default function CustomizedMenuBtn(props) {
    const title = props.data.title;
    const content = props.data.content
    const id = props.id
    const [feedback, setFeedback] = useState('');
    const [feedbackType, setFeedbackType] = useState('');
    // components data
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleSaveDocument = async () => {
        await createDocument(title, content, setFeedback, setFeedbackType)
    }
    const handleUpdateDocument = async () => {
        await updateDocument(id, title, content, setFeedback, setFeedbackType)
    }
    const handleClose = (event) => {
        setAnchorEl(null);
        event.target.innerText.includes("Save")? handleSaveDocument() : handleUpdateDocument()
    };

    return (
        <div>
        <Button
            id="demo-customized-button"
            aria-controls={open ? 'demo-customized-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            variant="contained"
            disableElevation
            onClick={handleClick}
            endIcon={<KeyboardArrowDownIcon />}
        >
            Options
        </Button>
        <Menu
            elevation={0}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
        >
            <MenuItem onClick={ (event) => {handleClose(event)} } disableRipple>
            <EditIcon />
            Update
            </MenuItem>
            <MenuItem onClick={ (event) => {handleClose(event)} } disableRipple>
            <FileCopyIcon />
            Save as new
            </MenuItem>
        </Menu>
        <FeedbackAlert feedback={feedback} feedbackType={feedbackType} />
        </div>
    );
}