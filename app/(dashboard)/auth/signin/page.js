"use client";

import * as React from 'react';
import { SignInPage } from '@toolpad/core';
import { providers, signIn, useUserStore } from '@/lib/auth';
import Link from 'next/link'

function signUpLink() {
    return <Link href="/auth/signup">Sign up</Link>;
}

export default function CredentialsSignInPage() {

    return (
        <SignInPage
            signIn={signIn} providers={providers}
            slots={{ signUpLink }}
        />
    );
}