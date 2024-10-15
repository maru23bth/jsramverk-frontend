'use client';

import React, { useRef, useState, useEffect, use } from 'react';
import Editor from '@monaco-editor/react';
import ButtonGroup from '@mui/material/ButtonGroup';
import LoadingButton from '@mui/lab/LoadingButton';
import SendIcon from '@mui/icons-material/Send';
import SaveIcon from '@mui/icons-material/Save';
import TextField from '@mui/material/TextField';


/**
 * React component for a code editor with run and save buttons.
 * 
 * @param {Object} props - The props object of the component.
 * @param {string} props.code - The code to display in the editor.
 * @param {Function} props.onSave - The function to call when the save button is clicked.
 * @param {Function} props.onChange - The function to call when the code changes. (value, event) => void
 * @param {string} [props.title='Title'] - The title of the code editor.
 * @param {Function} [props.onTitleChange] - The function to call when the title changes. (title, event) => void
 * @returns {JSX.Element} - The JSX element to render.
 * @example
 * <CodeMode code="console.log('Hello World')" onSave={code => alert(`The code is:\n${code}`)} />
 */
export default function CodeMode({ code, onSave, onChange, title = 'Title', onTitleChange }) {
    const [loadingCode, setLoadingCode] = useState(false);
    const [loadingSave, setLoadingSave] = useState(false);
    const [internalTitle, setInternalTitle] = useState(title);
    const editorRef = useRef(null);
    


    useEffect(() => {
        console.log('Title changed', title);
        setInternalTitle(title);
    }, [title]);

    async function saveCode() {
        if (!onSave) {
            alert('Save not implemented');
            return;
        };

        try {
            setLoadingSave(true);
            await onSave(editorRef.current.getValue(), title);                    
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingSave(false);
        }
        
    };

    async function runCode(event) {
        try {
            setLoadingCode(true);
            const code = editorRef.current.getValue();

            console.log(code);
            const response = await fetch('https://execjs.emilfolino.se/code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code: btoa(code) }),
            });
            const data = await response.json();
            const returnValue = atob(data.data);
            console.log(returnValue);

            alert(returnValue);
        }
        catch (error) {
            console.error(error);
        }
        finally {
            setLoadingCode(false);
        }
    }

    function titleChange(event) {
        setInternalTitle(event.target.value);
        
        if (onTitleChange) {
            onTitleChange(event.target.value, event);
        }
    }


    return (
        <>
            <ButtonGroup variant="outlined" fullWidth>
                <LoadingButton
                    fullWidth={false}
                    endIcon={<SendIcon />}
                    loading={loadingCode}
                    onClick={runCode}
                >Run&nbsp;code</LoadingButton>
                <LoadingButton
                    fullWidth={false}
                    endIcon={<SaveIcon />}
                    loading={loadingSave}
                    onClick={saveCode}>Save</LoadingButton>
                
            <TextField label="Title" value={internalTitle} fullWidth onChange={titleChange} />
            </ButtonGroup>

            <Editor
                height="85vh"
                defaultLanguage="javascript"
                defaultValue={code}
                value={code}
                theme='vs-dark'
                onMount={(editor, monaco) => editorRef.current = editor}
                onChange={onChange}
            />
        </>
    )
}