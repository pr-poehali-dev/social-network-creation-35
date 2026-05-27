import { NavLink, useLocation } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { useState } from "react";

const navItems = [
  { path: "/", label: "Лента", icon: "Home" },
  { path: "/search", label: "Поиск", icon: "Search" },
  { path: "/messages", label: "Сообщения", icon: "MessageCircle", badge: 3 },
  { path: "/notifications", label: "Уведомления", icon: "Bell", badge: 7 },
  { path: "/subscriptions", label: "Подписки", icon: "UserCheck" },
  { path: "/communities", label: "Сообщества", icon: "Users" },
  { path: "/groups", label: "Группы", icon: "UsersRound" },
  { path: "/channels", label: "Каналы", icon: "Radio" },
  { path: "/music", label: "Музыка", icon: "Music" },
  { path: "/radio", label: "Радио", icon: "Antenna" },
  { path: "/profile", label: "Профиль", icon: "User" },
];

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const currentPage = navItems.find(i => i.path === location.pathname)?.label ?? "Лента";

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar desktop */}
      <aside className="hidden lg:flex flex-col w-64 fixed left-0 top-0 h-full border-r border-border bg-card z-30">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-border">
          <span className="text-2xl font-bold gradient-text" style={{ fontFamily: 'Space Grotesk' }}>
            Волна
          </span>
          <span className="ml-1 text-xs text-muted-foreground align-middle">beta</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-hide">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
                ${isActive
                  ? "gradient-bg text-white shadow-lg shadow-purple-500/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon name={item.icon} size={18} />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && !isActive && (
                    <span className="text-xs bg-primary text-primary-foreground rounded-full px-1.5 py-0.5 min-w-[20px] text-center leading-none">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="px-4 py-4 border-t border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-xs font-bold text-white">
              АИ
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Алекс Иванов</p>
              <p className="text-xs text-muted-foreground truncate">@alexivan</p>
            </div>
            <Icon name="Settings" size={16} className="text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
          </div>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside className={`fixed left-0 top-0 h-full w-64 bg-card border-r border-border z-50 lg:hidden transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="px-6 py-5 border-b border-border flex items-center justify-between">
          <span className="text-2xl font-bold gradient-text" style={{ fontFamily: 'Space Grotesk' }}>Волна</span>
          <button onClick={() => setSidebarOpen(false)} className="text-muted-foreground hover:text-foreground">
            <Icon name="X" size={20} />
          </button>
        </div>
        <nav className="px-3 py-4 space-y-1 overflow-y-auto scrollbar-hide h-full">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                ${isActive ? "gradient-bg text-white" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`
              }
            >
              <Icon name={item.icon} size={18} />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="text-xs bg-primary text-primary-foreground rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Mobile top bar */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-card sticky top-0 z-20">
          <button onClick={() => setSidebarOpen(true)} className="text-muted-foreground hover:text-foreground">
            <Icon name="Menu" size={22} />
          </button>
          <span className="text-lg font-bold gradient-text" style={{ fontFamily: 'Space Grotesk' }}>Волна</span>
          <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-xs font-bold text-white">
            АИ
          </div>
        </header>

        <div className="flex-1 p-4 lg:p-6 max-w-4xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}