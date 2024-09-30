import { fetchDocument, fetchDocuments, createDocument, updateDocument, deleteDocument } from "@/app/apiRequests";

const URL = process.env.NEXT_PUBLIC_API_URL
// Mock fetch globally
global.fetch = jest.fn();
// Define mockDocument onc and reuse it
const mockDocument = { id: 1, title: 'Test Document', content: 'Test Content' };
// Define document id    
const mockId = '001';

describe('API Request', ()=> {
    test('fetchDocuments should return an array of document objects on successful fetch', async () => {
        const mockDocuments = [{ id: 1, title: 'Test Document', content: 'Test Content' }];
        // when fetch is called, Promise resolves as this obj
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockDocuments,
        });

        const result = await fetchDocuments();
        expect(result).toEqual(mockDocuments);
        expect(fetch).toHaveBeenCalledWith(
            // made assertion more universal so that any url can be used
            // as long as the '/documents' is present
            // read more asymmetric matchers -> https://jestjs.io/docs/expect#asymmetric-matchers
            expect.stringContaining('/documents')
        );
    });

    test('fetchDocuments should throw an error if fetch fails', async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
        });

        await expect(fetchDocuments()).rejects.toThrow(Error);
    });

    test('fetchDocument should return document object on successful fetch', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockDocument,
        });

        const result = await fetchDocument(mockId);
        expect(result).toEqual(mockDocument);
        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining(`/documents/${mockId}`)
        );
    });

    test('fetchDocument should throw an error if fetch fails', async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
        });
        // fetchDocument() will return Promise<rejected> with .rejects we unwrap this promise
        await expect(fetchDocument()).rejects.toThrow(Error);
    });

    test('createDocument should throw an error if fetch fails', async () => {
        
        fetch.mockResolvedValueOnce({
            ok: false,
        });
        await expect(createDocument(mockDocument)).rejects.toThrow(Error);
        // Check that fetch was called with the correct URL and options
        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining('/documents'),
            // read more asymmetric matchers https://jestjs.io/docs/expect#asymmetric-matchers
            expect.objectContaining({
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(mockDocument)
            })
        );
    });

    test('createDocument successfully creates a document', async() => {
        
        fetch.mockResolvedValueOnce({
            ok: true
        });

        await createDocument(mockDocument);

        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining('/documents'),
            expect.objectContaining({
                method: 'POST',
                headers: {'Content-Type' : 'application/json'},
                body: JSON.stringify(mockDocument)
            })
        );
    });

    test('updateDocument updates document successfully', async () => {
        fetch.mockResolvedValueOnce({
            ok: true
        });

        await updateDocument(mockId, mockDocument);

        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining(`/documents/${mockId}`),
            expect.objectContaining({
                method: 'PUT',
                headers: {'Content-Type' : 'application/json'},
                body: JSON.stringify(mockDocument)
            })
        );
    });

    test('updateDocument should throw an error if fetch fails', async () => {
        fetch.mockResolvedValueOnce({
            ok: false
        });

        await expect(updateDocument(mockId, mockDocument)).rejects.toThrow(Error);

        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining(`/documents/${mockId}`),
            expect.objectContaining({
                method: 'PUT',
                headers: {'Content-Type' : 'application/json'},
                body: JSON.stringify(mockDocument)
            })

        );
    });

    test('deleteDocument should throw an error if fetch fails', async () => {
        fetch.mockResolvedValueOnce({
            ok: false
        });

        // deleteDocument(mockId) will return Promise<rejected> with .rejects we unwrap this promise
        await expect(deleteDocument(mockId)).rejects.toThrow(Error);

        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining(`documents/${mockId}`),
            expect.objectContaining({ method: 'DELETE' })
        );
    });

});