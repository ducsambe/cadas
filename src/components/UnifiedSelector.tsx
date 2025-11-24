import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight,
  Award, 
  Briefcase,
  Building, 
  Calendar,
  Clock,
  Eye,
  Mail,
  MapPin,
  Phone,
  Star,
  User as UserIcon,
  Users,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ChevronDown,
  Settings,
  Home,
  Package,
  TreePine,
  Cpu,
  ShoppingCart,
  CreditCard
} from 'lucide-react';
import { Department, Division, User } from '../types';
import AnimatedBackground from './AnimatedBackground';
import LanguageSwitcher from './LanguageSwitcher';

interface UnifiedSelectorProps {
  user: User;
  departments: Department[];
  divisions: Division[];
  onSelectDepartment: (department: Department) => void;
  onSelectDivision: (division: Division) => void;
  onShowDepartmentDetail: (departmentId: string) => void;
  onShowDivisionDetail: (divisionId: string) => void;
  onSelectOffice: (officeId: string) => void; // Add this prop
  onLogout: () => void;
  t: (key: string) => string;
  language: string;
  setLanguage: (lang: string) => void;
}

const UnifiedSelector: React.FC<UnifiedSelectorProps> = ({ 
  user,
  departments = [], 
  divisions = [],
  onSelectDepartment,
  onSelectDivision,
  onShowDepartmentDetail,
  onShowDivisionDetail,
  onSelectOffice, // Add this prop
  onLogout,
  t,
  language,
  setLanguage
}) => {
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedDivision, setSelectedDivision] = useState<Division | null>(null);
  const [showDivisionOffices, setShowDivisionOffices] = useState(false);
  const [currentOfficePage, setCurrentOfficePage] = useState(1);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const officesPerPage = 5;

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
        setShowDivisionOffices(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowUserDetails(false);
        setShowDivisionOffices(false);
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

  // Complete icon mapping for departments and divisions
  const iconMap = {
    Building: Building,
    Users: Users,
    Award: Award,
    Star: Star,
    ArrowRight: ArrowRight,
    Briefcase: Briefcase,
    Eye: Eye,
    MapPin: MapPin,
    CreditCard: CreditCard,
    Home: Home,
    Package: Package,
    TreePine: TreePine,
    Cpu: Cpu,
    ShoppingCart: ShoppingCart
  };

  // Office pagination
  const indexOfLastOffice = currentOfficePage * officesPerPage;
  const indexOfFirstOffice = indexOfLastOffice - officesPerPage;
  const currentOffices = selectedDivision && selectedDivision.offices && selectedDivision.offices.length > 0
    ? selectedDivision.offices.slice(indexOfFirstOffice, indexOfLastOffice)
    : [];
  const totalOfficePages = selectedDivision && selectedDivision.offices && selectedDivision.offices.length > 0
    ? Math.ceil(selectedDivision.offices.length / officesPerPage)
    : 0;

  const nextOfficePage = () => {
    if (currentOfficePage < totalOfficePages) {
      setCurrentOfficePage(currentOfficePage + 1);
    }
  };

  const prevOfficePage = () => {
    if (currentOfficePage > 1) {
      setCurrentOfficePage(currentOfficePage - 1);
    }
  };

  const handleShowDivisionOffices = (division: Division) => {
    setSelectedDivision(division);
    setShowDivisionOffices(true);
    setCurrentOfficePage(1);
  };

  // New function to handle division selection
  const handleSelectDivision = (division: Division) => {
    // If division has exactly one office, go directly to that office dashboard
    if (division.offices && division.offices.length === 1) {
      onSelectOffice(division.offices[0].id);
    } else {
      // Otherwise, show the division detail page
      onSelectDivision(division);
    }
  };

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      
      {/* Compact Header Section */}
      <div className="relative z-20">
        <div className="max-w-7xl mx-auto p-6">
          {/* Top Bar with Time, User Menu, Language and Logout */}
          <div className="flex flex-col lg:flex-row justify-between items-center mb-8 space-y-4 lg:space-y-0">
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
                        <span>{(departments && departments.length) || 0} Dépt • {(divisions && divisions.length) || 0} Div</span>
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
                              <Briefcase className="w-3 h-3" />
                              <span>{(departments && departments.length) || 0} Départements</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Users className="w-3 h-3" />
                              <span>{(divisions && divisions.length) || 0} Divisions</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="p-4 border-b border-gray-200">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="text-center">
                          <div className="font-semibold text-gray-900">{(departments && departments.length) || 0}</div>
                          <div className="text-gray-600 text-xs">Départements</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-gray-900">{(divisions && divisions.length) || 0}</div>
                          <div className="text-gray-600 text-xs">Divisions</div>
                        </div>
                      </div>
                    </div>

                    {/* Department Tags */}
                    <div className="p-4 border-b border-gray-200">
                      <h4 className="font-semibold text-gray-900 text-sm mb-3">Départements assignés</h4>
                      <div className="flex flex-wrap gap-2">
                        {departments && departments.slice(0, 3).map((dept) => (
                          <span key={dept.id} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs border border-blue-200">
                            {language === 'en' ? dept.nameEn : dept.nameFr}
                          </span>
                        ))}
                        {departments && departments.length > 3 && (
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs border border-gray-200">
                            +{(departments && departments.length - 3) || 0} autres
                          </span>
                        )}
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
                onClick={onLogout}
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
          
          {/* Departments Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                <span className="bg-gradient-to-r from-blue-400 to-orange-400 bg-clip-text text-transparent">
                  Départements Opérationnel
                </span>
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-orange-400 rounded-full mx-auto mt-4"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {departments && departments.map((department, index) => {
                const IconComponent = iconMap[department.icon as keyof typeof iconMap] || Building;
                const isWhiteBg = department.color === 'bg-white';
                
                return (
                  <div
                    key={department.id}
                    className="group cursor-pointer transform transition-all duration-500 hover:scale-105"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div 
                      onClick={() => onSelectDepartment(department)}
                      className="bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl p-6 border border-white border-opacity-20 hover:bg-opacity-20 hover:border-opacity-40 transition-all duration-300 shadow-2xl h-full"
                    >
                      <div className="flex flex-col items-center text-center space-y-4 h-full">
                        {/* Department Icon */}
                        <div className={`w-16 h-16 ${department.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg ${isWhiteBg ? 'border border-gray-200' : ''}`}>
                          <IconComponent className={`w-8 h-8 ${isWhiteBg ? 'text-gray-800' : 'text-white'}`} />
                        </div>
                        
                        {/* Department Name */}
                        <div className="flex-1 flex flex-col justify-center">
                          <h3 className="text-lg font-bold text-white leading-tight mb-2">
                            {language === 'en' ? department.nameEn : department.nameFr}
                          </h3>
                          <div className="w-12 h-1 bg-gradient-to-r from-blue-400 to-orange-400 rounded-full mx-auto"></div>
                        </div>
                        
                        {/* Access Button */}
                        <div className="flex items-center justify-center space-x-2 text-blue-200 group-hover:text-white transition-colors duration-300 pt-2">
                          <span className="text-xs font-semibold">
                            {language === 'en' ? 'Access' : 'Accéder'}
                          </span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* No Departments Message */}
            {(!departments || departments.length === 0) && (
              <div className="text-center text-white py-12">
                <Building className="w-16 h-16 mx-auto mb-4 text-blue-200" />
                <h3 className="text-xl font-semibold mb-2">Aucun département disponible</h3>
                <p className="text-blue-100">Les départements seront disponibles prochainement</p>
              </div>
            )}
          </div>

          {/* Divisions Section */}
          <div>
            <div className="text-center mb-12">
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                <span className="bg-gradient-to-r from-blue-400 to-orange-900 bg-clip-text text-transparent">
                  Divisions Support
                </span>
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-orange-400 rounded-full mx-auto mt-4"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {divisions && divisions.map((division, index) => {
                const IconComponent = iconMap[division.icon as keyof typeof iconMap] || Building;
                const isWhiteBg = division.color === 'bg-white';
                const hasSingleOffice = division.offices && division.offices.length === 1;
                
                return (
                  <div
                    key={division.id}
                    className="group cursor-pointer transform transition-all duration-500 hover:scale-105"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div 
                      onClick={() => handleSelectDivision(division)}
                      className="bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl p-6 border border-white border-opacity-20 hover:bg-opacity-20 hover:border-opacity-40 transition-all duration-300 shadow-2xl h-full"
                    >
                      <div className="flex flex-col items-center text-center space-y-4 h-full">
                        {/* Division Icon */}
                        <div className={`w-16 h-16 ${division.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg ${isWhiteBg ? 'border border-gray-200' : ''}`}>
                          <IconComponent className={`w-8 h-8 ${isWhiteBg ? 'text-gray-800' : 'text-white'}`} />
                        </div>
                        
                        {/* Division Name */}
                        <div className="flex-1 flex flex-col justify-center">
                          <h3 className="text-lg font-bold text-white leading-tight mb-2">
                            {language === 'en' ? division.nameEn : division.nameFr}
                          </h3>
                          <div className="w-12 h-1 bg-gradient-to-r from-blue-400 to-orange-400 rounded-full mx-auto"></div>
                        </div>

                        {/* Offices Count */}
                        <div className="text-blue-200 text-xs">
                          <span className="font-semibold">{(division.offices && division.offices.length) || 0} bureaux</span>
                          {hasSingleOffice && (
                            <span className="ml-2 text-green-300">• Accès direct</span>
                          )}
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex flex-col space-y-2 w-full">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectDivision(division);
                            }}
                            className="bg-gradient-to-r from-orange-500 to-blue-900 hover:from-blue-700 hover:to-orange-700 text-white font-bold py-2 px-4 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-xl hover:shadow-2xl transform hover:scale-105 text-sm"
                          >
                            <span>
                              {hasSingleOffice 
                                ? (language === 'en' ? 'Go to Office' : 'Accéder au Bureau') 
                                : (language === 'en' ? 'Select' : 'Sélectionner')
                              }
                            </span>
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" />
                          </button>
                          {!hasSingleOffice && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleShowDivisionOffices(division);
                              }}
                              className="bg-white/10 hover:bg-white/20 text-white font-medium py-1 px-3 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-1 border border-white/30 hover:border-white/50 text-xs"
                            >
                              <Eye className="w-3 h-3" />
                              <span>Voir bureaux</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* No Divisions Message */}
            {(!divisions || divisions.length === 0) && (
              <div className="text-center text-white py-12">
                <Building className="w-16 h-16 mx-auto mb-4 text-blue-200" />
                <h3 className="text-xl font-semibold mb-2">Aucune division disponible</h3>
                <p className="text-blue-100">Les divisions seront disponibles prochainement</p>
              </div>
            )}
          </div>

          {/* Footer Information */}
          <div className="text-center mt-16 text-blue-100 text-sm space-y-3">
            <div className="flex items-center justify-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="font-medium">Gestion Intégrée</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="font-medium">Excellence Professionnelle</span>
              </div>
            </div>
            <p className="font-medium">Yaoundé, Cameroun</p>
            <p>+237 6XX XXX XXX • contact@geocasagroup.com</p>
          </div>
        </div>
      </div>

      {/* Division Offices Modal */}
      {showDivisionOffices && selectedDivision && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div 
            ref={modalRef}
            className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-3xl p-8 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className={`w-16 h-16 ${selectedDivision.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                    <Building className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold">
                      {language === 'en' ? selectedDivision.nameEn : selectedDivision.nameFr}
                    </h2>
                    <p className="text-blue-100 text-lg">
                      {(selectedDivision.offices && selectedDivision.offices.length) || 0} {language === 'en' ? 'offices' : 'bureaux'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDivisionOffices(false)}
                  className="text-white hover:text-gray-200 text-3xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Bureaux de la Division</h3>
              
              {/* Offices List */}
              <div className="space-y-4 mb-6">
                {currentOffices.length > 0 ? (
                  currentOffices.map((office, index) => (
                    <div 
                      key={index} 
                      className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:bg-gray-100 cursor-pointer transition-colors"
                      onClick={() => {
                        onSelectOffice(office.id);
                        setShowDivisionOffices(false);
                      }}
                    >
                      <h4 className="font-semibold text-gray-900 mb-2">{office.name}</h4>
                      <p className="text-sm text-gray-600">{office.description}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Aucun bureau disponible pour cette division
                  </div>
                )}
              </div>

              {/* Office Pagination Controls */}
              {selectedDivision.offices && selectedDivision.offices.length > officesPerPage && (
                <div className="flex justify-center items-center mb-6 space-x-4">
                  <button
                    onClick={prevOfficePage}
                    disabled={currentOfficePage === 1}
                    className={`p-2 rounded-full ${currentOfficePage === 1 
                      ? 'bg-gray-300 cursor-not-allowed' 
                      : 'bg-blue-100 hover:bg-blue-200'} transition-colors`}
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-700" />
                  </button>
                  
                  <span className="text-gray-700 font-medium">
                    {currentOfficePage} / {totalOfficePages}
                  </span>
                  
                  <button
                    onClick={nextOfficePage}
                    disabled={currentOfficePage === totalOfficePages}
                    className={`p-2 rounded-full ${currentOfficePage === totalOfficePages 
                      ? 'bg-gray-300 cursor-not-allowed' 
                      : 'bg-blue-100 hover:bg-blue-200'} transition-colors`}
                  >
                    <ChevronRight className="w-5 h-5 text-gray-700" />
                  </button>
                </div>
              )}

              {/* Close Button */}
              <div className="flex justify-end">
                <button
                  onClick={() => setShowDivisionOffices(false)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                      <span className="text-gray-600">Départements assignés</span>
                      <span className="font-semibold text-gray-900">{(departments && departments.length) || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Divisions assignées</span>
                      <span className="font-semibold text-gray-900">{(divisions && divisions.length) || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Statut</span>
                      <span className="font-semibold text-green-600">Actif</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Departments */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Départements Assignés</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {departments && departments.map((dept) => (
                    <div key={dept.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {language === 'en' ? dept.nameEn : dept.nameFr}
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">
                        {language === 'en' ? dept.descriptionEn : dept.descriptionFr}
                      </p>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          Accès complet
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Divisions */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Divisions Assignées</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {divisions && divisions.map((div) => (
                    <div key={div.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {language === 'en' ? div.nameEn : div.nameFr}
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">{div.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                          {(div.offices && div.offices.length) || 0} bureaux
                        </span>
                        <span className="text-xs text-gray-500">Superviseur</span>
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

export default UnifiedSelector;