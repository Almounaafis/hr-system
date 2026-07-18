import { TooltipProvider } from '@/components/ui/tooltip';
import { Providers } from "@/providers";
import AppRoutes from './routes';

function App() {
  return (
    <Providers>
      <TooltipProvider>
        <AppRoutes />
      </TooltipProvider>
    </Providers>
  );
}

export default App;