'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function StartLayout({ children }) {
    return (
        <QueryClientProvider client={queryClient}>
            <div>
                <nav className="bg-[#23232A] p-2 text-white">
                    <div className="font-semibold">
                        Loki Frontend
                    </div>
                </nav>
                <main>
                    {children}
                </main>
            </div>
        </QueryClientProvider>
    );
}
