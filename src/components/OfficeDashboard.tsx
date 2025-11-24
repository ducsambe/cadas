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
  Tag,
  RefreshCw,
  Download,
  UploadCloud,
  MessageSquare,
  Cpu
} from 'lucide-react';
import { User } from '../types';
import { DIVISIONS } from '../constants';
import SecretaryGeneralDashboard from './offices/secretary-general/SecretaryGeneralDashboard';
import LogisticsDashboard from './offices/logistics-general/LogisticsDashboard';
import ArchivesDashboard from './offices/archives-documentation/ArchivesDashboard';
import HRAdministrationDashboard from './offices/hr/HRAdministrationDashboard';
import HRDevelopmentDashboard from './offices/hr/HRDevelopmentDashboard';
import GeneralAdminLogisticsDashboard from './offices/general-affairs/GeneralAdminLogisticsDashboard';

interface OfficeDashboardProps {
  user: User;
  officeId: string;
  onBack: () => void;
  onLogout: () => void;
  language: string;
}

const OfficeDashboard: React.FC<OfficeDashboardProps> = ({
  user,
  officeId,
  onBack,
  onLogout,
  language
}) => {
  const [sessionTime, setSessionTime] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['main']);
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);

  // Find the office details
  const office = DIVISIONS.flatMap(div => div.offices).find(off => off.id === officeId);
  
  // Update time every second
  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
      setSessionTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timeInterval);
  }, []);

  // Helper functions
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
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

  // Sidebar menu items based on office type
  const getSidebarItems = () => {
    const commonItems = [
      { id: 'dashboard', label: 'Tableau de bord', icon: Home },
      { id: 'analytics', label: 'Analyses', icon: BarChart3 },
      { id: 'reports', label: 'Rapports', icon: FileText },
      { id: 'settings', label: 'Paramètres', icon: Settings }
    ];

    switch (officeId) {
      case 'general-admin-logistics':
        return [
          { id: 'dashboard', label: 'Tableau de bord – Administration & Logistique', icon: Home },
          { 
            id: 'Processus', 
            label: 'Processus Opérationnels', 
            icon: Mail,
            subItems: [
              { id: 'correspondances', label: 'Correspondances officielles', icon: Download },
              { id: 'contrats-prestataires', label: 'Contrats administratifs & prestataires', icon: UploadCloud },
              { id: 'patrimoine', label: 'Gestion du Patrimoine', icon: ClipboardList },
               { id: 'approvisionnement-stock', label: 'Approvisionnement & Stock',  icon: Package,},
               { id: 'logistique-missions', label: 'Organisation logistique & missions',  icon: Send, }
            ]
          },
          { id: 'gestion-documentaire',  label: 'Gestion Documentaire',  icon: Archive,  },
          { id: 'relances-notifications', label: 'Relances & Notifications', icon: Bell },
          { id: 'rapports-statistiques', label: 'Rapports & Statistiques', icon: BarChart3 },
          { id: 'parametres-securite', label: 'Paramètres & Sécurité', icon: Settings }
        ];
      case 'reception-documentation-archiving':
  return [
    { id: 'dashboard', label: 'Tableau de bord – Accueil & Archivage', icon: Home },
    {
      id: 'processus-operationnels',
      label: 'Processus Opérationnels',
      icon: Settings,
      subItems: [
        { id: 'accueil-standard', label: 'Accueil & Standard', icon: UserIcon,},
        { id: 'suivi-prestations', label: 'Réception & Demandes Clients', icon: FileText },
        { id: 'archivage-documentaire', label: 'Archivage Documentaire', icon: Archive },
        { id: 'consultation-documentaire', label: 'Consultation Documentaire', icon: Search }
      ]
    },
    { id: 'gestion-avancee', label: 'Gestion Documentaire Avancée', icon: Cpu },
    { id: 'relances-notifications', label: 'Relances & Notifications', icon: Bell },
    { id: 'communication', label: 'Communication Interservices', icon: MessageSquare },
    { id: 'reports', label: 'Rapports & Statistiques', icon: BarChart3 },
    { id: 'settings', label: 'Paramètres & Sécurité', icon: Settings }
  ];
      case 'secretary-general':
        return [
          { id: 'dashboard', label: 'Vue d\'ensemble', icon: Home },
          { 
            id: 'courrier', 
            label: 'Gestion Courrier', 
            icon: Mail,
            subItems: [
              { id: 'courrier-entrant', label: 'Courrier Entrant', icon: Download },
              { id: 'courrier-sortant', label: 'Courrier Sortant', icon: UploadCloud },
              { id: 'suivi-courrier', label: 'Suivi Courrier', icon: ClipboardList }
            ]
          },
          { 
            id: 'evenements', 
            label: 'Événements', 
            icon: Calendar,
            subItems: [
              { id: 'planification', label: 'Planification', icon: Calendar },
              { id: 'invitations', label: 'Invitations', icon: Send },
              { id: 'suivi-evenements', label: 'Suivi Événements', icon: ClipboardList }
            ]
          },
          { 
            id: 'prestations', 
            label: 'Gestion des Prestations', 
            icon: Zap,
            subItems: [
              { id: 'prestations-dashboard', label: 'Tableau de bord des prestations', icon: BarChart2 },
              { id: 'nouvelle-prestation', label: 'Nouvelle demande de prestation', icon: Plus },
              { id: 'suivi-prestations', label: 'Suivi des prestations', icon: ClipboardList },
              { id: 'validation-interne', label: 'Validation interne', icon: UserCheck },
              { id: 'execution-traitement', label: 'Exécution / Traitement', icon: Cog },
              { id: 'livraison-cloture', label: 'Livraison & clôture', icon: Send },
              { id: 'facturation-paiement', label: 'Facturation & paiement', icon: FileText },
              { id: 'rapports-statistiques', label: 'Rapports & statistiques', icon: BarChart3 },
              { id: 'parametres-modeles', label: 'Paramètres & modèles', icon: Settings }
            ]
          },
          { 
            id: 'archives', 
            label: 'Gestion des Archives', 
            icon: Archive,
            subItems: [
              { id: 'archives-dashboard', label: 'Tableau de bord des archives', icon: BarChart2 },
              { id: 'nouveau-document', label: 'Enregistrement nouveau document', icon: Upload },
              { id: 'catalogue-documents', label: 'Catalogue des documents', icon: Library },
              { id: 'prets-consultations', label: 'Prêts et consultations', icon: BookOpen },
              { id: 'recherche-avancee', label: 'Recherche avancée', icon: Search },
              { id: 'historique-suivi', label: 'Historique et suivi', icon: History },
              { id: 'rapports-archives', label: 'Rapports & statistiques', icon: BarChart3 },
              { id: 'parametres-droits', label: 'Paramètres & droits d\'accès', icon: Shield }
            ]
          },
          { 
            id: 'bibliotheque', 
            label: 'Gestion de la Bibliothèque', 
            icon: BookOpen,
            subItems: [
              { id: 'bibliotheque-dashboard', label: 'Tableau de bord de la bibliothèque', icon: BarChart2 },
              { id: 'catalogue-bibliotheque', label: 'Catalogue des documents', icon: Library },
              { id: 'nouveau-document-bib', label: 'Enregistrement nouveau document', icon: Upload },
              { id: 'prets-consultations-bib', label: 'Prêts et consultations', icon: BookOpen },
              { id: 'recherche-avancee-bib', label: 'Recherche avancée', icon: Search },
              { id: 'historique-suivi-bib', label: 'Historique et suivi', icon: History },
              { id: 'rapports-bibliotheque', label: 'Rapports & statistiques', icon: BarChart3 },
              { id: 'parametres-bibliotheque', label: 'Paramètres & droits d\'accès', icon: Shield }
            ]
          },
        ];
      case 'logistics-general':
        return [
          { id: 'dashboard', label: 'Vue d\'ensemble', icon: Home },
          { 
            id: 'stock', 
            label: 'Gestion des Stocks', 
            icon: Package,
            subItems: [
              { id: 'inventaire', label: 'Inventaire', icon: ClipboardList },
              { id: 'mouvements', label: 'Mouvements de Stock', icon: RefreshCw },
              { id: 'alertes', label: 'Alertes Stock', icon: Bell }
            ]
          },
          { 
            id: 'equipements', 
            label: 'Gestion des Équipements', 
            icon: Monitor,
            subItems: [
              { id: 'parc', label: 'Parc Équipements', icon: Monitor },
              { id: 'maintenance', label: 'Maintenance', icon: Settings },
              { id: 'attribution', label: 'Attribution', icon: UserCheck }
            ]
          },
          { 
            id: 'commandes', 
            label: 'Commandes', 
            icon: Plus,
            subItems: [
              { id: 'nouvelle-commande', label: 'Nouvelle Commande', icon: Plus },
              { id: 'suivi-commandes', label: 'Suivi Commandes', icon: ClipboardList },
              { id: 'historique', label: 'Historique', icon: History }
            ]
          },
          { id: 'analytics', label: 'Analyses', icon: BarChart3 },
          { id: 'reports', label: 'Rapports', icon: FileText },
          { id: 'settings', label: 'Paramètres', icon: Settings }
        ];
      case 'archives-documentation':
        return [
          { id: 'dashboard', label: 'Vue d\'ensemble du Bureau', icon: Home },
          { 
            id: 'prestations', 
            label: 'Gestion des Prestations', 
            icon: Zap,
            subItems: [
              { id: 'prestations-dashboard', label: 'Tableau de bord des prestations', icon: BarChart2 },
              { id: 'nouvelle-prestation', label: 'Nouvelle demande de prestation', icon: Plus },
              { id: 'suivi-prestations', label: 'Suivi des prestations', icon: ClipboardList },
              { id: 'validation-interne', label: 'Validation interne', icon: UserCheck },
              { id: 'execution-traitement', label: 'Exécution / Traitement', icon: Cog },
              { id: 'livraison-cloture', label: 'Livraison & clôture', icon: Send },
              { id: 'facturation-paiement', label: 'Facturation & paiement', icon: FileText },
              { id: 'rapports-statistiques', label: 'Rapports & statistiques', icon: BarChart3 },
              { id: 'parametres-modeles', label: 'Paramètres & modèles', icon: Settings }
            ]
          },
          { 
            id: 'visites-menu', 
            label: 'Gestion des Visites', 
            icon: Users,
            subItems: [
              { id: 'visites', label: 'Tableau de bord des visites', icon: BarChart2 },
              { id: 'planification-visite', label: 'Planification d\'une visite', icon: Plus },
              { id: 'suivi-visites', label: 'Suivi des visites', icon: ClipboardList },
              { id: 'visites-recurrentes', label: 'Visites récurrentes', icon: Calendar },
              { id: 'historique-visites', label: 'Historique et archivage', icon: History },
              { id: 'rapports-visites', label: 'Rapports & statistiques', icon: BarChart3 },
              { id: 'parametres-visites', label: 'Paramètres & modèles', icon: Settings }
            ]
          },
          { 
            id: 'archives', 
            label: 'Gestion des Archives', 
            icon: Archive,
            subItems: [
              { id: 'archives-dashboard', label: 'Tableau de bord des archives', icon: BarChart2 },
              { id: 'nouveau-document', label: 'Enregistrement nouveau document', icon: Upload },
              { id: 'catalogue-documents', label: 'Catalogue des documents', icon: Library },
              { id: 'prets-consultations', label: 'Prêts et consultations', icon: BookOpen },
              { id: 'recherche-avancee', label: 'Recherche avancée', icon: Search },
              { id: 'historique-suivi', label: 'Historique et suivi', icon: History },
              { id: 'rapports-archives', label: 'Rapports & statistiques', icon: BarChart3 },
              { id: 'parametres-droits', label: 'Paramètres & droits d\'accès', icon: Shield }
            ]
          },
          { 
            id: 'bibliotheque', 
            label: 'Gestion de la Bibliothèque', 
            icon: BookOpen,
            subItems: [
              { id: 'bibliotheque-dashboard', label: 'Tableau de bord de la bibliothèque', icon: BarChart2 },
              { id: 'catalogue-bibliotheque', label: 'Catalogue des documents', icon: Library },
              { id: 'nouveau-document-bib', label: 'Enregistrement nouveau document', icon: Upload },
              { id: 'prets-consultations-bib', label: 'Prêts et consultations', icon: BookOpen },
              { id: 'recherche-avancee-bib', label: 'Recherche avancée', icon: Search },
              { id: 'historique-suivi-bib', label: 'Historique et suivi', icon: History },
              { id: 'rapports-bibliotheque', label: 'Rapports & statistiques', icon: BarChart3 },
              { id: 'parametres-bibliotheque', label: 'Paramètres & droits d\'accès', icon: Shield }
            ]
          }
        ];
      case 'personnel-career-admin':
        return [
          { 
            id: 'dashboard-rh', 
            label: 'Tableau de bord RH',  
            icon: Home 
          },
          { 
            id: 'processus-rh',  
            label: 'Gestion des processus RH', 
            icon: Users,
            subItems: [
              { 
                id: 'enregistrement-collaborateur', 
                label: 'Enregistrement collaborateur',  
                icon: UserPlus,
              },
              { 
                id: 'contrats-mouvements', 
                label: 'Gestion des contrats et mouvements', 
                icon: FileText,
              },
              { 
                id: 'paie-obligations',  
                label: 'Paie & Obligations sociales', 
                icon: DollarSign,
              },
              { 
                id: 'presences-conges', 
                label: 'Présences & Congés', 
                icon: Calendar,
              },
              { 
                id: 'evaluations-performance',  
                label: 'Évaluations & Performance', 
                icon: Target,
              },
              { 
                id: 'carrieres-promotions', 
                label: 'Carrières & Promotions', 
                icon: Award,
              },
              { 
                id: 'discipline-sanctions', 
                label: 'Discipline & Sanctions', 
                icon: Gavel,
              }
            ]
          },
          { 
            id: 'recherche-avancee-rh', 
            label: 'Recherche avancée', 
            icon: Search,
          },
          { 
            id: 'relances-notifications', 
            label: 'Relances & Notifications', 
            icon: Bell,
          },
          { 
            id: 'communication-rh', 
            label: 'Communication RH', 
            icon: Mail,
          },
          { 
            id: 'documents-modeles-rh', 
            label: 'Documents & Modèles RH', 
            icon: Folder,
          },
          { 
            id: 'rapports-statistiques-rh', 
            label: 'Rapports & Statistiques', 
            icon: BarChart3,
          },
          { 
            id: 'parametres-droits-rh', 
            label: 'Paramètres & Droits d\'accès', 
            icon: Settings,
          }
        ];
      case 'human-development-training':
        return [
          { id: 'dashboard', label: 'Tableau de bord Formation', icon: Home },
          { 
            id: 'gestion-des-processus-rh-2', 
            label: 'Gestion des processus RH – Bureau 2', 
            icon: BookOpen,
            subItems: [
              { id: 'catalogue-complet', label: 'Formation & Développement des compétences', icon: Library },
              { id: 'nouvelle-formation', label: 'Évaluation du potentiel & gestion des talents', icon: Plus },
              { id: 'categories-themes', label: 'Climat social & bien-être au travail', icon: Tag },
              { id: 'formateurs', label: 'Communication interne & engagement', icon: Users },
              { id: 'suivi-objectifs', label: 'Suivi des objectifs & performance collective', icon: Tag },
              { id: 'mobilite-reconversion', label: 'Mobilité, reconversion & plan de carrière', icon: Users },
              { id: 'sante-securite', label: 'Santé & sécurité au travail', icon: Users }
            ]
          },
          { 
            id: 'planification-formations', 
            label: 'Planification des Formations', 
            icon: Calendar,
          },
          { 
            id: 'inscriptions-participants', 
            label: 'Inscriptions & Participants', 
            icon: UserCheck,
          },
          { 
            id: 'suivi-evaluations', 
            label: 'Suivi & Évaluations', 
            icon: BarChart3,
          },
          { 
            id: 'budget-finance', 
            label: 'Budget & Finance', 
            icon: DollarSign,
          },
          { 
            id: 'competences-development', 
            label: 'Compétences & Développement', 
            icon: Target,
          },
          { 
            id: 'ressources-pedagogiques', 
            label: 'Ressources Pédagogiques', 
            icon: Folder,
          },
          { 
            id: 'rapports-statistiques', 
            label: 'Rapports & Statistiques', 
            icon: BarChart,
          },
          { 
            id: 'parametres', 
            label: 'Paramètres', 
            icon: Settings,
          }
        ];
      default:
        return commonItems;
    }
  };

  const renderOfficeDashboard = () => {
    switch (officeId) {
      case 'general-admin-logistics':
        return <GeneralAdminLogisticsDashboard user={user} activeSection={activeSection} />;
      case 'reception-documentation-archiving':
        return <ArchivesDashboard user={user} activeSection={activeSection} />;
      case 'secretary-general':
        return <SecretaryGeneralDashboard user={user} activeSection={activeSection} />;
      case 'logistics-general':
        return <LogisticsDashboard user={user} activeSection={activeSection} />;
      case 'archives-documentation':
        return <ArchivesDashboard user={user} activeSection={activeSection} />;
      case 'personnel-career-admin':
        return <HRAdministrationDashboard user={user} activeSection={activeSection} />;
      case 'human-development-training':
        return <HRDevelopmentDashboard user={user} activeSection={activeSection} />;
      default:
        return (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Tableau de bord en développement
            </h3>
            <p className="text-gray-600">
              Le tableau de bord pour ce bureau sera bientôt disponible.
            </p>
          </div>
        );
    }
  };

  // Early return if office not found
  if (!office) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Bureau non trouvé</h2>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  const sidebarItems = getSidebarItems();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="flex flex-col h-screen">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 ${office.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                <Building className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 text-lg">{office.nameFr}</h2>
                <p className="text-sm text-gray-600">GeoCasa Group</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 overflow-y-auto py-4">
            <div className="px-4 space-y-2">
              {sidebarItems.map((item) => (
                <div key={item.id} className="space-y-1">
                  <div className="relative">
                    <button
                      onClick={() => {
                        if (item.subItems) {
                          toggleMenu(item.id);
                        } else {
                          setActiveSection(item.id);
                        }
                      }}
                      onMouseEnter={() => item.subItems && setHoveredMenu(item.id)}
                      onMouseLeave={() => setHoveredMenu(null)}
                      className={`w-full flex items-center justify-between px-4 py-3 text-left rounded-xl transition-all duration-200 ${
                        activeSection === item.id
                          ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-600 shadow-md'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <item.icon className={`w-5 h-5 ${
                            activeSection === item.id ? 'text-blue-600' : 'text-gray-400'
                          }`} />
                          {item.id === 'prestations' && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                          )}
                        </div>
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
                          <span className="text-sm font-medium">{subItem.label}</span>
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
                <p className="text-xs text-gray-500 truncate">Responsable Bureau</p>
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
                    <div className="text-xs text-gray-600">Bureau Manager</div>
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

        {/* Performance Stats Bar */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">156</div>
                <div className="text-sm text-blue-100">Jours actifs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">4.8</div>
                <div className="text-sm text-blue-100">Performance</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">89%</div>
                <div className="text-sm text-blue-100">Efficacité</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">12</div>
                <div className="text-sm text-blue-100">Projets actifs</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
          {renderOfficeDashboard()}
        </main>
      </div>
    </div>
  );
};

export default OfficeDashboard;