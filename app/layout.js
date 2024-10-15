"use client";
import { AppProvider } from "@toolpad/core/nextjs";
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import { Suspense } from 'react';
import Image from 'next/image';
import { useUserStore } from '@/lib/auth';
import { useRouter } from 'next/navigation'


const NAVIGATION = [
  {
    kind: 'header',
    title: 'Menu',
  },
  {
    segment: '/document',
    title: 'Documents',
    icon: <NoteAddIcon />,
  },
  {
    segment: 'document/new',
    title: 'New document',
    icon: <NoteAddIcon />,
  },
];

export default function RootLayout({ children }) {
  const user = useUserStore();
  const router = useRouter();

  return (
    <html lang="sv" data-toolpad-color-scheme="light">
      <body>
        <Suspense fallback="Loading...">
          <AppProvider
            navigation={NAVIGATION}
            session={ user }
            authentication={{ signIn: () => router.push('/auth/signin'), signOut: user.logoutUser }}
            branding={{
              logo: <Image src="https://dbwebb.se/image/theme/leaf_256x256.png" width={40} height={40} alt="dbwebb logo" />,
              title: 'Editor',
            }}
          >
            {children}
          </AppProvider>
        </Suspense>
      </body>
    </html>
  );
}
