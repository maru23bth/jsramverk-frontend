'use client';

import React, { useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import ButtonGroup from '@mui/material/ButtonGroup';
import LoadingButton from '@mui/lab/LoadingButton';
import SendIcon from '@mui/icons-material/Send';
import SaveIcon from '@mui/icons-material/Save';


/**
 * React component for a code editor with run and save buttons.
 * 
 * @param {Object} props - The props object of the component.
 * @param {string} props.code - The code to display in the editor.
 * @param {Function} props.onSave - The function to call when the save button is clicked.
 * @param {string} [props.title='Title'] - The title of the code editor.
 * @returns {JSX.Element} - The JSX element to render.
 * @example
 * <CodeMode code="console.log('Hello World')" onSave={code => alert(`The code is:\n${code}`)} />
 */
export default function CodeMode({ code, onSave, title = 'Title' }) {
    const [loadingCode, setLoadingCode] = useState(false);
    const [loadingSave, setLoadingSave] = useState(false);
    const editorRef = useRef(null);

    async function saveCode() {
        if (onSave) {
            try {
                setLoadingSave(true);
                await onSave(editorRef.current.getValue(), title);                    
            } catch (error) {
                console.error(error);
            } finally {
                setLoadingSave(false);
            }
        } else {
            alert('Save not implemented');
        }
    };

    async function runCode(event) {
        setLoadingCode(true);
        const code = editorRef.current.getValue();
        try {
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
            setLoadingCode(false);
            alert(returnValue);
        }
        catch (error) {
            console.error(error);
        }
        finally {
            setLoadingCode(false);
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
                <LoadingButton disabled style={{
                display: 'inline-block', margin: 0, paddingInline: '.5em', textOverflow: 'ellipsis',
                whiteSpace: 'nowrap', overflow: 'hidden'
            }}>{title}</LoadingButton>

            </ButtonGroup>

            <Editor
                height="85vh"
                defaultLanguage="javascript"
                defaultValue={code}
                theme='vs-dark'
                onMount={(editor, monaco) => editorRef.current = editor}
            />
        </>
    )
}