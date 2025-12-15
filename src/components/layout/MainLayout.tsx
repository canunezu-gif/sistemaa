import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Package,
  Users,
  UserCog,
  HeartHandshake,
  FileText,
  LogOut,
  Menu,
  X,
  Settings
} from 'lucide-react';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/inventory', label: 'Inventario', icon: Package },
    { path: '/professionals', label: 'Profesionales', icon: UserCog },
    { path: '/users', label: 'Usuarios Sistema', icon: Users },
    { path: '/beneficiaries', label: 'Beneficiarios', icon: Users },
    { path: '/benefits-config', label: 'Mantenedor Ayudas', icon: Settings },
    { path: '/aid-delivery', label: 'Gestión Ayudas', icon: HeartHandshake },
    { path: '/reports', label: 'Reportes', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:relative lg:translate-x-0`}
      >
        <div className="flex items-center justify-between h-16 px-4 bg-slate-950">
          <div className="flex items-center gap-2 font-bold text-xl">
            <img src="/assets/dideco-logo.png" alt="Logo" className="h-8 w-8 object-contain bg-white rounded-full p-0.5" />
            <span>DIDECO</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-4 border-b border-slate-800">
          <p className="text-sm text-slate-400">Bienvenido,</p>
          <p className="font-medium truncate">{user?.firstName} {user?.lastName}</p>
          <p className="text-xs text-slate-500">{user?.position}</p>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-slate-800">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-slate-800"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center px-6 shadow-sm">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden mr-4 text-slate-600"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-semibold text-slate-800">
            {navItems.find((i) => i.path === location.pathname)?.label || 'DIDECO'}
          </h1>
        </header>

        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}