import React, { useState, useEffect } from 'react';
import {
  Scale,
  FolderOpen,
  CheckCircle,
  Search,
  BarChart3,
  FileText,
  Package,
  TrendingUp,
  Clock,
  Users,
  AlertTriangle,
  FileCheck,
  Plus,
  Eye,
  Download,
  PieChart as PieChartIcon,
  Zap,
  Target,
  ArrowLeft,
  Mail,
  MessageSquare,
  Archive,
  BookOpen,
  Send,
  Filter,
  Calendar,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area
} from 'recharts';

import { Language, User } from '../types';
import { usePrestations } from '../hooks/usePrestations';
import { useCourriers } from '../hooks/useCourriers';
import { useStock } from '../hooks/useStock';
import { useArchives } from '../hooks/useArchives';
import { useBibliotheque } from '../hooks/useBibliotheque';

interface Bureau1LegalDashboardProps {
  onBack: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

const Bureau1LegalDashboard: React.FC<Bureau1LegalDashboardProps> = ({ 
  onBack, 
  language, 
  setLanguage 
}) => {
  // Hooks with safe defaults
  const { prestations = [], refreshPrestations } = usePrestations();
  const { courriers = [], refreshCourriers } = useCourriers();
  const { items: stockItems = [], refreshStock } = useStock();
  const { archives = [], refreshArchives } = useArchives();
  const { documents = [], refreshDocuments } = useBibliotheque();

  // State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);

  // Effects
  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        await Promise.all([
          refreshPrestations(),
          refreshCourriers(),
          refreshStock(),
          refreshArchives(),
          refreshDocuments()
        ]);
      } catch (error) {
        console.error('Error initializing dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  // Safe data processing with null checks
  const myPrestations = (prestations || []).filter(p => 
    p?.assigned_office === 'bureau1-legal'
  );
  
  const dossierEntrant = (myPrestations || []).filter(p => p?.statut === 'receptionnees');
  const dossierPhase1 = (myPrestations || []).filter(p => p?.statut === 'en_cours_phase1');
  const dossierPhase2 = (myPrestations || []).filter(p => p?.statut === 'en_cours_phase2');
  const prestationEnInstance = (myPrestations || []).filter(p =>
    p && ['en_attente_acceptation', 'en_attente_validation'].includes(p.statut)
  );

  // Safe statistics calculation
  const stats = {
    total: (myPrestations || []).length,
    entrants: (dossierEntrant || []).length,
    phase1: (dossierPhase1 || []).length,
    phase2: (dossierPhase2 || []).length,
    instance: (prestationEnInstance || []).length,
    courriers: (courriers || []).length,
    stock: (stockItems || []).length,
    archives: (archives || []).length,
    documents: (documents || []).length,
  };

  // Chart data with safe defaults
  const officeOverviewData = [
    { name: 'Entrants', value: stats.entrants, color: '#3B82F6' },
    { name: 'Phase 1', value: stats.phase1, color: '#10B981' },
    { name: 'Phase 2', value: stats.phase2, color: '#F59E0B' },
    { name: 'En instance', value: stats.instance, color: '#EF4444' }
  ];

  const monthlyActivity = [
    { month: 'Jan', entrants: 12, traites: 8, total: 20 },
    { month: 'Fév', entrants: 18, traites: 12, total: 30 },
    { month: 'Mar', entrants: 25, traites: 20, total: 45 },
    { month: 'Avr', entrants: 22, traites: 18, total: 40 }
  ];

  const performanceData = [
    { metric: 'Efficacité', value: 94, target: 90 },
    { metric: 'Qualité', value: 96, target: 95 },
    { metric: 'Délais', value: 88, target: 85 },
    { metric: 'Satisfaction', value: 92, target: 90 }
  ];

  // Menu configuration
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Vue d\'Ensemble',
      icon: BarChart3,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      id: 'gestion-phases',
      label: 'Gestion des phases',
      icon: FolderOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      subItems: [
        { id: 'dossiers-entrants', label: 'Dossiers ENTRANTS' },
        { id: 'prestations-phase1', label: 'Prestations PHASE 1' },
        { id: 'prestations-phase2', label: 'Prestations PHASE 2' },
        { id: 'prestations-instances', label: 'Prestations en Instances' }
      ]
    },
    {
      id: 'recherche',
      label: 'Recherche avancée',
      icon: Search,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: 'courrier',
      label: 'Courrier & Communication',
      icon: Mail,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      id: 'stock',
      label: 'Gestion des stocks & équipements',
      icon: Package,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      id: 'archives',
      label: 'Archives, bibliothèque & modèles',
      icon: Archive,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50'
    },
    {
      id: 'rapports',
      label: 'Rapports & Statistiques',
      icon: FileText,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50'
    }
  ];

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  // Render methods
  const renderDashboard = () => (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center">
              <Scale className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">Bureau 1 : Études Juridiques et Conseil Fonciers</h1>
              <p className="text-indigo-100 text-lg">Gestion complète des dossiers juridiques et consultations foncières</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">{stats.total}</div>
            <div className="text-indigo-200">Total dossiers</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300 group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <FolderOpen className="w-7 h-7 text-white" />
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900">{stats.entrants}</div>
              <div className="text-sm text-blue-600 font-semibold">Dossiers entrants</div>
            </div>
          </div>
          <h3 className="font-bold text-gray-900 mb-1 text-lg">Dossiers Entrants</h3>
          <p className="text-gray-600">À traiter</p>
          <div className="mt-4 flex items-center space-x-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
            </div>
            <span className="text-sm font-medium text-gray-600">75%</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300 group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <FileCheck className="w-7 h-7 text-white" />
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900">{stats.phase1}</div>
              <div className="text-sm text-green-600 font-semibold">En cours</div>
            </div>
          </div>
          <h3 className="font-bold text-gray-900 mb-1 text-lg">Phase 1</h3>
          <p className="text-gray-600">Études juridiques</p>
          <div className="mt-4 flex items-center space-x-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '65%' }}></div>
            </div>
            <span className="text-sm font-medium text-gray-600">65%</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300 group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Package className="w-7 h-7 text-white" />
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900">{stats.phase2}</div>
              <div className="text-sm text-orange-600 font-semibold">Traitement</div>
            </div>
          </div>
          <h3 className="font-bold text-gray-900 mb-1 text-lg">Phase 2</h3>
          <p className="text-gray-600">Conseil foncier</p>
          <div className="mt-4 flex items-center space-x-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div className="bg-orange-500 h-2 rounded-full" style={{ width: '85%' }}></div>
            </div>
            <span className="text-sm font-medium text-gray-600">85%</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300 group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <AlertTriangle className="w-7 h-7 text-white" />
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900">{stats.instance}</div>
              <div className="text-sm text-red-600 font-semibold">En attente</div>
            </div>
          </div>
          <h3 className="font-bold text-gray-900 mb-1 text-lg">En Instance</h3>
          <p className="text-gray-600">Actions requises</p>
          <div className="mt-4 flex items-center space-x-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div className="bg-red-500 h-2 rounded-full" style={{ width: '45%' }}></div>
            </div>
            <span className="text-sm font-medium text-gray-600">45%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-900">Répartition des Dossiers</h3>
            <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center">
              <PieChartIcon className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={officeOverviewData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={140}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {officeOverviewData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            {officeOverviewData.map((item, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }}></div>
                <div>
                  <span className="font-semibold text-gray-900">{item.name}</span>
                  <div className="text-sm text-gray-600">{item.value} dossiers</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-900">Évolution Mensuelle</h3>
            <div className="w-10 h-10 bg-green-50 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#6366F1"
                  fill="url(#colorTotal)"
                  strokeWidth={3}
                />
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-8">Indicateurs de Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {performanceData.map((metric, index) => (
            <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-gray-900">{metric.metric}</h4>
                <div className={`text-2xl font-bold ${metric.value >= metric.target ? 'text-green-600' : 'text-orange-600'}`}>
                  {metric.value}%
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Objectif</span>
                  <span className="font-medium">{metric.target}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${metric.value >= metric.target ? 'bg-green-500' : 'bg-orange-500'}`}
                    style={{ width: `${metric.value}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-8">Actions Rapides</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <button className="flex flex-col items-center space-y-4 p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl hover:from-blue-100 hover:to-blue-200 transition-all duration-300 border-2 border-blue-200 group">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Plus className="w-8 h-8 text-white" />
            </div>
            <div className="text-center">
              <div className="font-bold text-blue-900 text-lg">Nouveau Dossier</div>
              <div className="text-sm text-blue-600">Créer dossier</div>
            </div>
          </button>

          <button className="flex flex-col items-center space-y-4 p-8 bg-gradient-to-br from-green-50 to-green-100 rounded-3xl hover:from-green-100 hover:to-green-200 transition-all duration-300 border-2 border-green-200 group">
            <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <FileCheck className="w-8 h-8 text-white" />
            </div>
            <div className="text-center">
              <div className="font-bold text-green-900 text-lg">Valider Études</div>
              <div className="text-sm text-green-600">Phase juridique</div>
            </div>
          </button>

          <button className="flex flex-col items-center space-y-4 p-8 bg-gradient-to-br from-orange-50 to-orange-100 rounded-3xl hover:from-orange-100 hover:to-orange-200 transition-all duration-300 border-2 border-orange-200 group">
            <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Scale className="w-8 h-8 text-white" />
            </div>
            <div className="text-center">
              <div className="font-bold text-orange-900 text-lg">Conseil Foncier</div>
              <div className="text-sm text-orange-600">Consultation</div>
            </div>
          </button>

          <button className="flex flex-col items-center space-y-4 p-8 bg-gradient-to-br from-purple-50 to-purple-100 rounded-3xl hover:from-purple-100 hover:to-purple-200 transition-all duration-300 border-2 border-purple-200 group">
            <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <div className="text-center">
              <div className="font-bold text-purple-900 text-lg">Générer Rapport</div>
              <div className="text-sm text-purple-600">Statistiques</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  const renderDossiersEntrants = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Dossiers Entrants - À Réceptionner</h3>
          <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg font-semibold">
            {dossierEntrant.length} dossiers
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {(dossierEntrant || []).map((dossier) => (
            <div key={dossier.id} className="bg-white border-2 border-blue-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-200 hover:border-blue-400">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="bg-blue-100 text-blue-800 font-mono font-bold px-3 py-1.5 rounded-lg text-sm mb-2 inline-block">
                    {dossier.numero}
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-1">{dossier.client_nom}</h4>
                  <p className="text-sm text-gray-600">{dossier.procedure_choisie}</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <Eye className="w-5 h-5" />
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
                  Accepter
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderRechercheAvancee = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Recherche Avancée de Dossiers</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par client, numéro..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Tous les statuts</option>
            <option value="entrants">En attente</option>
            <option value="en_cours">En cours</option>
            <option value="completes">Complétés</option>
            <option value="annules">Annulés</option>
          </select>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Filtrer</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Numéro</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {(myPrestations || []).map((dossier) => (
                <tr key={dossier.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {dossier.numero}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {dossier.client_nom}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {dossier.procedure_choisie}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {dossier.statut}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(dossier.date_creation).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="text-blue-600 hover:text-blue-900">Voir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderCourrierCommunication = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Mail className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{(courriers || []).filter(c => c?.type === 'entrant').length}</div>
              <div className="text-sm text-gray-600">Courriers Entrants</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Send className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{(courriers || []).filter(c => c?.type === 'sortant').length}</div>
              <div className="text-sm text-gray-600">Courriers Sortants</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">8</div>
              <div className="text-sm text-gray-600">Messages Internes</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Courriers Récents</h3>
        <div className="space-y-3">
          {(courriers || []).slice(0, 5).map((courrier) => (
            <div key={courrier.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  courrier?.type === 'entrant' ? 'bg-purple-100' : 'bg-blue-100'
                }`}>
                  {courrier?.type === 'entrant' ?
                    <Mail className="w-5 h-5 text-purple-600" /> :
                    <Send className="w-5 h-5 text-blue-600" />
                  }
                </div>
                <div>
                  <div className="font-medium text-gray-900">{courrier.objet}</div>
                  <div className="text-sm text-gray-600">{courrier.expediteur || courrier.destinataire}</div>
                </div>
              </div>
              <button className="text-blue-600 hover:text-blue-800">
                <Eye className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStockEquipements = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stockItems.length}</div>
              <div className="text-sm text-gray-600">Articles en stock</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{(stockItems || []).filter(i => i?.quantite > 10).length}</div>
              <div className="text-sm text-gray-600">Disponibles</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{(stockItems || []).filter(i => i?.quantite <= 10 && i?.quantite > 0).length}</div>
              <div className="text-sm text-gray-600">Stock faible</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{(stockItems || []).filter(i => i?.quantite === 0).length}</div>
              <div className="text-sm text-gray-600">Rupture</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Inventaire des Équipements</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Article</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Catégorie</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantité</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {(stockItems || []).map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.nom}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {item.categorie}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.quantite}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      item.quantite === 0 ? 'bg-red-100 text-red-800' :
                      item.quantite <= 10 ? 'bg-orange-100 text-orange-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {item.quantite === 0 ? 'Rupture' : item.quantite <= 10 ? 'Stock faible' : 'Disponible'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="text-blue-600 hover:text-blue-900">Demander</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderArchivesBibliotheque = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
              <Archive className="w-6 h-6 text-teal-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.archives}</div>
              <div className="text-sm text-gray-600">Archives</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.documents}</div>
              <div className="text-sm text-gray-600">Documents</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">25</div>
              <div className="text-sm text-gray-600">Modèles</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Archives Juridiques</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(archives || []).slice(0, 6).map((archive) => (
            <div key={archive.id} className="border-2 border-gray-200 rounded-xl p-4 hover:border-teal-400 hover:shadow-lg transition-all">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-teal-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 truncate">{archive.titre}</h4>
                  <p className="text-sm text-gray-600">{archive.type}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500">{new Date(archive.date_creation).toLocaleDateString()}</span>
                    <button className="text-teal-600 hover:text-teal-800">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Modèles Prêts à l'Emploi</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {['Contrat de vente', 'Protocole d\'accord', 'Lettre de mise en demeure', 'Convention de partenariat'].map((modele, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-900">{modele}</span>
              </div>
              <button className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                <Download className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderRapportsStatistiques = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6">
          <div className="text-3xl font-bold mb-2">{stats.total}</div>
          <div className="text-blue-100">Total Dossiers</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-6">
          <div className="text-3xl font-bold mb-2">14.5</div>
          <div className="text-green-100">Délai moyen (jours)</div>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl p-6">
          <div className="text-3xl font-bold mb-2">92%</div>
          <div className="text-orange-100">Taux de satisfaction</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-6">
          <div className="text-3xl font-bold mb-2">{stats.instance}</div>
          <div className="text-purple-100">Dossiers en retard</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Statistiques par Type de Prestation</h3>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Exporter PDF</span>
          </button>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[
              { type: 'Immatriculation', count: 45 },
              { type: 'Lotissement', count: 32 },
              { type: 'Morcellement', count: 28 },
              { type: 'Litige', count: 15 },
              { type: 'Consultation', count: 50 }
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Évolution Mensuelle</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="total" stroke="#6366F1" fill="#818CF8" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Alertes Automatiques</h3>
          <div className="space-y-3">
            <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <div>
                  <div className="font-semibold text-gray-900">3 paiements en échéance</div>
                  <div className="text-sm text-gray-600">Dossiers requérant un suivi urgent</div>
                </div>
              </div>
            </div>
            <div className="p-4 bg-orange-50 border-l-4 border-orange-500 rounded-lg">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-orange-600" />
                <div>
                  <div className="font-semibold text-gray-900">5 documents manquants</div>
                  <div className="text-sm text-gray-600">À compléter avant traitement</div>
                </div>
              </div>
            </div>
            <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <div>
                  <div className="font-semibold text-gray-900">2 litiges signalés</div>
                  <div className="text-sm text-gray-600">Nécessitent intervention immédiate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Main content renderer
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'dossiers-entrants':
        return renderDossiersEntrants();
      case 'recherche':
        return renderRechercheAvancee();
      case 'courrier':
        return renderCourrierCommunication();
      case 'stock':
        return renderStockEquipements();
      case 'archives':
        return renderArchivesBibliotheque();
      case 'rapports':
        return renderRapportsStatistiques();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-20' : 'w-64'} bg-white border-r border-gray-200 flex-shrink-0 transition-all duration-300`}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              {!sidebarCollapsed && <span>Retour</span>}
            </button>
            {!sidebarCollapsed && (
              <div>
                <h2 className="font-bold text-gray-900 text-sm">Bureau 1</h2>
                <p className="text-xs text-gray-600">Études Juridiques</p>
              </div>
            )}
          </div>

          {/* Menu Items */}
          <nav className="flex-1 overflow-y-auto p-2">
            {menuItems.map((item) => (
              <div key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg mb-1 transition-colors ${
                    activeTab === item.id
                      ? `${item.bgColor} ${item.color}`
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!sidebarCollapsed && <span className="text-sm font-medium">{item.label}</span>}
                </button>

                {!sidebarCollapsed && item.subItems && activeTab === item.id && (
                  <div className="ml-8 space-y-1 mb-2">
                    {item.subItems.map((subItem) => (
                      <button
                        key={subItem.id}
                        onClick={() => setActiveTab(subItem.id)}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors ${
                          activeTab === subItem.id
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {subItem.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="w-full px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-700 transition-colors"
            >
              {sidebarCollapsed ? '→' : '←'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Bureau1LegalDashboard;