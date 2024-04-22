import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'Loki',
    description: 'Grafana Loki Dashboard',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={`bg-white dark:bg-gray-900 dark:text-white ${inter.className}`}>{children}</body>
        </html>
    );
}
