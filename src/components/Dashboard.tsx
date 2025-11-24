import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  User as UserIcon, 
  Clock, 
  Calendar,
  Building,
  Mail,
  BarChart,
  FileText,
  Users,
  Archive,
  Package,
  Settings,
  BookOpen,
  Library,
  UserCheck,
  BarChart2,
  Monitor,
  Send,
  Cog,
  Upload,
  Home,
  BarChart3,
  Zap,
  Shield,
  Bell,
  Search,
  ClipboardList,
  Plus,
  Menu,
  X,
  ChevronRight,
  History,
  UserPlus,
  DollarSign,
  Target,
  Award,
  Gavel,
  Folder,
  PlayCircle,
  RefreshCw,
  Download,
  UploadCloud,
  MessageSquare,
  Cpu,
  MapPin,
  Landmark,
  TrendingUp,
  DollarSign as FinanceIcon,
  ShoppingCart
} from 'lucide-react';
import { User, Department, Division } from '../types';
import LandCadastralDashboard from './dashboards/LandCadastralDashboard';
import FinancingDashboard from './dashboards/FinancingDashboard';
import SalesManagementDashboard from './dashboards/SalesManagementDashboard';

interface DashboardProps {
  user: User;
  department: Department;
  division?: Division;
  onBack: () => void;
  onLogout: () => void;
  t: (key: string) => string;
  language: string;
}

export type GFCModule =
  | 'dashboard'
  | 'dossiers'
  | 'phase1&2-traitement'
  | 'phase3&4'
  | 'phase5'
  | 'mes-dossiers'
  | 'recherche'
  | 'courrier'
  | 'logistique'
  | 'archives'
  | 'statistiques'
  | 'profile'
  | 'parametres'
  | 'utilisateurs';

