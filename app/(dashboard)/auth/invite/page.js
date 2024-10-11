"use client";
import { useState } from 'react';
import { PageContainer } from '@toolpad/core/PageContainer';
import { Box, Typography, TextField, Button, Alert } from '@mui/material';
import { useUserStore, sendInvite } from '@/lib/auth';
import Link from 'next/link'



export default function AuthInvitePage({ children }) {
    const user = useUserStore((state) => state.user);
    const signOut = useUserStore((state) => state.logoutUser);
    const [status, setStatus] = useState(null);

    async function formSubmit(formData) {
        console.log('formSubmit', formData);
        alert(window.location);
        return;
        setStatus('loading...');
        const response = await sendInvite(formData);
        setStatus(response);
    }

    if (!user) {
        return (
            <PageContainer>
                <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }} >
                    <Typography variant="h5" gutterBottom>
                        You are not signed in.
                    </Typography>
                    <Link href="/auth/signin">Sign in</Link>
                </Box>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {status ? (
                    <Alert severity="info">{status}</Alert>
                ) : null}

                <form action={formSubmit}>
                    <TextField margin="dense" required fullWidth id="email" label="Email Address" name="email" type="email" autoComplete="email" />
                    <Button variant="contained" size="large" type="submit" fullWidth>Invite</Button>
                </form>
            </Box>

        </PageContainer>
    );
}  
