'use client';
import CodeMode from "@/components/code-mode/CodeMode";

export default function CodeTest() {
    return (
        <div>
            <h1>Code Test</h1>
            <CodeMode code="console.log('Hello World')" onSave={code => alert(`The code is:\n${code}`)} />
        </div>
    )
}