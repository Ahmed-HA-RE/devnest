import { TooltipProvider } from '@/components/ui/tooltip';
import { ThemeProvider } from '@teispace/next-themes';

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider attribute='class'>
      <TooltipProvider>{children}</TooltipProvider>
    </ThemeProvider>
  );
};

export default Providers;
