import React, { useState, useEffect } from 'react';
import {
  Home,
  Mail,
  FileText,
  Building2,
  Package,
  Truck,
  Calendar,
  Bell,
  BarChart3,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Users,
  Settings,
  Download,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Archive,
  Send,
  Shield
} from 'lucide-react';
import { User } from '../../../types';

interface GeneralAdminLogisticsDashboardProps {
  user: User;
  activeSection: string;
}

const GeneralAdminLogisticsDashboard: React.FC<GeneralAdminLogisticsDashboardProps> = ({ user, activeSection }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Tableau de bord – Administration & Logistique</h2>
          <p className="text-gray-600 mt-2">
            Vue en temps réel de l'activité administrative et logistique
          </p>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Mail className="w-8 h-8 opacity-80" />
            <span className="text-3xl font-bold">156</span>
          </div>
          <h3 className="text-lg font-semibold">Courriers Traités</h3>
          <p className="text-sm opacity-80 mt-1">Ce mois</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <FileText className="w-8 h-8 opacity-80" />
            <span className="text-3xl font-bold">45</span>
          </div>
          <h3 className="text-lg font-semibold">Contrats Actifs</h3>
          <p className="text-sm opacity-80 mt-1">En cours</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Building2 className="w-8 h-8 opacity-80" />
            <span className="text-3xl font-bold">87</span>
          </div>
          <h3 className="text-lg font-semibold">Patrimoine</h3>
          <p className="text-sm opacity-80 mt-1">Biens enregistrés</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Package className="w-8 h-8 opacity-80" />
            <span className="text-3xl font-bold">234</span>
          </div>
          <h3 className="text-lg font-semibold">Articles en Stock</h3>
          <p className="text-sm opacity-80 mt-1">Tous types</p>
        </div>
      </div>

      {/* Alertes */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <Bell className="w-6 h-6 mr-2 text-red-600" />
            Alertes Importantes
          </h3>
          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
            8 alertes
          </span>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <div>
                <p className="font-semibold text-gray-900">Contrat maintenance à renouveler</p>
                <p className="text-sm text-gray-600">Expire dans 3 jours - Contrat #CM-2024-045</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm">
              Traiter
            </button>
          </div>
          <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              <div>
                <p className="font-semibold text-gray-900">Niveau stock critique</p>
                <p className="text-sm text-gray-600">Papier A4 - Seuil minimum atteint</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm">
              Commander
            </button>
          </div>
          <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="font-semibold text-gray-900">Maintenance véhicule programmée</p>
                <p className="text-sm text-gray-600">Véhicule #V-012 - Prévue demain</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-sm">
              Voir détails
            </button>
          </div>
        </div>
      </div>

      {/* Activité récente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="w-6 h-6 mr-2 text-blue-600" />
            Activité Récente
          </h3>
          <div className="space-y-3">
            {[
              { time: 'Il y a 5 min', action: 'Nouveau courrier enregistré', user: 'Marie K.', type: 'mail' },
              { time: 'Il y a 12 min', action: 'Bon de commande validé', user: 'Jean D.', type: 'package' },
              { time: 'Il y a 25 min', action: 'Contrat mis à jour', user: 'Paul M.', type: 'file' },
              { time: 'Il y a 1h', action: 'Mission planifiée', user: 'Sophie L.', type: 'calendar' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  {activity.type === 'mail' && <Mail className="w-5 h-5 text-blue-600" />}
                  {activity.type === 'package' && <Package className="w-5 h-5 text-blue-600" />}
                  {activity.type === 'file' && <FileText className="w-5 h-5 text-blue-600" />}
                  {activity.type === 'calendar' && <Calendar className="w-5 h-5 text-blue-600" />}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.user} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <BarChart3 className="w-6 h-6 mr-2 text-green-600" />
            Performance du Mois
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Courriers traités</span>
                <span className="text-sm font-bold text-gray-900">94%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '94%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Stock optimal</span>
                <span className="text-sm font-bold text-gray-900">87%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '87%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Contrats à jour</span>
                <span className="text-sm font-bold text-gray-900">92%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Missions réalisées</span>
                <span className="text-sm font-bold text-gray-900">100%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-orange-500 h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
          </div>
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
        <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center space-x-2 mx-auto">
          <Plus className="w-5 h-5" />
          <span>Ajouter un élément</span>
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
      case 'accueil':
        return renderDashboard();

      // Correspondances officielles
      case 'correspondances':
        return renderPlaceholder(
          'Correspondances Officielles',
          <Mail className="w-20 h-20 text-indigo-400 mx-auto" />,
          'Enregistrement numérique de chaque courrier entrant/sortant avec attribution au service compétent et suivi du traitement'
        );

      // Contrats administratifs
      case 'contrats-prestataires':
        return renderPlaceholder(
          'Contrats Administratifs & Prestataires',
          <FileText className="w-20 h-20 text-green-400 mx-auto" />,
          'Base numérique unique pour les contrats de maintenance, assurance, services avec alertes automatiques avant expiration'
        );

      // Patrimoine
      case 'patrimoine':
        return renderPlaceholder(
          'Gestion du Patrimoine',
          <Building2 className="w-20 h-20 text-purple-400 mx-auto" />,
          'Fiches numériques par bien (local, véhicule, équipement, mobilier) avec QR Code et suivi des maintenances'
        );

      // Approvisionnement & Stock
      case 'approvisionnement-stock':
        return renderPlaceholder(
          'Approvisionnement & Stock',
          <Package className="w-20 h-20 text-orange-400 mx-auto" />,
          'Bons de commande numériques avec workflow de validation, suivi de réception et alertes sur seuils critiques'
        );

      // Logistique & Missions
      case 'logistique-missions':
        return renderPlaceholder(
          'Organisation Logistique & Missions',
          <Truck className="w-20 h-20 text-blue-400 mx-auto" />,
          'Planification des missions internes avec génération automatique d\'ordres de mission et suivi des frais'
        );

      // Gestion documentaire
      case 'gestion-documentaire':
        return renderPlaceholder(
          'Gestion Documentaire Administrative',
          <Archive className="w-20 h-20 text-teal-400 mx-auto" />,
          'Classement automatique des documents produits avec indexation et archivage provisoire avant transfert au Bureau 2'
        );

      // Relances & notifications
      case 'relances-notifications':
        return renderPlaceholder(
          'Relances & Notifications',
          <Bell className="w-20 h-20 text-red-400 mx-auto" />,
          'Alertes automatiques sur échéances contrat, maintenance, rupture stock, courrier non traité'
        );

      // Rapports & statistiques
      case 'rapports-statistiques':
        return renderPlaceholder(
          'Rapports & Statistiques',
          <BarChart3 className="w-20 h-20 text-green-400 mx-auto" />,
          'Tableaux de bord dynamiques avec exports automatiques PDF, Excel et rapports mensuels pour la Direction'
        );

      // Paramètres & sécurité
      case 'parametres-securite':
        return renderPlaceholder(
          'Paramètres & Sécurité',
          <Settings className="w-20 h-20 text-gray-400 mx-auto" />,
          'Profils utilisateurs, journal d\'audit et sauvegarde quotidienne pour sécurité maximale'
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

export default GeneralAdminLogisticsDashboard;
