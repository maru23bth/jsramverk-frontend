# Auth

Authfunction located in /lib/auth.js

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

