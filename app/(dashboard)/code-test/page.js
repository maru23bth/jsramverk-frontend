'use client';
import CodeMode from "@/components/code-mode/CodeMode";
import { useState } from "react";
import TextField from '@mui/material/TextField';

export default function CodeTest() {

    const [code, setCode] = useState("console.log('Hello World')");
    const [title, setTitle] = useState("Title");

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

            <CodeMode code={code} onSave={code => alert(`The code is:\n${code}`)} onChange={codeChanged} title={title} onTitleChange={titleChanged} />
        </div>
    )
}