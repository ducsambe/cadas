import React, { useState } from 'react';
import { 
  Mail, 
  Calendar, 
  Phone, 
  Clock, 
  FolderOpen,
  MessageSquare,
  Users,
  FileText,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Send,
  Archive,
  Bell
} from 'lucide-react';
import { User } from '../../../types';
import { useCourriers } from '../../../hooks/useCourriers';
import { useEvenements } from '../../../hooks/useEvenements';
import CourrierForm from '../../forms/CourrierForm';
import EvenementForm from '../../forms/EvenementForm';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface SecretaryGeneralDashboardProps {
  user: User;
  activeSection: string;
}

const SecretaryGeneralDashboard: React.FC<SecretaryGeneralDashboardProps> = ({ user, activeSection }) => {
  const { courriers, stats: courrierStats, refreshCourriers } = useCourriers();
  const { evenements, stats: evenementStats, refreshEvenements } = useEvenements();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCourrierForm, setShowCourrierForm] = useState(false);
  const [showEvenementForm, setShowEvenementForm] = useState(false);

  const stats = {
    courrier: courrierStats,
    evenements: evenementStats,
    appels: { total: 156, jour: 23, manques: 4, messages: 8 },
    dossiers: { total: 234, actifs: 89, archives: 145, nouveaux: 12 }
  };

  const courrierData = [
    { name: 'Entrants', value: courrierStats.entrants, color: '#3B82F6' },
    { name: 'Sortants', value: courrierStats.sortants, color: '#10B981' },
    { name: 'Urgents', value: courrierStats.urgent, color: '#EF4444' }
  ];

  const monthlyData = [
    { month: 'Jan', courrier: 42, evenements: 6, appels: 145 },
    { month: 'Fév', courrier: 38, evenements: 8, appels: 167 },
    { month: 'Mar', courrier: 45, evenements: 5, appels: 156 },
    { month: 'Avr', courrier: 52, evenements: 9, appels: 189 }
  ];

  const recentActivities = [
    { id: 1, type: 'courrier', title: 'Nouveau courrier de la Direction Générale', time: '10:30', status: 'nouveau', priority: 'urgent' },
    { id: 2, type: 'evenement', title: 'Réunion conseil d\'administration', time: '14:00', status: 'planifie', priority: 'normal' },
    { id: 3, type: 'appel', title: 'Appel manqué - Client VIP', time: '09:15', status: 'urgent', priority: 'urgent' },
    { id: 4, type: 'dossier', title: 'Nouveau dossier RH créé', time: '08:45', status: 'nouveau', priority: 'normal' }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'courrier': return <Mail className="w-5 h-5 text-blue-600" />;
      case 'evenement': return <Calendar className="w-5 h-5 text-green-600" />;
      case 'appel': return <Phone className="w-5 h-5 text-orange-600" />;
      case 'dossier': return <FolderOpen className="w-5 h-5 text-purple-600" />;
      default: return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'nouveau': return 'bg-blue-100 text-blue-800';
      case 'planifie': return 'bg-green-100 text-green-800';
      case 'traite': return 'bg-gray-100 text-gray-800';
      case 'confirme': return 'bg-green-100 text-green-800';
      case 'en_cours': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{stats.courrier.total}</div>
              <div className="text-sm text-blue-600 font-medium">+{stats.courrier.nouveau} nouveaux</div>
            </div>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Gestion du Courrier</h3>
          <p className="text-sm text-gray-600">Courriers en traitement</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{stats.evenements.total}</div>
              <div className="text-sm text-green-600 font-medium">{stats.evenements.semaine} cette semaine</div>
            </div>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Gestion des Événements</h3>
          <p className="text-sm text-gray-600">Événements planifiés</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{stats.appels.jour}</div>
              <div className="text-sm text-orange-600 font-medium">{stats.appels.manques} manqués</div>
            </div>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Appels & Messagerie</h3>
          <p className="text-sm text-gray-600">Appels aujourd'hui</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <FolderOpen className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{stats.dossiers.actifs}</div>
              <div className="text-sm text-purple-600 font-medium">{stats.dossiers.nouveaux} nouveaux</div>
            </div>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Répertoire Dossiers</h3>
          <p className="text-sm text-gray-600">Dossiers actifs</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Courrier Distribution */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Répartition du Courrier</h3>
            <Mail className="w-6 h-6 text-blue-600" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={courrierData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {courrierData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-4 mt-4">
            {courrierData.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm text-gray-600">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Activity */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Activité Mensuelle</h3>
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="courrier" fill="#3B82F6" name="Courrier" radius={[4, 4, 0, 0]} />
                <Bar dataKey="evenements" fill="#10B981" name="Événements" radius={[4, 4, 0, 0]} />
                <Bar dataKey="appels" fill="#F59E0B" name="Appels" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Activités Récentes</h3>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            Voir tout
          </button>
        </div>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                  {getActivityIcon(activity.type)}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{activity.title}</div>
                  <div className="text-sm text-gray-600">{activity.time}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {activity.priority === 'urgent' && (
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                )}
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                  {activity.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCourrierManagement = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Gestion du Courrier</h3>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un courrier..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button 
              onClick={() => setShowCourrierForm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              <span>Nouveau Courrier</span>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Courriers entrants</p>
                <p className="text-2xl font-bold text-blue-800">{courrierStats.entrants}</p>
              </div>
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Courriers sortants</p>
                <p className="text-2xl font-bold text-green-800">{courrierStats.sortants}</p>
              </div>
              <Send className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-red-50 rounded-xl p-4 border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 font-medium">Urgents</p>
                <p className="text-2xl font-bold text-red-800">{courrierStats.urgent}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Expéditeur/Destinataire</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Objet</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Type</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Statut</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courriers.filter(courrier => 
                courrier.expediteur.toLowerCase().includes(searchTerm.toLowerCase()) ||
                courrier.objet.toLowerCase().includes(searchTerm.toLowerCase())
              ).map((courrier) => (
                <tr key={courrier.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{courrier.expediteur}</td>
                  <td className="py-3 px-4 text-gray-600">{courrier.objet}</td>
                  <td className="py-3 px-4 text-gray-600">{new Date(courrier.date_courrier).toLocaleDateString('fr-FR')}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      courrier.type_courrier === 'entrant' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {courrier.type_courrier}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(courrier.statut!)}`}>
                      {courrier.statut}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-700">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-700">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-700">
                        <Archive className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Forms */}
        {showCourrierForm && (
          <CourrierForm
            onClose={() => setShowCourrierForm(false)}
            onSuccess={() => {
              refreshCourriers();
              setShowCourrierForm(false);
            }}
          />
        )}
      </div>
    </div>
  );

  const renderEvenements = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Gestion des Événements</h3>
          <button 
            onClick={() => setShowEvenementForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Plus className="w-4 h-4" />
            <span>Nouvel Événement</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-800">{evenementStats.total}</p>
              <p className="text-sm text-green-600">Événements totaux</p>
            </div>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-800">{evenementStats.semaine}</p>
              <p className="text-sm text-blue-600">Cette semaine</p>
            </div>
          </div>
          <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-800">{evenementStats.planifie}</p>
              <p className="text-sm text-purple-600">Planifiés</p>
            </div>
          </div>
          <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-800">{evenementStats.mois}</p>
              <p className="text-sm text-orange-600">Ce mois</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {evenements.map((evenement) => (
            <div key={evenement.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">{evenement.titre}</div>
                  <div className="text-sm text-gray-600">
                    {new Date(evenement.date_debut).toLocaleDateString('fr-FR')} à {new Date(evenement.date_debut).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} • {evenement.lieu}
                  </div>
                  <div className="text-xs text-gray-500">
                    {evenement.participants_confirmes}/{evenement.participants_prevus} participants
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(evenement.statut!)}`}>
                  {evenement.statut}
                </span>
                <div className="flex items-center space-x-2">
                  <button className="text-blue-600 hover:text-blue-700">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="text-green-600 hover:text-green-700">
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Forms */}
        {showEvenementForm && (
          <EvenementForm
            onClose={() => setShowEvenementForm(false)}
            onSuccess={() => {
              refreshEvenements();
              setShowEvenementForm(false);
            }}
          />
        )}
      </div>
    </div>
  );

  const renderAppelsMessages = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Gestion des Appels et Messagerie</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-orange-800">{stats.appels.jour}</p>
                <p className="text-sm text-orange-600">Appels aujourd'hui</p>
              </div>
              <Phone className="w-8 h-8 text-orange-600" />
            </div>
          </div>
          <div className="bg-red-50 rounded-xl p-4 border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-red-800">{stats.appels.manques}</p>
                <p className="text-sm text-red-600">Appels manqués</p>
              </div>
              <Bell className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-blue-800">{stats.appels.messages}</p>
                <p className="text-sm text-blue-600">Messages</p>
              </div>
              <MessageSquare className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-800">{stats.appels.total}</p>
                <p className="text-sm text-green-600">Total mensuel</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="text-center py-12">
          <Phone className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Module en développement</h4>
          <p className="text-gray-600">Le système de gestion des appels et messagerie sera bientôt disponible.</p>
        </div>
      </div>
    </div>
  );

  const renderDossiers = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Répertoire des Dossiers</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-purple-800">{stats.dossiers.total}</p>
                <p className="text-sm text-purple-600">Total dossiers</p>
              </div>
              <FolderOpen className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-800">{stats.dossiers.actifs}</p>
                <p className="text-sm text-green-600">Dossiers actifs</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-800">{stats.dossiers.archives}</p>
                <p className="text-sm text-gray-600">Archivés</p>
              </div>
              <Archive className="w-8 h-8 text-gray-600" />
            </div>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-blue-800">{stats.dossiers.nouveaux}</p>
                <p className="text-sm text-blue-600">Nouveaux</p>
              </div>
              <Plus className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="text-center py-12">
          <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Module en développement</h4>
          <p className="text-gray-600">Le système de gestion des dossiers sera bientôt disponible.</p>
        </div>
      </div>
    </div>
  );

  // Render content based on active section
  switch (activeSection) {
    case 'dashboard':
    case 'overview':
      return renderOverview();
    case 'courrier':
      return renderCourrierManagement();
    case 'evenements':
      return renderEvenements();
    case 'appels':
      return renderAppelsMessages();
    case 'dossiers':
      return renderDossiers();
    default:
      return renderOverview();
  }
};

export default SecretaryGeneralDashboard;