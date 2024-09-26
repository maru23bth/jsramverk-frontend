import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import FeedbackAlert from '@/app/components/FeedbackAlert'

describe('FeedbackAlert', () => {
    it('renders with feedback type success', () => {
        const props = {
            feedback: 'Operation was successful',
            feedbackType: 'success'
        }

        render(<FeedbackAlert feedback={props.feedback} feedbackType={props.feedbackType}/>)

        const alert = screen.getByRole('alert')

        // Check if the alert contains the correct feedback text
        expect(alert).toHaveTextContent(props.feedback)
    })
})