const Dashboard: React.FC<DashboardProps> = ({ 
  user, 
  department, 
  division,
  onBack,
  onLogout, 
  t, 
  language 
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<GFCModule>('dashboard');
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['modules']);
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const [sessionTime, setSessionTime] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notificationsCount] = useState(3);
  const [deviceType, setDeviceType] = useState('Desktop');

  // Update time every second
  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
      setSessionTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timeInterval);
  }, []);

  // Detect device type
  useEffect(() => {
    const detectDevice = () => {
      const userAgent = navigator.userAgent;
      const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent);
      const isTablet = /iPad|Android/i.test(userAgent) && window.innerWidth >= 768;
      
      if (isMobile && !isTablet) {
        setDeviceType('Mobile');
      } else if (isTablet) {
        setDeviceType('Tablet');
      } else {
        setDeviceType('Desktop');
      }
    };

    detectDevice();
    window.addEventListener('resize', detectDevice);
    return () => window.removeEventListener('resize', detectDevice);
  }, []);

  // Helper functions
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
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatSessionTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev => {
      if (prev.includes(menuId)) {
        return prev.filter(id => id !== menuId);
      } else {
        return [menuId];
      }
    });
  };

  const isMenuExpanded = (menuId: string) => expandedMenus.includes(menuId);

  const getDeviceIcon = () => {
    switch (deviceType) {
      case 'Mobile':
        return <Monitor className="w-3 h-3" />;
      case 'Tablet':
        return <Monitor className="w-3 h-3" />;
      default:
        return <Monitor className="w-3 h-3" />;
    }
  };

  // Get department-specific configuration
  const getDepartmentConfig = () => {
    const configs = {
      'land-cadastral': {
        name: 'Gestion Foncière & Cadastrale',
        shortName: 'GFC',
        icon: MapPin,
        color: 'from-blue-600 to-blue-700',
        gradient: 'from-blue-50 to-purple-50',
        description: 'Gestion des terrains et cadastre'
      },
      'financing': {
        name: 'Finance & Investissement',
        shortName: 'Finance',
        icon: FinanceIcon,
        color: 'from-green-600 to-green-700',
        gradient: 'from-green-50 to-teal-50',
        description: 'Gestion financière et investissements'
      },
      'sales-management': {
        name: 'Commercial & Ventes',
        shortName: 'Commercial',
        icon: ShoppingCart,
        color: 'from-purple-600 to-purple-700',
        gradient: 'from-purple-50 to-pink-50',
        description: 'Gestion commerciale et ventes'
      }
    };

    return configs[department.id as keyof typeof configs] || {
      name: department.nameFr,
      shortName: department.nameFr,
      icon: Building,
      color: 'from-gray-600 to-gray-700',
      gradient: 'from-gray-50 to-blue-50',
      description: 'Système de gestion'
    };
  };

  const departmentConfig = getDepartmentConfig();
  const DepartmentIcon = departmentConfig.icon;

  // Get department-specific sidebar items
  const getSidebarItems = () => {
    const baseItems = [
      { 
        id: 'dashboard' as GFCModule, 
        label: 'Tableau de Bord', 
        icon: Home,
        description: 'Vue générale et indicateurs'
      },
      { 
        id: 'dossiers' as GFCModule, 
        label: 'Gestion des Dossiers', 
        icon: Folder,
        description: 'Dossiers réceptionnés et en cours'
      },
       { 
         id: 'phase1&2-traitement' as GFCModule, 
         label: 'PHASE 1 & 2', 
         icon: PlayCircle, 
          description: 'initialisation et contractualisation'
       },
      { 
        id: 'phase3&4' as GFCModule, 
        label: 'PHASE 3 & 4', 
        icon: FileText,
        description: 'exécution technique et suivi administratif'
      },
      { 
        id: 'phase5' as GFCModule, 
        label: 'PHASE 5 ', 
        icon: FileText,
        description: 'clôture & archivage'
      }
    ];

    const departmentSpecificItems = {
      'land-cadastral': [
        { 
          id: 'recherche' as GFCModule, 
          label: 'Recherche Avancée', 
          icon: Search,
          description: 'Recherche multicritères terrains'
        },
        { 
          id: 'courrier' as GFCModule, 
          label: 'Courrier & Communication', 
          icon: Mail,
          description: 'Messagerie et correspondance'
        },
        { 
          id: 'logistique' as GFCModule, 
          label: 'Logistique & Stocks', 
          icon: Package,
          description: 'Gestion des ressources'
        },
        { 
          id: 'archives' as GFCModule, 
          label: 'Archives & Bibliothèque', 
          icon: Archive,
          description: 'Archivage sécurisé'
        }
          
      ],
      'financing': [
        { 
          id: 'analytics' as GFCModule, 
          label: 'Analyses Financières', 
          icon: TrendingUp,
          description: 'Analyses et prévisions financières'
        },
        { 
          id: 'investissements' as GFCModule, 
          label: 'Gestion Investissements', 
          icon: DollarSign,
          description: 'Portefeuille investissements'
        },
        { 
          id: 'rapports' as GFCModule, 
          label: 'Rapports Financiers', 
          icon: BarChart3,
          description: 'Rapports et états financiers'
        },
        { 
          id: 'budget' as GFCModule, 
          label: 'Gestion Budget', 
          icon: ClipboardList,
          description: 'Planification et suivi budget'
        }
      ],
      'sales-management': [
        { 
          id: 'ventes' as GFCModule, 
          label: 'Gestion Ventes', 
          icon: ShoppingCart,
          description: 'Pipeline des ventes'
        },
        { 
          id: 'clients' as GFCModule, 
          label: 'Relation Clients', 
          icon: Users,
          description: 'Gestion de la relation client'
        },
        { 
          id: 'contrats' as GFCModule, 
          label: 'Gestion Contrats', 
          icon: FileText,
          description: 'Contrats et engagements'
        },
        { 
          id: 'performance' as GFCModule, 
          label: 'Performance Commerciale', 
          icon: Target,
          description: 'Indicateurs performance'
        }
      ]
    };

    const specificItems = departmentSpecificItems[department.id as keyof typeof departmentSpecificItems] || [];

    return [
      {
        id: 'modules',
        label: `Modules ${departmentConfig.shortName}`,
        icon: DepartmentIcon,
        subItems: [...baseItems, ...specificItems, { 
          id: 'statistiques' as GFCModule, 
          label: 'Rapports & Statistiques', 
          icon: BarChart3,
          description: 'Analyses et reporting'
        }]
      },
      {
        id: 'administration',
        label: 'Administration',
        icon: Settings,
        subItems: [
          { id: 'profile' as GFCModule, label: 'Profil Utilisateur', icon: Users },
          { id: 'parametres' as GFCModule, label: 'Paramètres', icon: Settings },
          { id: 'utilisateurs' as GFCModule, label: 'Gestion Utilisateurs', icon: UserCheck }
        ]
      }
    ];
  };

  const sidebarItems = getSidebarItems();

  // Get department-specific stats
  const getDepartmentStats = () => {
    const stats = {
      'land-cadastral': {
        pending: 12,
        inProgress: 45,
        completed: 28,
        pendingLabel: 'À valider',
        inProgressLabel: 'En cours',
        completedLabel: 'Terminés'
      },
      'financing': {
        pending: 8,
        inProgress: 23,
        completed: 156,
        pendingLabel: 'En attente',
        inProgressLabel: 'En analyse',
        completedLabel: 'Traités'
      },
      'sales-management': {
        pending: 15,
        inProgress: 32,
        completed: 89,
        pendingLabel: 'Prospects',
        inProgressLabel: 'Négociation',
        completedLabel: 'Ventes'
      }
    };

    return stats[department.id as keyof typeof stats] || {
      pending: 0,
      inProgress: 0,
      completed: 0,
      pendingLabel: 'À traiter',
      inProgressLabel: 'En cours',
      completedLabel: 'Terminés'
    };
  };

  const departmentStats = getDepartmentStats();

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
      case 'dossiers':
      case 'phase3&4':
      case 'mes-dossiers':
      case 'recherche':
      case 'courrier':
      case 'logistique':
      case 'archives':
      case 'statistiques':
      case 'phase1&2-traitement':
      case 'phase5':
      case 'budget':
      case 'ventes':
      case 'clients':
      case 'contrats':
      case 'performance':
        switch (department.id) {
          case 'land-cadastral':
            return (
              <LandCadastralDashboard 
                activeModule={activeSection}
                onModuleChange={setActiveSection}
                user={user}
                department={department}
                language={language}
              />
            );
          case 'financing':
            return (
              <FinancingDashboard 
                activeModule={activeSection}
                user={user}
                department={department}
                language={language}
              />
            );
          case 'sales-management':
            return (
              <SalesManagementDashboard 
                activeModule={activeSection}
                user={user}
                department={department}
                language={language}
              />
            );
          default:
            return (
              <LandCadastralDashboard 
                activeModule={activeSection}
                onModuleChange={setActiveSection}
                user={user}
                department={department}
                language={language}
              />
            );
        }
      default:
        return (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Module en développement
            </h3>
            <p className="text-gray-600">
              Ce module sera bientôt disponible.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="flex flex-col h-screen">
          {/* Sidebar Header - Dynamique selon le département */}
          <div className={`flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r ${departmentConfig.gradient}`}>
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 bg-gradient-to-br ${departmentConfig.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                <DepartmentIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 text-lg">{departmentConfig.shortName} Dashboard</h2>
                <p className="text-sm text-gray-600">{departmentConfig.name}</p>
                {division && (
                  <p className="text-xs text-gray-500 mt-1">{division.nameFr}</p>
                )}
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Quick Stats - Dynamiques selon le département */}
          <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-4 text-sm">
                <div className="text-center">
                  <div className="font-bold text-green-700 text-lg">{departmentStats.pending}</div>
                  <div className="text-green-600 text-xs">{departmentStats.pendingLabel}</div>
                </div>
                <div className="h-6 w-px bg-green-200"></div>
                <div className="text-center">
                  <div className="font-bold text-blue-700 text-lg">{departmentStats.inProgress}</div>
                  <div className="text-blue-600 text-xs">{departmentStats.inProgressLabel}</div>
                </div>
                <div className="h-6 w-px bg-blue-200"></div>
                <div className="text-center">
                  <div className="font-bold text-purple-700 text-lg">{departmentStats.completed}</div>
                  <div className="text-purple-600 text-xs">{departmentStats.completedLabel}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Session Timer */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-blue-800">Session active</span>
              </div>
              <div className="text-center">
                <div className="text-sm font-bold text-blue-900 font-mono">
                  {formatSessionTime(sessionTime)}
                </div>
                <div className="text-xs text-blue-600">Durée</div>
              </div>
            </div>
          </div>

          {/* Navigation Menu - Dynamique selon le département */}
          <nav className="flex-1 overflow-y-auto py-4">
            <div className="px-4 space-y-2">
              {sidebarItems.map((item) => (
                <div key={item.id} className="space-y-1">
                  <div className="relative">
                    <button
                      onClick={() => toggleMenu(item.id)}
                      onMouseEnter={() => setHoveredMenu(item.id)}
                      onMouseLeave={() => setHoveredMenu(null)}
                      className={`w-full flex items-center justify-between px-4 py-3 text-left rounded-xl transition-all duration-200 ${
                        activeSection === item.id
                          ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-600 shadow-md'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon className={`w-5 h-5 ${
                          activeSection === item.id ? 'text-blue-600' : 'text-gray-400'
                        }`} />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      {item.subItems && (
                        <div className={`transform transition-transform duration-200 ${
                          isMenuExpanded(item.id) ? 'rotate-90' : ''
                        }`}>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </div>
                      )}
                    </button>

                    {/* Tooltip au survol */}
                    {hoveredMenu === item.id && item.subItems && !isMenuExpanded(item.id) && item.subItems.length > 0 && (
                      <div className="absolute left-full top-0 ml-2 z-50 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 p-4">
                        <div className="space-y-2">
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                            <item.icon className="w-4 h-4 mr-2 text-blue-600" />
                            {item.label}
                          </h4>
                          <div className="grid grid-cols-1 gap-2">
                            {item.subItems.slice(0, 5).map((subItem) => (
                              <div key={subItem.id} className="flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-600 cursor-pointer p-2 rounded-lg hover:bg-blue-50">
                                <subItem.icon className="w-4 h-4" />
                                <span>{subItem.label}</span>
                              </div>
                            ))}
                            {item.subItems.length > 5 && (
                              <div className="text-xs text-gray-500 text-center pt-2 border-t">
                                +{item.subItems.length - 5} autres modules...
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Sous-menu déroulant */}
                  {item.subItems && isMenuExpanded(item.id) && (
                    <div className="ml-4 space-y-1 animate-fadeIn border-l-2 border-gray-200 pl-4">
                      {item.subItems.map((subItem) => (
                        <button
                          key={subItem.id}
                          onClick={() => setActiveSection(subItem.id)}
                          className={`w-full flex items-center space-x-3 px-4 py-2 text-left rounded-lg transition-all duration-200 ${
                            activeSection === subItem.id
                              ? 'bg-blue-100 text-blue-700 shadow-md border-l-4 border-blue-600'
                              : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                          }`}
                        >
                          <subItem.icon className={`w-4 h-4 ${
                            activeSection === subItem.id ? 'text-blue-600' : 'text-gray-400'
                          }`} />
                          <div className="flex-1">
                            <span className="text-sm font-medium">{subItem.label}</span>
                            {subItem.description && (
                              <span className={`text-xs block mt-1 ${
                                activeSection === subItem.id ? 'text-blue-600' : 'text-gray-500'
                              }`}>
                                {subItem.description}
                              </span>
                            )}
                          </div>
                          {activeSection === subItem.id && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </nav>

          {/* User Info */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">{user.role || `Utilisateur ${departmentConfig.shortName}`}</p>
              </div>
            </div>
            
            {/* Session Info */}
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Session:</span>
                <span className="font-mono font-semibold text-blue-600">{formatSessionTime(sessionTime)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-80">
        {/* Header */}
        <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              
              {/* Left Section - Menu & Back Button */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
                >
                  <Menu className="w-6 h-6 text-gray-600" />
                </button>
                
                <button
                  onClick={onBack}
                  className="flex items-center space-x-3 px-6 py-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all duration-200 shadow-lg"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span className="font-medium">Retour</span>
                </button>
              </div>

              {/* Center Section - Time Display */}
              <div className="hidden md:flex items-center space-x-6">
                <div className="flex items-center space-x-4 bg-gray-50 rounded-2xl px-6 py-3 border border-gray-200">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <div className="text-center">
                      <div className="text-xl font-bold text-gray-900 font-mono">
                        {formatTime(currentTime)}
                      </div>
                      <div className="text-xs text-gray-500">Heure actuelle</div>
                    </div>
                  </div>
                  
                  <div className="w-px h-10 bg-gray-300"></div>
                  
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-orange-600" />
                    <div className="text-center">
                      <div className="text-sm font-semibold text-gray-900 capitalize">
                        {currentTime.toLocaleDateString('fr-FR', { 
                          weekday: 'short', 
                          day: 'numeric', 
                          month: 'short' 
                        })}
                      </div>
                      <div className="text-xs text-gray-500">Date du jour</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Section - Actions & User */}
              <div className="flex items-center space-x-4">
                {/* Quick Actions */}
                <div className="hidden lg:flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                    <Search className="w-5 h-5" />
                  </button>
                  <button className="relative p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                    <Bell className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
                  </button>
                </div>

                {/* User Profile & Logout */}
                <div className="flex items-center space-x-3 bg-gray-50 rounded-2xl px-4 py-2 border border-gray-200">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <UserIcon className="w-4 h-4 text-white" />
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-sm font-semibold text-gray-900">{user.name}</div>
                    <div className="text-xs text-gray-600 flex items-center space-x-1">
                      {getDeviceIcon()}
                      <span>{deviceType}</span>
                    </div>
                  </div>
                  <button
                    onClick={onLogout}
                    className="flex items-center space-x-1 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1 rounded-lg transition-all duration-200 border border-red-200 hover:border-red-300"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-sm font-medium">Sortir</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;