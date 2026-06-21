import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import { supabaseConfigured } from "@/lib/supabase";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
    },
  },
});

function MissingConfig() {
  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center bg-[#FAFAFA] font-sans">
      <div className="text-center px-8 max-w-sm">
        <div className="text-4xl mb-6">🔧</div>
        <h1 className="text-xl font-semibold text-[#1C1C1E] mb-2">
          Environment variables missing
        </h1>
        <p className="text-sm text-gray-500 font-light leading-relaxed">
          Please set{" "}
          <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded font-mono">
            VITE_SUPABASE_URL
          </code>{" "}
          and{" "}
          <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded font-mono">
            VITE_SUPABASE_ANON_KEY
          </code>{" "}
          in your deployment settings.
        </p>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  if (!supabaseConfigured) {
    return <MissingConfig />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
