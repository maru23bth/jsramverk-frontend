/* Module with functions that make POST, OUT, GET requests to the API */
async function createDocument(documentTitle, documentContent, setFeedback, setFeedbackType) {
    const url = process.env.API_URL;
    const document = { title: documentTitle, content: documentContent };

    try {
        const response = await fetch(`${url}/documents`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(document),
        });

        if (response.ok) {
            setFeedback(`Document titled "${documentTitle}" has been created successfully.`);
            setFeedbackType('success');
            return true
        } else {
            setFeedback('Failed to create document.');
            setFeedbackType('error');
            return false
        }
    } catch (error) {
        setFeedback('Error creating document.');
        setFeedbackType('error');
        console.log("Error creating document:", error);
    }
}

async function updateDocument(id, documentTitle, documentContent, setFeedback, setFeedbackType) {
    const url = process.env.API_URL;
    const document = { title: documentTitle, content: documentContent };

    try {
        const response = await fetch(`${url}/documents/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(document),
        });

        if (response.ok) {
            setFeedback(`Document titled "${documentTitle}" has been updated successfully.`);
            setFeedbackType('success');
        } else {
            setFeedback('Failed to update document.');
            setFeedbackType('error');
        }
    } catch (error) {
        setFeedback('Error updating document.');
        setFeedbackType('error');
        console.log("Error updating document:", error);
    }

}

export { createDocument, updateDocument }