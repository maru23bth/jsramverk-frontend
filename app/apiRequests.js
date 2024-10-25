import { useUserStore } from '../lib/auth.js';

/* Module with functions that make POST, PUT, GET requests to the API */
const URL = process.env.NEXT_PUBLIC_API_URL;
/**
* Fetch a list of documents from the server.
*
*@throws {Error} Will throw an error if the request fails.
*
*@returns {Promise<Object[]>} Resolves to an array of documents when the request is successful.
* Each document is represented as an object.
*/
async function fetchDocuments() {
    const response = await fetch(`${URL}/documents`, {
        headers: {
            'x-access-token': useUserStore.getState().token,
        }
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch documents`);
    }
    return response.json();
};

/**
 * Sends a POST request to create a document on the server.
 * 
 * @param {Object} document - The document object containing fields title and content.
 * @param {string} [document.title] - The title of the document.
 * @param {string} [document.content] - The content of the document.
 * 
 * @throws {Error} Will throw an error if the document creation fails.
 * 
 * @returns {Promise<void>} Resolves when the document is successfully created, rejects if there is an error.
 */

async function createDocument(document) {
    const response = await fetch(`${URL}/documents`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': useUserStore.getState().token,
        },
        body: JSON.stringify(document)
    });
    if (!response.ok) {
        throw new Error(`Failed to create document`);
    }
}

/**
* Fetch document with the id.
*
*@param {string} id - The document id.
*
*@throws {Error} Will throw an error if the request fails.
*
*@returns {Promise<Object>} Resolves to a document object when the request is successful.
*/
async function fetchDocument(id) {
    const response = await fetch(`${URL}/documents/${id}`, {
        headers: {
            'x-access-token': useUserStore.getState().token,
        }
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch document`);
    }
    return response.json();
};

/**
 * Sends a PUT request to update a document with id on the server.
 * 
 * @param {string} id - The id of the document.
 * @param {Object} document - The document object containing fields title and content.
 * @param {string} [document.title] - The title of the document.
 * @param {string} [document.content] - The content of the document.
 * 
 * @throws {Error} Throws an error if the update of the document fails.
 * 
 * @returns {Promise<void>} Resolves when the document is successfully updated, rejects if there is an error.
 */
async function updateDocument(id, document) {
    const response = await fetch(`${URL}/documents/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': useUserStore.getState().token,
        },
        body: JSON.stringify(document)
    });
    if (!response.ok) {
        throw new Error(`Failed to update document`);
    }
}

/**
* Sends a DELETE request to delete document with the given id.
*
 * @throws {Error} Throws an error if the deletion fails.
 * 
 * @returns {Promise<void>} Resolves when the document is successfully deleted, rejects if there is an error.
 */
async function deleteDocument(id) {
    const response = await fetch(`${URL}/documents/${id}`, {
        method: 'DELETE',
        headers: {
            'x-access-token': useUserStore.getState().token,
        }
    });
    if (!response.ok) {
        throw new Error(`Failed to delete document`)
    }
}

/**
* Sends a POST request to add a collaborator to the document with the given id.
*
 * @throws {Error} Throws an error if add collaborator fails.
 * 
 * @returns {<void>}.
 */
async function addCollaborator(id, email) {
    const response = await fetch(`${URL}/documents/${id}/collaborator`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': useUserStore.getState().token,
        },
        body: JSON.stringify({
            email: email
        })
    });

    if (!response.ok) {
        throw new Error(`Failed to add collaborator`);
    }

    const data = await response.json();

    return data;
}

/**
* Sends a POST request to add a collaborator to the document with the given id.
*
 * @throws {Error} Throws an error if add collaborator fails.
 * 
 * @returns {<void>}.
 */
async function removeCollaborator(id, userId) {
    const response = await fetch(`${URL}/documents/${id}/collaborator`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': useUserStore.getState().token,
        },
        body: JSON.stringify({
            userId: userId
        })
    });

    if (!response.ok) {
        throw new Error(`Failed to remove collaborator`);
    }
    // Returned current Document object
    return await response.json();
}

// fetch user ID by email
async function fetchCollaboratorIdByEmail(email) {
    const token = useUserStore.getState().token;
    const response = await fetch(`${URL}/documents/collaborator`, {
        headers: {
            'x-email': email,
            'x-access-token': token,
        }
    });

    if (!response.ok) {
        throw new Error('User not found');
    }
    const collaboratorId = await response.json();

    return collaboratorId;
}


// Add comment
async function addComment(id, content, location) {
    const token = useUserStore.getState().token;
    const response = await fetch(`${URL}/documents/${id}/comment`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': token,
        },
        body: JSON.stringify({
            content: content,
            location: location
        })
    });

    if (!response.ok) {
        throw new Error(`Failed to add a comment`);
    }

    const data = await response.json();

    return JSON.stringify(data);
}

// Delete comment
async function deleteComment(id, comment) {
    const response = await fetch(`${URL}/documents/${id}/comment/${comment.id}`, {
        method: 'DELETE',
        headers: {
            'x-access-token': useUserStore.getState().token,
        }
    });
    if (!response.ok) {
        throw new Error(`Failed to delete comment`)
    }
}

export { fetchDocuments, fetchDocument, createDocument, updateDocument, deleteDocument, addCollaborator, fetchCollaboratorIdByEmail, removeCollaborator, addComment, deleteComment }