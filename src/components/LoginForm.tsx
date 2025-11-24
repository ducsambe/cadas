import React, { useState } from 'react';
import { Mail, Lock, LogIn, Loader, User as UserIconLucide, Eye, EyeOff } from 'lucide-react';
import { LoginCredentials } from '../types';

interface LoginFormProps {
  onLogin: (credentials: LoginCredentials) => void;
  loading: boolean;
  error?: string | null;
  t: (key: string) => string;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, loading, error, t }) => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(credentials);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-2xl p-4 text-red-200 text-sm">
            <p className="font-semibold">Erreur de connexion</p>
            <p>{error}</p>
          </div>
        )}
        
        <div className="relative">
          <UserIconLucide className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-300" />
          <input
            type="text"
            value={credentials.email}
            onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
            placeholder="Email ou Username"
            className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/30 rounded-2xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300 text-lg"
            required
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-300" />
          <input
            type={showPassword ? "text" : "password"}
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            placeholder={t('password')}
            className="w-full pl-12 pr-12 py-4 bg-white/10 backdrop-blur-sm border border-white/30 rounded-2xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300 text-lg"
            required
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-300 hover:text-blue-200 transition-colors duration-200 focus:outline-none"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-orange-600 hover:from-blue-700 hover:to-orange-700 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-3 group disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl transform hover:scale-105"
        >
          {loading ? (
            <>
              <Loader className="w-6 h-6 animate-spin" />
              <span className="text-lg">Connexion en cours...</span>
            </>
          ) : (
            <>
              <LogIn className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
              <span className="text-lg">{t('signIn')}</span>
            </>
          )}
        </button>
      </form>

      {/* Demo credentials
      <div className="mt-8 p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
        <p className="text-sm text-blue-200 font-semibold mb-3 text-center">Comptes de test (cliquez pour sélectionner):</p>
        <div className="text-xs text-blue-100 space-y-2">
          <div 
            className="cursor-pointer hover:bg-white/10 p-2 rounded-lg transition-colors"
            onClick={() => setCredentials({ email: 'admin@geocasagroup.com', password: 'password123' })}
          >
            <p><strong>Admin:</strong> admin@geocasagroup.com / password123</p>
            <p className="text-blue-300">Accès complet à tous les départements</p>
          </div>
          <div 
            className="cursor-pointer hover:bg-white/10 p-2 rounded-lg transition-colors"
            onClick={() => setCredentials({ email: 'jean.mballa@geocasagroup.com', password: 'password123' })}
          >
            <p><strong>Manager:</strong> jean.mballa@geocasagroup.com / password123</p>
            <p className="text-blue-300">Accès Foncier + Financement</p>
          </div>
          <div 
            className="cursor-pointer hover:bg-white/10 p-2 rounded-lg transition-colors"
            onClick={() => setCredentials({ email: 'marie.nguema@geocasagroup.com', password: 'password123' })}
          >
            <p><strong>User:</strong> marie.nguema@geocasagroup.com / password123</p>
            <p className="text-blue-300">Accès Vente & Gestion</p>
          </div>
          <div 
            className="cursor-pointer hover:bg-white/10 p-2 rounded-lg transition-colors"
            onClick={() => setCredentials({ email: 'demo@geocasa.com', password: 'demo123' })}
          >
            <p><strong>Demo:</strong> demo@geocasa.com / demo123</p>
            <p className="text-blue-300">Compte de démonstration rapide</p>
          </div>
        </div>
        <p className="text-xs text-blue-300 mt-3 text-center">
          Vous pouvez aussi utiliser les usernames : admin, jean.mballa, marie.nguema, demo
        </p>
      </div> */}
    </div>
  );
};

export default LoginForm;