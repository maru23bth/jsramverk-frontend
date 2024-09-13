import { AppProvider } from "@toolpad/core/nextjs";
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import { Suspense } from 'react'

const NAVIGATION = [
  {
    kind: 'header',
    title: 'Dokument',
  },
  {
    segment: 'new-document',
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
              logo: <img src="https://dbwebb.se/image/theme/leaf_256x256.png" alt="dbwebb logo" />,
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
