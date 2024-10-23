'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import ButtonGroup from '@mui/material/ButtonGroup';
import LoadingButton from '@mui/lab/LoadingButton';
import SendIcon from '@mui/icons-material/Send';
import SaveIcon from '@mui/icons-material/Save';
import TextField from '@mui/material/TextField';
import './CodeMode.css';


/**
 * React component for a code editor with run and save buttons.
 * Comments can be added and deleted in the editor.
 * To add a comment, right-click in the text and select "Add comment".
 * To delete a comment, right-click on the comment icon and select "Delete comment".
 * 
 * @param {Object} props - The props object of the component.
 * @param {string} props.code - The code to display in the editor.
 * @param {Function} props.onSave - The function to call when the save button is clicked. (code, title, comments) => void
 * @param {Function} props.onChange - The function to call when the code changes. (value, event) => void
 * @param {string} [props.title='Title'] - The title of the code editor.
 * @param {Function} [props.onTitleChange] - The function to call when the title changes. (title, event) => void
 * @param {Array} [props.comments] - The comments to display in the editor.
 * @param {Function} [props.deleteComment] - The function to call when a comment is deleted. (comment) => void
 * @param {Function} [props.addComment] - The function to call when a comment is added. (content, location) => void
 * @returns {JSX.Element} - The JSX element to render.
 * @example
 * <CodeMode code="console.log('Hello World')" onSave={code => alert(`The code is:\n${code}`)} />
 */
export default function CodeMode({ code, onSave, onChange, title = 'Title', onTitleChange, comments, deleteComment, addComment }) {
    const [loadingCode, setLoadingCode] = useState(false);
    const [loadingSave, setLoadingSave] = useState(false);
    const [internalTitle, setInternalTitle] = useState(title);
    const editorRef = useRef(null);
    const monacoRef = useRef(null);
    const decorationsRef = useRef(null);
    const commentsRef = useRef(null);


    /**
     * Render comments in the editor.
     */
    const renderComments = useCallback(() => {
        if (!editorRef.current) return;

        const editor = editorRef.current;
        const monaco = monacoRef.current;
        const decorations = decorationsRef.current;

        decorations.clear();

        const newComments = comments?.map(comment => {
            const line = parseInt(comment.location);
            const range = new monaco.Range(line, 1, line, 1);
            return {
                range: range,
                options: {
                    isWholeLine: true,
                    glyphMarginClassName: 'comment-glyph',
                    glyphMarginHoverMessage: {
                        value: `${comment.content}\n\n-- ${comment.author.email}`
                    },
                }
            };
        });

        decorations.set(newComments);
    }, [comments, editorRef, monacoRef, decorationsRef]);


    // Update comments when they change
    useEffect(() => {
        console.log(`Comments changed ${comments}`);
        renderComments();
        console.log(`Comments after render ${comments}`);
        commentsRef.current = comments;
    }, [comments, renderComments]);

    // Update external title when internal title change
    useEffect(() => {
        console.log('Title changed', title);
        setInternalTitle(title);
    }, [title]);

    /**
     * Save the code in the editor., using the onSave function.
     */
    async function saveCode() {
        if (!onSave) {
            alert('Save not implemented');
            return;
        };

        try {
            setLoadingSave(true);
            await onSave(editorRef.current.getValue(), title, comments);
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingSave(false);
        }

    };

    /**
     * Run the code in the editor.
     */
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

    /**
     * Triggered when the content of <Editor /> changes. 
     */
    function contentChange() {
        const content = editorRef.current.getValue();

        if (onChange) {
            onChange(content);
        }
    }

    /**
     * 
     * @param {Event} event 
     */
    function titleChange(event) {
        setInternalTitle(event.target.value);

        if (onTitleChange) {
            onTitleChange(event.target.value, event);
        }
    }


    /**
     * Triggered when the editor is mounted.
     * @param {Object} editor - The editor object.
     * @param {Object} monaco - The monaco object.
     */
    const editorMounted = (editor, monaco) => {
        editorRef.current = editor;
        monacoRef.current = monaco;


        decorationsRef.current = editor.createDecorationsCollection();
        console.log('Monaco editor mounted', decorationsRef.current);

        editor.onContextMenu(e => {
            if (!e.target.element.classList.contains('comment-glyph')) return;

            const line = e.target.position.lineNumber || undefined;
            if (!line) return;

            if (!confirm(`Delete comments on line ${line}?`)) return;

            // Loop through comments and find the one to delete
            commentsRef.current.forEach(comment => {
                if (comment.location == line) {
                    if (deleteComment) {
                        deleteComment(comment.id);
                    }
                }
            });
        });

        // Add - Add comment to contect menu
        editor.addAction({
            // An unique identifier of the contributed action.
            id: "add-comment",
            // A label of the action that will be presented to the user.
            label: "Add comment",

            contextMenuGroupId: "comment",

            contextMenuOrder: 1.5,

            // Method that will be executed when the action is triggered.
            // @param editor The editor instance is passed in as a convenience
            run: async function (ed) {

                const line = String(ed.getPosition().lineNumber);
                if (!line) return;

                const input = prompt(`Add comment to line ${line}`);
                if (!input) return;

                if (!addComment) {
                    alert(`Add comment not implemented to line ${line}: ${input}`);
                    return;
                }
                addComment(input, line);
            },
        });

        // Render comments
        setTimeout(() => {
            renderComments();
        }, 0);

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
                options={{ glyphMargin: true, }}
                value={code}
                theme='vs-dark'
                onMount={editorMounted}
                onChange={contentChange}
            />
        </>
    )
}