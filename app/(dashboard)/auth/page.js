"use client";
import { PageContainer } from '@toolpad/core/PageContainer';
import { Box, Typography } from '@mui/material';
import { useUserStore } from '@/lib/auth';
import Link from 'next/link'


export default function AuthPage({ children }) {
    const user = useUserStore((state) => state.user);
    const signOut = useUserStore((state) => state.logoutUser);

    if(!user) {
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
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }} >
                <Typography variant="h5" gutterBottom>
                    Welcome {user?.username} &lt;{ user?.email }&gt;
                </Typography>
                <Typography variant="body2" gutterBottom>
                    You are now signed in.
                </Typography>
                <button onClick={signOut}>Sign out</button><br/>
                <Link href="/auth/invite">Invite</Link>
            </Box>
            
        </PageContainer>        
    );
}  
