'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Header from '@/components/Header';

const queryClient = new QueryClient();

export default function StartLayout({ children }) {
    return (
        <QueryClientProvider client={queryClient}>
            <div>
                <Header />

                <main>
                    {children}
                </main>
            </div>
        </QueryClientProvider>
    );
}

export const dynamic = 'force-dynamic';
