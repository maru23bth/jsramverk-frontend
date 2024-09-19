import { AppProvider } from "@toolpad/core/nextjs";
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import { Suspense } from 'react';
import Image from 'next/image';

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
  return (
    <html lang="sv" data-toolpad-color-scheme="light">
      <body>
        <Suspense>
          <AppProvider
            navigation={NAVIGATION}
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
