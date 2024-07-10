
import { ReactNode } from 'react';
import { WebSocketProvider } from './components/WebSocketProvider';

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <body>
                <WebSocketProvider>
                    {children}
                </WebSocketProvider>
            </body>
        </html>
    );
}
