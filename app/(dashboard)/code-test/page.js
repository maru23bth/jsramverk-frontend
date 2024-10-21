'use client';
import CodeMode from "@/components/code-mode/CodeMode";
import { useState } from "react";
import TextField from '@mui/material/TextField';

export default function CodeTest() {

    const [code, setCode] = useState("console.log('Hello World')\n\n// This is a comment\n\n// This is another comment\n\n// This is a third comment");
    const [title, setTitle] = useState("Title");
    const [comments, setComments] = useState([{
        id: 'id_string',
        author: { id: 'userid', username: 'Martin', email: 'martin@example.com'},
        content: 'This is a comment',
        location: '1',
    }]);


    async function codeChanged(code, event) {
        console.log('code changed', code);
    }

    async function titleChanged(title, event) {
        console.log('title changed', title);
    }

    return (
        <div>
            <h1>Code editor test page</h1>
            <TextField fullWidth label="Update code external" multiline rows={4} value={code} onChange={event => setCode(event.target.value)} />
            <TextField fullWidth label="Update Title external" value={title} onChange={e => {console.log(e.target.value);setTitle(e.target.value)}} />
            
            <hr />
            Nedanför är komponenten för editorn, ovanför test för att uppdatera
            <hr />

            <CodeMode
                code={code}
                onSave={code => alert(`The code is:\n${code}`)}
                onChange={codeChanged}
                title={title}
                onTitleChange={titleChanged}
                comments={comments}
                addComment={(content, location) => {
                    // Handle adding comment, e.g. by calling an API, then update the comments state
                    console.log('Add comment', content, location, comments);
                    setComments(c => [...c, { id: 'id_string' + location, author: { id: 'userid', username: 'Martin', email: 'martin@example.com'}, content, location }]);
                }}
                deleteComment={comment => {
                    // Handle deleting comment, e.g. by calling an API, then update the comments state
                    console.log('Delete comment', comment, comments);
                    setComments(comments => comments.filter(item => comment !== item));
                }}
            />
        </div>
    )
}