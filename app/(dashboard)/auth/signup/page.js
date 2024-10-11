"use client";

import * as React from 'react';
import { SignInPage } from '@toolpad/core';
import { providers, signUp, useUserStore } from '@/lib/auth';
import Link from 'next/link'
import LoadingButton, { LoadingButtonProps } from '@mui/lab/LoadingButton';

function signInLink() {
    return <Link href="/auth/signin">Sign in</Link>;
}

function submitButton() {
    return <LoadingButton type="submit" loading={false} fullWidth variant="contained">Sign up</LoadingButton>;
}

export default function CredentialsSignInPage() {
    const user = useUserStore((state) => state.user);

    return (
        <SignInPage
            signIn={signUp} providers={providers} 
            slots={{signUpLink: signInLink, submitButton}}
        />
    );
}