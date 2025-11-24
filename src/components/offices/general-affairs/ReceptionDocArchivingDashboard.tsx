import React, { useState } from 'react';
import {
  Home,
  Users,
  Phone,
  Archive,
  Search,
  FileText,
  Upload,
  Download,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Folder,
  Shield,
  MessageSquare,
  Bell,
  Filter,
  Calendar,
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  Share2,
  Lock,
  Unlock,
  Library,
  BookOpen
} from 'lucide-react';
import { User } from '../../../types';
import { useArchives } from '../../../hooks/useArchives';
import { useBibliotheque } from '../../../hooks/useBibliotheque';
import { useVisites } from '../../../hooks/useVisites';
import { usePrestations } from '../../../hooks/usePrestations';

interface ReceptionDocArchivingDashboardProps {
  user: User;
  activeSection: string;
}

const ReceptionDocArchivingDashboard: React.FC<ReceptionDocArchivingDashboardProps> = ({ user, activeSection }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { archives, stats: archiveStats } = useArchives();
  const { documents, stats: bibliothequeStats } = useBibliotheque();
  const { visites, stats: visiteStats } = useVisites();
  const { prestations, stats: prestationStats } = usePrestations();

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Tableau de bord – Accueil & Archivage</h2>
          <p className="text-gray-600 mt-2">
            Centre d'information et de mémoire numérique de GeoCasa Group
          </p>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-teal-500 to-teal-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 opacity-80" />
            <span className="text-3xl font-bold">{visiteStats.total || 0}</span>
          </div>
          <h3 className="text-lg font-semibold">Visiteurs Reçus</h3>
          <p className="text-sm opacity-80 mt-1">Ce mois</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Phone className="w-8 h-8 opacity-80" />
            <span className="text-3xl font-bold">287</span>
          </div>
          <h3 className="text-lg font-semibold">Appels Gérés</h3>
          <p className="text-sm opacity-80 mt-1">Ce mois</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Archive className="w-8 h-8 opacity-80" />
            <span className="text-3xl font-bold">{archiveStats.total || 0}</span>
          </div>
          <h3 className="text-lg font-semibold">Documents Archivés</h3>
          <p className="text-sm opacity-80 mt-1">Total système</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <FileText className="w-8 h-8 opacity-80" />
            <span className="text-3xl font-bold">{prestationStats.total || 0}</span>
          </div>
          <h3 className="text-lg font-semibold">Demandes Clients</h3>
          <p className="text-sm opacity-80 mt-1">Enregistrées</p>
        </div>
      </div>

      {/* Alertes et notifications */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <Bell className="w-6 h-6 mr-2 text-orange-600" />
            Alertes & Actions Requises
          </h3>
          <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-semibold">
            5 en attente
          </span>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              <div>
                <p className="font-semibold text-gray-900">Demandes clients en attente</p>
                <p className="text-sm text-gray-600">3 demandes nécessitent orientation</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm">
              Traiter
            </button>
          </div>
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-semibold text-gray-900">Documents non classés</p>
                <p className="text-sm text-gray-600">12 documents en attente de numérisation</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
              Numériser
            </button>
          </div>
          <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
            <div className="flex items-center space-x-3">
              <FileText className="w-5 h-5 text-purple-600" />
              <div>
                <p className="font-semibold text-gray-900">Dossiers incomplets</p>
                <p className="text-sm text-gray-600">5 dossiers manquent des pièces</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm">
              Vérifier
            </button>
          </div>
        </div>
      </div>

      {/* Statistiques d'accueil et archivage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="w-6 h-6 mr-2 text-teal-600" />
            Activité d'Accueil
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Taux de réponse (appels)</span>
                <span className="text-sm font-bold text-gray-900">96%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-teal-500 h-2 rounded-full" style={{ width: '96%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Satisfaction visiteurs</span>
                <span className="text-sm font-bold text-gray-900">94%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '94%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Orientation réussie</span>
                <span className="text-sm font-bold text-gray-900">98%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '98%' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <BarChart3 className="w-6 h-6 mr-2 text-purple-600" />
            Performance Archivage
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Taux de numérisation</span>
                <span className="text-sm font-bold text-gray-900">92%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Indexation complète</span>
                <span className="text-sm font-bold text-gray-900">88%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-orange-500 h-2 rounded-full" style={{ width: '88%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Accès autorisés</span>
                <span className="text-sm font-bold text-gray-900">100%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activités récentes */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <Clock className="w-6 h-6 mr-2 text-blue-600" />
          Activités Récentes
        </h3>
        <div className="space-y-3">
          {[
            { time: 'Il y a 2 min', action: 'Nouveau visiteur enregistré', user: 'Accueil', type: 'user', color: 'teal' },
            { time: 'Il y a 8 min', action: 'Document archivé', user: 'Bureau 2', type: 'archive', color: 'purple' },
            { time: 'Il y a 15 min', action: 'Demande client orientée', user: 'Accueil', type: 'file', color: 'orange' },
            { time: 'Il y a 23 min', action: 'Consultation documentaire', user: 'Bureau RH', type: 'search', color: 'blue' },
            { time: 'Il y a 35 min', action: 'Appel téléphonique traité', user: 'Standard', type: 'phone', color: 'green' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg">
              <div className={`w-10 h-10 bg-${activity.color}-100 rounded-full flex items-center justify-center`}>
                {activity.type === 'user' && <Users className={`w-5 h-5 text-${activity.color}-600`} />}
                {activity.type === 'archive' && <Archive className={`w-5 h-5 text-${activity.color}-600`} />}
                {activity.type === 'file' && <FileText className={`w-5 h-5 text-${activity.color}-600`} />}
                {activity.type === 'search' && <Search className={`w-5 h-5 text-${activity.color}-600`} />}
                {activity.type === 'phone' && <Phone className={`w-5 h-5 text-${activity.color}-600`} />}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{activity.action}</p>
                <p className="text-sm text-gray-600">{activity.user} • {activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPlaceholder = (title: string, icon: React.ReactNode, description: string) => (
    <div className="bg-white rounded-xl shadow-md p-12 text-center">
      {icon}
      <h3 className="text-2xl font-bold text-gray-900 mb-3 mt-6">{title}</h3>
      <p className="text-gray-600 text-lg max-w-2xl mx-auto">{description}</p>
      <div className="mt-6">
        <button className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center space-x-2 mx-auto">
          <Plus className="w-5 h-5" />
          <span>Ajouter un élément</span>
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
      case 'accueil-dashboard':
        return renderDashboard();

      // Accueil & Standard
      case 'accueil-standard':
        return renderPlaceholder(
          'Accueil & Standard Téléphonique',
          <Phone className="w-20 h-20 text-teal-400 mx-auto" />,
          'Enregistrement numérique des visiteurs et appels entrants avec transmission automatique au service concerné'
        );

      // Réception demandes clients
      case 'reception-demandes':
        return renderPlaceholder(
          'Réception & Enregistrement des Demandes Clients',
          <FileText className="w-20 h-20 text-blue-400 mx-auto" />,
          'Formulaire numérique de réception et suivi des prestations clients avec orientation automatique'
        );

      // Archivage documentaire
      case 'archivage-documentaire':
        return renderPlaceholder(
          'Archivage Documentaire Centralisé',
          <Archive className="w-20 h-20 text-purple-400 mx-auto" />,
          'Numérisation, indexation et classement dans la base documentaire centralisée avec codes uniques'
        );

      // Consultation documentaire
      case 'consultation-documentaire':
        return renderPlaceholder(
          'Consultation & Accès Documentaire',
          <Search className="w-20 h-20 text-orange-400 mx-auto" />,
          'Interface de recherche multicritères avec accès différencié et historique complet des consultations'
        );

      // Bibliothèque numérique
      case 'bibliotheque-numerique':
        return renderPlaceholder(
          'Bibliothèque Numérique Centralisée',
          <Library className="w-20 h-20 text-green-400 mx-auto" />,
          'Bibliothèque centrale avec classement automatique IA, recherche plein texte et gestion des versions'
        );

      // Communication interservices
      case 'communication-interservices':
        return renderPlaceholder(
          'Communication Interservices',
          <MessageSquare className="w-20 h-20 text-blue-400 mx-auto" />,
          'Messagerie interne pour transfert rapide de documents avec historique par dossier'
        );

      // Relances & notifications
      case 'relances-notifications-bureau2':
        return renderPlaceholder(
          'Relances & Notifications',
          <Bell className="w-20 h-20 text-red-400 mx-auto" />,
          'Alertes automatiques sur documents non classés, demandes en attente et dossiers incomplets'
        );

      // Rapports & statistiques
      case 'rapports-statistiques-bureau2':
        return renderPlaceholder(
          'Rapports & Statistiques',
          <BarChart3 className="w-20 h-20 text-green-400 mx-auto" />,
          'Tableaux de bord dynamiques sur visiteurs, appels, documents archivés avec exports automatiques'
        );

      // Paramètres & sécurité
      case 'parametres-securite-bureau2':
        return renderPlaceholder(
          'Paramètres & Sécurité',
          <Shield className="w-20 h-20 text-gray-400 mx-auto" />,
          'Rôles utilisateurs, accès restreint, chiffrement des documents sensibles et sauvegarde automatique'
        );

      default:
        return renderDashboard();
    }
  };

  return (
    <div className="space-y-6">
      {renderContent()}
    </div>
  );
};

export default ReceptionDocArchivingDashboard;
