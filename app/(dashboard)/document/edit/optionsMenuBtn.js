'use client';
import * as React from 'react';
import { useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { createDocument, updateDocument } from '@/app/apiRequests';
import FeedbackAlert from '@/app/components/FeedbackAlert';


export default function CustomizedMenuBtn(props) {
    const document = props.data.document;
    const id = props.data.id
    // feedback alert
    const [feedback, setFeedback] = useState('');
    const [feedbackType, setFeedbackType] = useState('');
    // components data
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    // call to api
    const handleSaveDocument = () => {
        createDocument(document).then(() => {
                setFeedback(`Document titled "${document.title}" has been created successfully.`);
                setFeedbackType('success');
            }
        ).catch((error) => {
                setFeedback(`${error}`);
                setFeedbackType('error');
            }
        );
    }

    const handleUpdateDocument = () => {
        updateDocument(id, document).then(() => {
            setFeedback(`Document titled "${document.title}" has been updated successfully.`);
            setFeedbackType('success');
        }).catch((error) => {
            setFeedback(`${error}`);
            setFeedbackType('error');
        });
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