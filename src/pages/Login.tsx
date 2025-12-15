import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const systemUsers = useAppStore((state) => state.systemUsers);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Find user in mock db
    const user = systemUsers.find(
      (u) => u.username === username && u.password === password && u.status === 'Active'
    );

    if (user) {
      login(user);
      toast.success('Bienvenido al sistema DIDECO');
      navigate('/');
    } else {
      toast.error('Credenciales inválidas o usuario inactivo');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 relative">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/assets/login-bg-community.jpg" 
          alt="Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>
      </div>

      <Card className="w-full max-w-md z-10 shadow-2xl border-slate-200">
        <CardHeader className="space-y-1 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <img src="/assets/dideco-logo_variant_1.png" alt="Logo" className="w-16 h-16 object-contain" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-800">DIDECO</CardTitle>
          <CardDescription>Gestor de Ayudas Sociales</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Usuario</Label>
              <Input
                id="username"
                placeholder="Ingrese su usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="Ingrese su contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
              Ingresar
            </Button>
            <div className="text-center text-xs text-muted-foreground mt-4">
              <p>Credenciales por defecto: admin / 123</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}