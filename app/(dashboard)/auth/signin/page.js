"use client";

import * as React from 'react';
import { SignInPage } from '@toolpad/core';
import { providers, signIn, useUserStore } from '@/lib/auth';
import Link from 'next/link'
import { PageContainer } from '@toolpad/core/PageContainer';
import { Box, Typography } from '@mui/material';


function signUpLink() {
    return <Link href="/auth/signup">Sign up</Link>;
}

export default function CredentialsSignInPage() {
    const user = useUserStore((state) => state.user);
    const signOut = useUserStore((state) => state.logoutUser);


    if (user) return (
        <PageContainer>
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }} >
                <Typography variant="h5" gutterBottom>
                    Welcome {user?.username} &lt;{user?.email}&gt;
                </Typography>
                <Typography variant="body2" gutterBottom>
                    You are now signed in.
                </Typography>
                <button onClick={signOut}>Sign out</button><br />
                <Link href="/auth/invite">Invite</Link>
            </Box>

        </PageContainer>
    );
        
    return (
        <SignInPage
            signIn={signIn} providers={providers}
            slots={{ signUpLink }}
        />
    );
}