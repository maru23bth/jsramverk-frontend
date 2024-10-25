/* Reusable GraphQl fetch function */
import { useUserStore } from '../lib/auth.js';
const URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchGraphQL = async (query, variables = {}) => {
    const token = useUserStore.getState().token;

    try {
        const response = await fetch(`${URL}/graphql`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': token,
            },
            body: JSON.stringify({ query, variables})
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};
