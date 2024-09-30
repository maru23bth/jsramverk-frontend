import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import CreateDocumentForm from '@/app/components/createDocumentForm'
import { createDocument } from '@/app/apiRequests'; // The real function

// Mocking the module where createDocument exists
jest.mock('@/app/apiRequests', () => ({
  createDocument: jest.fn(), // Mocking createDocument function
}));

describe('CreateDocumentForm', () => {
    test('renders form field and submit button', () => {
        render(<CreateDocumentForm />);

        expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Content/i)).toBeInTheDocument();
        // testing-library docs -> https://testing-library.com/docs/queries/byrole/
        expect(screen.getByRole('button', {name: /Submit/i})).toBeInTheDocument();
    });

    test('allows the user to type in the form fields', () => {
        render(<CreateDocumentForm />);

        // Simulate typing into the Title field
        const titleInput = screen.getByLabelText(/Title/i);
        fireEvent.change(titleInput, { target: { value: 'Test Title' } });
        expect(titleInput.value).toBe('Test Title');

        // Simulate typing into the Content field
        const contentInput = screen.getByLabelText(/Content/i);
        fireEvent.change(contentInput, { target: { value: 'Test Content' } });
        expect(contentInput.value).toBe('Test Content');

    });
});