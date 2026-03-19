import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FolderOpen, PlusCircle, User, LogOut, Home, ExternalLink } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { NavLink } from '@/components/NavLink';

const navItems = [
  { title: 'Home', url: '/', icon: Home },
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'My Projects', url: '/projects', icon: FolderOpen },
  { title: 'Submit Project', url: '/submit-project', icon: PlusCircle },
  { title: 'Profile', url: '/profile', icon: User },
  { title: 'Portfolio', url: 'https://portfolio-karan-aiml.vercel.app/', icon: ExternalLink, external: true },
];

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const { logout, user } = useAuth();
  const location = useLocation();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar collapsible="icon">
          <SidebarContent>
            <Link to="/" className="flex h-16 items-center gap-2 border-b border-border px-4 hover:opacity-80 transition-opacity">
              <span className="font-display font-bold gradient-text truncate">ProjectBuddy</span>
            </Link>

            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems
                    .filter(item => user?.role === 'admin' ? !['Dashboard', 'My Projects', 'Submit Project'].includes(item.title) : true)
                    .map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                        {item.external ? (
                          <a href={item.url} target="_blank" rel="noreferrer" className="flex w-full items-center gap-2 px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors rounded-md">
                            <item.icon className="h-4 w-4" />
                            <span>{item.title}</span>
                          </a>
                        ) : (
                          <NavLink to={item.url} end activeClassName="bg-sidebar-accent text-primary font-medium">
                            <item.icon className="h-4 w-4" />
                            <span>{item.title}</span>
                          </NavLink>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}

                  {user?.role === 'admin' && (
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={location.pathname === '/admin'}>
                        <NavLink to="/admin" end activeClassName="bg-sidebar-accent text-primary font-medium">
                          <LayoutDashboard className="h-4 w-4" />
                          <span>Admin Panel</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}

                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <button onClick={logout} className="flex w-full items-center gap-2 text-destructive">
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <div className="flex-1 flex flex-col min-w-0">
          <header className="flex h-14 items-center gap-4 border-b border-border px-4">
            <SidebarTrigger />
            <h2 className="font-display font-semibold text-foreground">
              {navItems.find((i) => i.url === location.pathname)?.title || 'Admin Panel'}
            </h2>
          </header>
          <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
