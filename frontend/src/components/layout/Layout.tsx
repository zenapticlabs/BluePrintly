import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { SidebarProvider } from "@/contexts/SidebarContext";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
} 