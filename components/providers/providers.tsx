'use client';

import { TooltipProvider } from '@/components/ui/tooltip';
import { getQueryClient } from '@/lib/get-query-client';
import { ThemeProvider } from '@teispace/next-themes';
import { QueryClientProvider } from '@tanstack/react-query';

const Providers = ({ children }: { children: React.ReactNode }) => {
  const queryClient = getQueryClient();

  return (
    <ThemeProvider attribute='class'>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>{children}</TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default Providers;
