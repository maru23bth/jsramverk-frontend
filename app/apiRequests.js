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
    const response = await fetch(`${URL}/documents`);
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
    const response = await fetch(`${URL}/documents/${id}`);
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
    const response = await fetch(`${URL}/documents/${id}`, { method: 'DELETE' });
    if (!response.ok) {
        throw new Error(`Failed to delete document`)
    }
}

export { fetchDocuments, fetchDocument, createDocument, updateDocument, deleteDocument }