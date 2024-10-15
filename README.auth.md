# Auth

Authfunction located in /lib/auth.js

Uses JWT to get access token.
Uses zustand to store user information (and access token) to be accessible across application.
Saves JWT token in localstorage, so page reloads works.


## Routes
- /auth/
    Show user information

- /auth/signin
    Login page

- /auth/singup
    Sign up page

- /auth/invite
    Send invite to email

## Access user information
import { useUserStore } from '@/lib/auth';
const user = useUserStore((state) => state.user);

