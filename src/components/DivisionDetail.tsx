import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Building, 
  Users, 
  Award, 
  Star, 
  ArrowRight,
  Clock,
  Calendar,
  Briefcase,
  Eye,
  LogOut,
  ChevronDown,
  Settings,
  Mail,
  User as UserIcon
} from 'lucide-react';
import { DIVISIONS } from '../constants';
import { User, Office } from '../types';
import LanguageSwitcher from './LanguageSwitcher';
import AnimatedBackground from './AnimatedBackground';

interface DivisionDetailProps {
  divisionId: string;
  user: User;
  onBack: () => void;
  onSelectOffice: (officeId: string) => void;
  language: string;
  setLanguage: (lang: string) => void;
}

const DivisionDetail: React.FC<DivisionDetailProps> = ({
  divisionId,
  user,
  onBack,
  onSelectOffice,
  language,
  setLanguage
}) => {
  const division = DIVISIONS.find(d => d.id === divisionId);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(false);
  
  const modalRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Update time every second
  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timeInterval);
  }, []);

  // Handle click outside to close modals and menus
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setShowUserDetails(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowUserDetails(false);
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  if (!division) {
    return null;
  }

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      
      {/* Compact Header Section - Same as UnifiedSelector */}
      <div className="relative z-20">
        <div className="max-w-7xl mx-auto p-6">
          {/* Top Bar with Time, User Menu, Language and Logout */}
          <div className="flex flex-col lg:flex-row justify-between items-center mb-8 space-y-4 lg:space-y-0">
            {/* Back Button */}
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-xl border border-white/30 hover:bg-white/20 transition-all duration-300"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Retour</span>
              </button>

              {/* Time and Date Display */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/30 shadow-lg">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-white animate-pulse" />
                    <div className="text-center">
                      <div className="text-lg font-bold text-white font-mono">
                        {formatTime(currentTime)}
                      </div>
                      <div className="text-xs text-white/80">Heure</div>
                    </div>
                  </div>
                  
                  <div className="w-px h-8 bg-white/30"></div>
                  
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-white" />
                    <div className="text-center">
                      <div className="text-sm font-semibold text-white capitalize">
                        {formatDate(currentTime)}
                      </div>
                      <div className="text-xs text-white/80">Date</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* User Menu, Language and Logout */}
            <div className="flex items-center space-x-4">
              {/* User Menu */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm text-white px-4 py-3 rounded-2xl border border-white/30 hover:bg-white/20 transition-all duration-300 shadow-lg"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src="/default.png"
                      alt={user.name}
                      className="w-10 h-10 rounded-xl object-cover border-2 border-white/30"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300';
                      }}
                    />
                    <div className="text-left">
                      <div className="text-sm font-semibold">{user.name}</div>
                      <div className="text-xs text-white/80 flex items-center space-x-1">
                        <Briefcase className="w-3 h-3" />
                        <span>{division.nameFr}</span>
                      </div>
                    </div>
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>

                {/* User Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute top-full right-0 mt-2 w-80 bg-white/95 backdrop-blur-lg rounded-2xl border border-white/30 shadow-2xl z-30">
                    {/* User Header in Dropdown */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-2xl p-6 text-white">
                      <div className="flex items-center space-x-4">
                        <img
                          src="/default.png"
                          alt={user.name}
                          className="w-16 h-16 rounded-2xl object-cover border-4 border-white/30"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300';
                          }}
                        />
                        <div>
                          <h3 className="text-xl font-bold">{user.name}</h3>
                          <p className="text-blue-100 text-sm">{user.email}</p>
                          <div className="flex items-center space-x-4 mt-2 text-xs">
                            <span className="flex items-center space-x-1">
                              <Building className="w-3 h-3" />
                              <span>{division.nameFr}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Users className="w-3 h-3" />
                              <span>{division.offices.length} Bureaux</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="p-4 border-b border-gray-200">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="text-center">
                          <div className="font-semibold text-gray-900">{division.offices.length}</div>
                          <div className="text-gray-600 text-xs">Bureaux</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-gray-900">Superviseur</div>
                          <div className="text-gray-600 text-xs">Rôle</div>
                        </div>
                      </div>
                    </div>

                    {/* Division Info */}
                    <div className="p-4 border-b border-gray-200">
                      <h4 className="font-semibold text-gray-900 text-sm mb-3">Division Actuelle</h4>
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-3 border border-purple-200">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 ${division.color} rounded-lg flex items-center justify-center`}>
                            <Building className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 text-sm">{division.nameFr}</div>
                            <div className="text-xs text-gray-600">{division.offices.length} bureaux spécialisés</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Menu Actions */}
                    <div className="p-4 space-y-2">
                      <button
                        onClick={() => {
                          setShowUserDetails(true);
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-700 hover:bg-blue-50 rounded-xl transition-colors duration-200"
                      >
                        <Eye className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="font-semibold text-sm">Voir toutes les informations</div>
                          <div className="text-xs text-gray-500">Profil complet et détails</div>
                        </div>
                      </button>
                      
                      <button
                        onClick={() => {
                          // Add settings functionality here
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-700 hover:bg-blue-50 rounded-xl transition-colors duration-200"
                      >
                        <Settings className="w-5 h-5 text-gray-600" />
                        <div>
                          <div className="font-semibold text-sm">Paramètres</div>
                          <div className="text-xs text-gray-500">Préférences du compte</div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <LanguageSwitcher language={language as any} onLanguageChange={setLanguage as any} />
              
              <button
                onClick={onBack}
                className="flex items-center space-x-3 bg-red-600/80 backdrop-blur-sm text-white px-6 py-3 rounded-2xl border border-red-400/30 hover:bg-red-700/80 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm font-medium">
                  {language === 'en' ? 'Logout' : 'Déconnexion'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Division Header */}
          <div className="text-center mb-12">
            <div className={`w-16 h-16 ${division.color} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl`}>
              <Building className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {language === 'en' ? division.nameEn : division.nameFr}
              </span>
            </h2>
            
            <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mx-auto"></div>
          </div>      

          {/* Offices Section */}
          <div>
            <div className="text-center mb-12">
              
              <p className="text-blue-100 text-lg max-w-3xl mx-auto">
                Sélectionnez un bureau pour accéder à votre flux de travail spécifique
              </p>
              <div className="w-20 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mx-auto mt-4"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {division.offices.map((office) => (
                <div
                  key={office.id}
                  onClick={() => onSelectOffice(office.id)}
                  className="group relative cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-xl rounded-3xl transform rotate-1 scale-105 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>

                  <div className="relative bg-white/10 backdrop-blur-2xl rounded-3xl p-8 border border-white/30 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className={`w-16 h-16 bg-gradient-to-br ${office.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                        <Building className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white mb-1">
                          {language === 'en' ? office.nameEn : office.nameFr}
                        </h3>
                      </div>
                    </div>

                    <p className="text-blue-100 text-lg mb-6 leading-relaxed">
                      {language === 'en' ? office.descriptionEn : office.description}
                    </p>
      

                    <div className="mt-6 pt-6 border-t border-white/20">
                      <button className={`w-full bg-gradient-to-r ${office.color} text-white font-bold py-3 px-6 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300`}>
                        Accéder au Bureau
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Information */}
          <div className="text-center mt-16 text-blue-100 text-sm space-y-3">
            <div className="flex items-center justify-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="font-medium">Excellence Opérationnelle</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span className="font-medium">Innovation Continue</span>
              </div>
            </div>
            <p className="font-medium">GeoCasa Group - {division.nameFr}</p>
            <p>Yaoundé, Cameroun • +237 6XX XXX XXX</p>
          </div>
        </div>
      </div>

      {/* User Details Modal */}
      {showUserDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div 
            ref={modalRef}
            className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-3xl p-8 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <img
                    src="/default.png"
                    alt={user.name}
                    className="w-20 h-20 rounded-2xl object-cover border-4 border-white/30"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300';
                    }}
                  />
                  <div>
                    <h2 className="text-3xl font-bold">{user.name}</h2>
                    <p className="text-blue-100 text-lg">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowUserDetails(false)}
                  className="text-white hover:text-gray-200 text-3xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-8">
              {/* User Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Informations Personnelles</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <UserIcon className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-900">{user.name}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-900">{user.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-900">Membre depuis 2023</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Statistiques</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Division actuelle</span>
                      <span className="font-semibold text-gray-900">{division.nameFr}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bureaux accessibles</span>
                      <span className="font-semibold text-gray-900">{division.offices.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Statut</span>
                      <span className="font-semibold text-green-600">Actif</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Division Information */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Division Actuelle</h3>
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className={`w-12 h-12 ${division.color} rounded-2xl flex items-center justify-center`}>
                      <Building className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">{division.nameFr}</h4>
                      <p className="text-gray-600">{division.description}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-semibold text-gray-900">{division.offices.length}</div>
                      <div className="text-gray-600">Bureaux</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-gray-900">Superviseur</div>
                      <div className="text-gray-600">Rôle</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-gray-900">Actif</div>
                      <div className="text-gray-600">Statut</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-gray-900">Complet</div>
                      <div className="text-gray-600">Accès</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Offices */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Bureaux Accessibles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {division.offices.map((office) => (
                    <div key={office.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {language === 'en' ? office.nameEn : office.nameFr}
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">
                        {language === 'en' ? office.descriptionEn : office.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                          Accès complet
                        </span>
                        <span className="text-xs text-gray-500">Bureau spécialisé</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Close Button */}
              <div className="flex justify-end">
                <button
                  onClick={() => setShowUserDetails(false)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DivisionDetail;