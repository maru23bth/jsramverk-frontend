import { fetchDocument, fetchDocuments, createDocument, updateDocument, deleteDocument } from "@/app/apiRequests";
const URL = process.env.NEXT_PUBLIC_API_URL
// Mock fetch globally
global.fetch = jest.fn();

describe('API Requests', ()=> {
    test('fetchDocuments should return an array of document objects on successful fetch', async () => {
        const mockDocuments = [{ id: 1, title: 'Test Document', content: 'Test Content' }];
        // when fetch is called, return once
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockDocuments,
        });

        const result = await fetchDocuments();
        expect(result).toEqual(mockDocuments);
        expect(fetch).toHaveBeenCalledWith(`${URL}/documents`);
    });

    test('fetchDocuments should throw an error if fetch fails', async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
        });

        await expect(fetchDocuments()).rejects.toThrow(Error);
    });

    test('fetchDocument should return document object on successful fetch', async () => {
        const mockDocument = { id: 1, title: 'Test Document', content: 'Test Content' };
        const mockId = '001';
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockDocument,
        });

        const result = await fetchDocument(mockId);
        expect(result).toEqual(mockDocument);
        expect(fetch).toHaveBeenCalledWith(`${URL}/documents/${mockId}`);
    });

    test('fetchDocument should throw an error if fetch fails', async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
        });
        await expect(fetchDocument()).rejects.toThrow(Error);
    });

    test('createDocument should throw an error if fetch fails', async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
        });
        await expect(createDocument()).rejects.toThrow(Error);
        expect(fetch).toHaveBeenCalledWith(`${URL}/documents`);
    });

});