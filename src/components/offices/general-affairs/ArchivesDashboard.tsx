import React, { useState, useEffect } from 'react';
import { Archive, BookOpen, FileText, Users, TrendingUp, Plus, Search, Send, X, Trash2, Eye, CreditCard as Edit, Download, Upload, BarChart3, PieChart as PieChartIcon, Calendar, Clock, CheckCircle, Package, Zap, Target, ArrowRight, XCircle, RotateCcw, AlertCircle } from 'lucide-react';
import { User } from '../../../types';
import { useArchives } from '../../../hooks/useArchives';
import { useBibliotheque } from '../../../hooks/useBibliotheque';
import { useVisites } from '../../../hooks/useVisites';
import { usePrestations } from '../../../hooks/usePrestations';
import PrestationForm from '../../forms/PrestationForm';
import PrestationTemplate from '../../PrestationTemplate';
import VisiteForm from '../../forms/VisiteForm';
import ValidationModal from '../../forms/ValidationModal';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, AreaChart, Area } from 'recharts';

interface ArchivesDashboardProps {
  user: User;
  activeSection: string;
}

const ArchivesDashboard: React.FC<ArchivesDashboardProps> = ({ user, activeSection }) => {
  const { archives, stats: archiveStats, refreshArchives } = useArchives();
  const { documents, stats: bibliothequeStats, refreshDocuments } = useBibliotheque();
  const { visites, stats: visiteStats, refreshVisites } = useVisites();
  const { prestations, stats: prestationStats, refreshPrestations } = usePrestations();
  
  const [showPrestationForm, setShowPrestationForm] = useState(false);
  const [showVisiteForm, setShowVisiteForm] = useState(false);
  const [showPrestationTemplate, setShowPrestationTemplate] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [currentPrestation, setCurrentPrestation] = useState<any>(null);
  const [selectedPrestation, setSelectedPrestation] = useState<any>(null);
  const [prestationToValidate, setPrestationToValidate] = useState<any>(null);
  const [createdPrestation, setCreatedPrestation] = useState<any>(null);
  const [prestationToEdit, setPrestationToEdit] = useState<any>(null);
  const [timeStats, setTimeStats] = useState<any>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Combined statistics
  const stats = {
    prestations: prestationStats,
    visites: visiteStats,
    archives: archiveStats,
    bibliotheque: bibliothequeStats
  };

  useEffect(() => {
    loadTimeStats();
  }, []);

  const loadTimeStats = async () => {
    try {
      // Note: You'll need to import or define supabase
      // const { data, error } = await supabase.rpc('get_prestation_time_stats');
      // if (error) throw error;
      // setTimeStats(data[0] || {});
      setTimeStats({}); // Placeholder for now
    } catch (error) {
      console.error('Erreur chargement stats:', error);
    }
  };

  // Helper functions for status colors
  const getPrestationStatusColor = (status: string) => {
    switch (status) {
      case 'nouvelles': return 'bg-blue-100 text-blue-800';
      case 'en_attente_acceptation': return 'bg-amber-100 text-amber-800';
      case 'validees': return 'bg-green-100 text-green-800';
      case 'receptionnees': return 'bg-purple-100 text-purple-800';
      case 'renvoyees': return 'bg-yellow-100 text-yellow-800';
      case 'traitees': return 'bg-teal-100 text-teal-800';
      case 'refusees': return 'bg-red-100 text-red-800';
      case 'en_cours': return 'bg-orange-100 text-orange-800';
      case 'livre': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPrestationStatusLabel = (status: string) => {
    switch (status) {
      case 'nouvelles': return 'Nouvelles';
      case 'en_attente_acceptation': return 'En attente d\'acceptation';
      case 'validees': return 'Validées';
      case 'receptionnees': return 'Réceptionnées';
      case 'renvoyees': return 'Renvoyées';
      case 'traitees': return 'Traitées';
      case 'refusees': return 'Refusées';
      default: return status;
    }
  };

  const getVisiteStatusColor = (status: string) => {
    switch (status) {
      case 'planifiee': return 'bg-blue-100 text-blue-800';
      case 'confirmee': return 'bg-green-100 text-green-800';
      case 'realisee': return 'bg-gray-100 text-gray-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Chart data for office overview
  const officeOverviewData = [
    { name: 'Prestations', value: prestationStats.total, color: '#3B82F6' },
    { name: 'Visites', value: visiteStats.total, color: '#10B981' },
    { name: 'Archives', value: archiveStats.total, color: '#8B5CF6' },
    { name: 'Bibliothèque', value: bibliothequeStats.total, color: '#F59E0B' }
  ];

  const monthlyOfficeActivity = [
    { month: 'Jan', prestations: 12, visites: 8, archives: 15, documents: 5, total: 40 },
    { month: 'Fév', prestations: 18, visites: 12, archives: 22, documents: 8, total: 60 },
    { month: 'Mar', prestations: 25, visites: 15, archives: 18, documents: 12, total: 70 },
    { month: 'Avr', prestations: 22, visites: 18, archives: 25, documents: 10, total: 75 }
  ];

  const officePerformanceData = [
    { metric: 'Efficacité', value: 94, target: 90 },
    { metric: 'Qualité', value: 96, target: 95 },
    { metric: 'Délais', value: 88, target: 85 },
    { metric: 'Satisfaction', value: 92, target: 90 }
  ];

  // Chart data for prestations
  const prestationStatusData = [
    { name: 'Nouvelles', value: prestationStats.nouvelles, color: '#3B82F6' },
    { name: 'Receptionnees', value: prestationStats.receptionnees, color: '#F59E0B' },
    { name: 'Validees', value: prestationStats.validees, color: '#10B981' },
    { name: 'Traitees', value: prestationStats.traitees, color: '#8B5CF6' }
  ];

  const prestationTimelineData = [
    { stage: 'Réception', avgDays: 1, color: '#3B82F6' },
    { stage: 'Validation', avgDays: 3, color: '#10B981' },
    { stage: 'Traitement', avgDays: 12, color: '#F59E0B' },
    { stage: 'Livraison', avgDays: 2, color: '#8B5CF6' }
  ];

  const departmentPrestationData = [
    { department: 'Gestion Foncière', count: 45, percentage: 45, avgTime: 14 },
    { department: 'Financement', count: 30, percentage: 30, avgTime: 18 },
    { department: 'Vente & Gestion', count: 25, percentage: 25, avgTime: 10 }
  ];

  const prestationTrendsData = [
    { month: 'Jan', nouveau: 8, traite: 12, livre: 15, total: 35 },
    { month: 'Fév', nouveau: 12, traite: 18, livre: 20, total: 50 },
    { month: 'Mar', nouveau: 15, traite: 22, livre: 25, total: 62 },
    { month: 'Avr', nouveau: 10, traite: 25, livre: 30, total: 65 }
  ];

  const handlePrestationSuccess = (prestationData: any) => {
    setCreatedPrestation(prestationData);
    setShowPrestationForm(false);
    setShowSuccessModal(true);
    refreshPrestations();
  };


  // Vue d'Ensemble du Bureau
  const renderOfficeOverview = () => (
    <div className="space-y-8">
      {/* Office Header */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center">
              <Archive className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">Bureau des Archives Documentation et Services Internes</h1>
              <p className="text-indigo-100 text-lg">Gestion complète des prestations, visites, archives et bibliothèque</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">{stats.prestations.total + stats.visites.total + stats.archives.total}</div>
            <div className="text-indigo-200">Total activités</div>
          </div>
        </div>
      </div>

      {/* Main Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300 group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900">{stats.prestations.total}</div>
              <div className="text-sm text-blue-600 font-semibold">+{stats.prestations.nouvelles} nouveaux</div>
            </div>
          </div>
          <h3 className="font-bold text-gray-900 mb-1 text-lg">Prestations</h3>
          <p className="text-gray-600">Demandes de services</p>
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
              <Users className="w-7 h-7 text-white" />
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900">{stats.visites.total}</div>
              <div className="text-sm text-green-600 font-semibold">{stats.visites.today} aujourd'hui</div>
            </div>
          </div>
          <h3 className="font-bold text-gray-900 mb-1 text-lg">Visites</h3>
          <p className="text-gray-600">Planifications clients</p>
          <div className="mt-4 flex items-center space-x-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '82%' }}></div>
            </div>
            <span className="text-sm font-medium text-gray-600">82%</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300 group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Archive className="w-7 h-7 text-white" />
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900">{stats.archives.total}</div>
              <div className="text-sm text-purple-600 font-semibold">Documents sécurisés</div>
            </div>
          </div>
          <h3 className="font-bold text-gray-900 mb-1 text-lg">Archives</h3>
          <p className="text-gray-600">Documents stockés</p>
          <div className="mt-4 flex items-center space-x-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div className="bg-purple-500 h-2 rounded-full" style={{ width: '90%' }}></div>
            </div>
            <span className="text-sm font-medium text-gray-600">90%</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300 group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900">{stats.bibliotheque.total}</div>
              <div className="text-sm text-orange-600 font-semibold">{stats.bibliotheque.disponible} disponibles</div>
            </div>
          </div>
          <h3 className="font-bold text-gray-900 mb-1 text-lg">Bibliothèque</h3>
          <p className="text-gray-600">Documents référence</p>
          <div className="mt-4 flex items-center space-x-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div className="bg-orange-500 h-2 rounded-full" style={{ width: '67%' }}></div>
            </div>
            <span className="text-sm font-medium text-gray-600">67%</span>
          </div>
        </div>
      </div>

      {/* Office Activity Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-900">Répartition des Activités du Bureau</h3>
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
                  <div className="text-sm text-gray-600">{item.value} éléments</div>
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
              <AreaChart data={monthlyOfficeActivity}>
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

      {/* Performance Metrics */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-8">Indicateurs de Performance du Bureau</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {officePerformanceData.map((metric, index) => (
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

      {/* Quick Actions */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-8">Actions Rapides</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <button 
            onClick={() => setShowPrestationForm(true)}
            className="flex flex-col items-center space-y-4 p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl hover:from-blue-100 hover:to-blue-200 transition-all duration-300 border-2 border-blue-200 group"
          >
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Plus className="w-8 h-8 text-white" />
            </div>
            <div className="text-center">
              <div className="font-bold text-blue-900 text-lg">Nouvelle Prestation</div>
              <div className="text-sm text-blue-600">Créer une demande</div>
            </div>
          </button>
          
          <button 
            onClick={() => setShowVisiteForm(true)}
            className="flex flex-col items-center space-y-4 p-8 bg-gradient-to-br from-green-50 to-green-100 rounded-3xl hover:from-green-100 hover:to-green-200 transition-all duration-300 border-2 border-green-200 group"
          >
            <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <div className="text-center">
              <div className="font-bold text-green-900 text-lg">Planifier Visite</div>
              <div className="text-sm text-green-600">Nouvelle visite</div>
            </div>
          </button>
          
          <button className="flex flex-col items-center space-y-4 p-8 bg-gradient-to-br from-purple-50 to-purple-100 rounded-3xl hover:from-purple-100 hover:to-purple-200 transition-all duration-300 border-2 border-purple-200 group">
            <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Upload className="w-8 h-8 text-white" />
            </div>
            <div className="text-center">
              <div className="font-bold text-purple-900 text-lg">Archiver Document</div>
              <div className="text-sm text-purple-600">Nouveau document</div>
            </div>
          </button>
          
          <button className="flex flex-col items-center space-y-4 p-8 bg-gradient-to-br from-orange-50 to-orange-100 rounded-3xl hover:from-orange-100 hover:to-orange-200 transition-all duration-300 border-2 border-orange-200 group">
            <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <div className="text-center">
              <div className="font-bold text-orange-900 text-lg">Générer Rapport</div>
              <div className="text-sm text-orange-600">Statistiques</div>
            </div>
          </button>
        </div>
      </div>

      {/* Detailed Activity Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Activité Mensuelle Détaillée</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyOfficeActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="prestations" stroke="#3B82F6" strokeWidth={3} name="Prestations" />
                <Line type="monotone" dataKey="visites" stroke="#10B981" strokeWidth={3} name="Visites" />
                <Line type="monotone" dataKey="archives" stroke="#8B5CF6" strokeWidth={3} name="Archives" />
                <Line type="monotone" dataKey="documents" stroke="#F59E0B" strokeWidth={3} name="Documents" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Performance par Service</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-2xl">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-bold text-blue-900">Prestations</div>
                  <div className="text-sm text-blue-600">Service principal</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-900">94%</div>
                <div className="text-sm text-blue-600">Efficacité</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-green-50 rounded-2xl">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-bold text-green-900">Visites</div>
                  <div className="text-sm text-green-600">Planification</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-900">89%</div>
                <div className="text-sm text-green-600">Réalisation</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-2xl">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                  <Archive className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-bold text-purple-900">Archives</div>
                  <div className="text-sm text-purple-600">Documentation</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-900">97%</div>
                <div className="text-sm text-purple-600">Organisation</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-2xl">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-bold text-orange-900">Bibliothèque</div>
                  <div className="text-sm text-orange-600">Gestion</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-orange-900">91%</div>
                <div className="text-sm text-orange-600">Disponibilité</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Tableau de bord des prestations avec statistiques détaillées
  const renderPrestationsDashboard = () => (
    <div className="space-y-8">
      {/* Prestations Header */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center">
              <Zap className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">Tableau de Bord des Prestations</h1>
              <p className="text-blue-100 text-lg">Analyse complète des demandes de services</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">{prestationStats.total}</div>
            <div className="text-blue-200">Total prestations</div>
          </div>
        </div>
      </div>

      {/* Prestation Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-blue-900 mb-2">{prestationStats.total}</div>
            <div className="text-sm text-blue-600 font-semibold">Total Prestations</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Plus className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-green-900 mb-2">{prestationStats.nouvelles}</div>
            <div className="text-sm text-green-600 font-semibold">Nouveaux</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="text-3xl font-bold text-yellow-900 mb-2">{prestationStats.receptionnees}</div>
            <div className="text-sm text-yellow-600 font-semibold">Receptionnees</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-purple-900 mb-2">{prestationStats.validees}</div>
            <div className="text-sm text-purple-600 font-semibold">Validés</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Package className="w-6 h-6 text-gray-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{prestationStats.traitees}</div>
            <div className="text-sm text-gray-600 font-semibold">Traitees</div>
          </div>
        </div>
      </div>

      {/* Prestation Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Status Distribution */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-900">Répartition par Statut</h3>
            <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center">
              <PieChartIcon className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={prestationStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={140}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {prestationStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            {prestationStatusData.map((item, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }}></div>
                <div>
                  <span className="font-semibold text-gray-900">{item.name}</span>
                  <div className="text-sm text-gray-600">{item.value} prestations</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Processing Time Analysis */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-900">Temps de Traitement Moyen</h3>
            <div className="w-10 h-10 bg-orange-50 rounded-2xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={prestationTimelineData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="stage" type="category" width={100} />
                <Tooltip formatter={(value) => [`${value} jours`, 'Durée moyenne']} />
                <Bar dataKey="avgDays" radius={[0, 8, 8, 0]}>
                  {prestationTimelineData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Department Performance */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-8">Performance par Département</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {departmentPrestationData.map((dept, index) => (
            <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-gray-900">{dept.department}</h4>
                <div className="text-2xl font-bold text-indigo-600">{dept.count}</div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Part du total</span>
                  <span className="font-semibold">{dept.percentage}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Temps moyen</span>
                  <span className="font-semibold">{dept.avgTime} jours</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-indigo-500 h-3 rounded-full"
                    style={{ width: `${dept.percentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trends Analysis */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-8">Tendances des Prestations</h3>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={prestationTrendsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="nouveau" 
                stackId="1"
                stroke="#3B82F6" 
                fill="#3B82F6" 
                name="Nouveau"
              />
              <Area 
                type="monotone" 
                dataKey="traite" 
                stackId="1"
                stroke="#F59E0B" 
                fill="#F59E0B" 
                name="Traité"
              />
              <Area 
                type="monotone" 
                dataKey="livre" 
                stackId="1"
                stroke="#10B981" 
                fill="#10B981" 
                name="Livré"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  // Nouvelle Prestation Page
  const renderNouvellePrestation = () => (
    <div className="space-y-6">
      {!showPrestationTemplate ? (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Nouvelle Prestation</h3>
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setShowPrestationTemplate(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <FileText className="w-4 h-4" />
                <span>Formulaire Vierge</span>
              </button>
              <button 
                onClick={() => setShowPrestationForm(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
              >
                <Plus className="w-4 h-4" />
                <span>Créer une Prestation</span>
              </button>
            </div>
          </div>

          <div className="text-center py-12">
            <Zap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Créer une nouvelle prestation</h4>
            <p className="text-gray-600 mb-6">Choisissez une option pour commencer :</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <div 
                onClick={() => setShowPrestationTemplate(true)}
                className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 cursor-pointer hover:bg-blue-100 transition-colors"
              >
                <FileText className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <h5 className="font-semibold text-blue-900 mb-2">Formulaire Imprimable</h5>
                <p className="text-sm text-blue-700">Générer un formulaire vierge à imprimer et remplir manuellement</p>
              </div>
              <div 
                onClick={() => setShowPrestationForm(true)}
                className="bg-orange-50 border-2 border-orange-200 rounded-xl p-6 cursor-pointer hover:bg-orange-100 transition-colors"
              >
                <Plus className="w-12 h-12 text-orange-600 mx-auto mb-3" />
                <h5 className="font-semibold text-orange-900 mb-2">Saisie Directe</h5>
                <p className="text-sm text-orange-700">Remplir le formulaire directement en ligne</p>
              </div>
            </div>
          </div>

          {showPrestationForm && (
            <PrestationForm
              onClose={() => setShowPrestationForm(false)}
              onSuccess={(newPrestation) => {
                setCreatedPrestation(newPrestation);
                refreshPrestations();
                setShowPrestationForm(false);
                setShowPrestationTemplate(true);
              }}
              editData={createdPrestation}
            />
          )}
        </div>
      ) : (
        <div>
          <div className="mb-4">
            <button
              onClick={() => {
                setShowPrestationTemplate(false);
                setCreatedPrestation(null);
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              <ArrowRight className="w-4 h-4 transform rotate-180" />
              <span>Retour</span>
            </button>
          </div>
          <PrestationTemplate 
            prestationData={createdPrestation}
            onDownload={() => {
              // Logic for download
              console.log('Download prestation');
            }}
            onPrint={() => window.print()}
          />
        </div>
      )}
    </div>
  );

  // Suivi des prestations avec tableau
  const renderSuiviPrestations = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Suivi des Prestations</h3>
          <button 
            onClick={() => setShowPrestationForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            <Plus className="w-4 h-4" />
            <span>Nouvelle Prestation</span>
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
          <div
            onClick={() => setFilterStatus('all')}
            className={`rounded-xl p-4 border cursor-pointer transition-all ${
              filterStatus === 'all' ? 'bg-gray-100 border-gray-400 shadow-md' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
            }`}
          >
            <div className="text-center">
              <FileText className="w-6 h-6 mx-auto mb-2 text-gray-600" />
              <p className="text-2xl font-bold text-gray-800">{prestationStats.total}</p>
              <p className="text-sm text-gray-600">Total</p>
            </div>
          </div>
          <div
            onClick={() => setFilterStatus('nouvelles')}
            className={`rounded-xl p-4 border cursor-pointer transition-all ${
              filterStatus === 'nouvelles' ? 'bg-blue-100 border-blue-400 shadow-md' : 'bg-blue-50 border-blue-200 hover:bg-blue-100'
            }`}
          >
            <div className="text-center">
              <Plus className="w-6 h-6 mx-auto mb-2 text-blue-600" />
              <p className="text-2xl font-bold text-blue-800">{prestations.filter(p => p.statut === 'nouvelles').length}</p>
              <p className="text-sm text-blue-600">Nouvelles</p>
            </div>
          </div>
          <div
            onClick={() => setFilterStatus('validees')}
            className={`rounded-xl p-4 border cursor-pointer transition-all ${
              filterStatus === 'validees' ? 'bg-green-100 border-green-400 shadow-md' : 'bg-green-50 border-green-200 hover:bg-green-100'
            }`}
          >
            <div className="text-center">
              <CheckCircle className="w-6 h-6 mx-auto mb-2 text-green-600" />
              <p className="text-2xl font-bold text-green-800">{prestations.filter(p => p.statut === 'validees').length}</p>
              <p className="text-sm text-green-600">Validées</p>
            </div>
          </div>
          <div
            onClick={() => setFilterStatus('receptionnees')}
            className={`rounded-xl p-4 border cursor-pointer transition-all ${
              filterStatus === 'receptionnees' ? 'bg-purple-100 border-purple-400 shadow-md' : 'bg-purple-50 border-purple-200 hover:bg-purple-100'
            }`}
          >
            <div className="text-center">
              <Package className="w-6 h-6 mx-auto mb-2 text-purple-600" />
              <p className="text-2xl font-bold text-purple-800">{prestations.filter(p => p.statut === 'receptionnees').length}</p>
              <p className="text-sm text-purple-600">Réceptionnées</p>
            </div>
          </div>
          <div
            onClick={() => setFilterStatus('renvoyees')}
            className={`rounded-xl p-4 border cursor-pointer transition-all ${
              filterStatus === 'renvoyees' ? 'bg-yellow-100 border-yellow-400 shadow-md' : 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100'
            }`}
          >
            <div className="text-center">
              <RotateCcw className="w-6 h-6 mx-auto mb-2 text-yellow-600" />
              <p className="text-2xl font-bold text-yellow-800">{prestations.filter(p => p.statut === 'renvoyees').length}</p>
              <p className="text-sm text-yellow-600">Renvoyées</p>
            </div>
          </div>
          <div
            onClick={() => setFilterStatus('traitees')}
            className={`rounded-xl p-4 border cursor-pointer transition-all ${
              filterStatus === 'traitees' ? 'bg-teal-100 border-teal-400 shadow-md' : 'bg-teal-50 border-teal-200 hover:bg-teal-100'
            }`}
          >
            <div className="text-center">
              <Zap className="w-6 h-6 mx-auto mb-2 text-teal-600" />
              <p className="text-2xl font-bold text-teal-800">{prestations.filter(p => p.statut === 'traitees').length}</p>
              <p className="text-sm text-teal-600">Traitées</p>
            </div>
          </div>
          <div
            onClick={() => setFilterStatus('refusees')}
            className={`rounded-xl p-4 border cursor-pointer transition-all ${
              filterStatus === 'refusees' ? 'bg-red-100 border-red-400 shadow-md' : 'bg-red-50 border-red-200 hover:bg-red-100'
            }`}
          >
            <div className="text-center">
              <XCircle className="w-6 h-6 mx-auto mb-2 text-red-600" />
              <p className="text-2xl font-bold text-red-800">{prestations.filter(p => p.statut === 'refusees').length}</p>
              <p className="text-sm text-red-600">Refusées</p>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une prestation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="all">Tous les statuts</option>
            <option value="nouvelles">Nouvelles</option>
            <option value="validees">Validées</option>
            <option value="receptionnees">Réceptionnées</option>
            <option value="renvoyees">Renvoyées</option>
            <option value="traitees">Traitées</option>
            <option value="refusees">Refusées</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {prestations.filter(prestation =>
            filterStatus === 'all' || prestation.statut === filterStatus
          ).filter(prestation =>
            prestation.client_nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
            prestation.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (prestation.code_prestation && prestation.code_prestation.toLowerCase().includes(searchTerm.toLowerCase()))
          ).map((prestation) => (
            <div key={prestation.id} className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-200 hover:border-blue-300">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="bg-blue-100 text-blue-800 font-mono font-bold px-3 py-1.5 rounded-lg text-sm">
                      {prestation.code_prestation || prestation.numero}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPrestationStatusColor(prestation.statut!)}`}>
                      {getPrestationStatusLabel(prestation.statut!)}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-1">{prestation.client_nom}</h4>
                  <p className="text-sm text-gray-600">{prestation.client_type}</p>
                </div>
                <div className="flex items-center space-x-1">
                  {prestation.priorite === 'urgente' && (
                    <div className="bg-red-100 text-red-600 p-2 rounded-lg" title="Urgent">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-start space-x-3">
                  <FileText className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 mb-0.5">Procédure</p>
                    <p className="text-sm font-medium text-gray-900 truncate" title={prestation.procedure_choisie}>
                      {prestation.procedure_choisie}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Calendar className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-0.5">Date de création</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(prestation.created_at).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                {prestation.ville && (
                  <div className="flex items-start space-x-3">
                    <Target className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-0.5">Localisation</p>
                      <p className="text-sm font-medium text-gray-900">
                        {prestation.ville}{prestation.region ? `, ${prestation.region}` : ''}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
  <div className="flex items-center space-x-2">
    <button
      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
      onClick={() => {
        setSelectedPrestation(prestation);
        setShowPrestationTemplate(true);
      }}
      title="Voir les détails"
    >
      <Eye className="w-5 h-5" />
    </button>
    
    {prestation.statut === 'nouvelles' && (
      <>
        <button
          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
          onClick={() => {
            setPrestationToValidate(prestation);
            setShowValidationModal(true);
          }}
          title="Valider la prestation"
        >
          <CheckCircle className="w-5 h-5" />
        </button>
        
        <button
          className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
          onClick={() => {
            setPrestationToEdit(prestation);
            setShowPrestationForm(true);
          }}
          title="Modifier"
        >
          <Edit className="w-5 h-5" />
        </button>
      </>
    )}
  </div>
  
  {prestation.statut === 'nouvelles' && (
    <button
      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
      title="Supprimer"
    >
      <Trash2 className="w-5 h-5" />
    </button>
  )}
</div>
            </div>
          ))}
        </div>

        {prestations.filter(prestation =>
          filterStatus === 'all' || prestation.statut === filterStatus
        ).filter(prestation =>
          prestation.client_nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          prestation.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (prestation.code_prestation && prestation.code_prestation.toLowerCase().includes(searchTerm.toLowerCase()))
        ).length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucune prestation trouvée</p>
          </div>
        )}
      </div>

      {/* Prestation Template Modal */}
      {showPrestationTemplate && selectedPrestation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 no-print">
  <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[95vh] flex flex-col">
    {/* Header fixe */}
    <div className="flex-shrink-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-2xl p-6 text-white no-print sticky top-0 z-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Eye className="w-8 h-8" />
          <h2 className="text-2xl font-bold">Détails de la Prestation</h2>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              // Logic for transfer
              console.log('Transfer prestation:', selectedPrestation.id);
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Send className="w-4 h-4" />
            <span>Transférer</span>
          </button>
          <button
            onClick={() => {
              setShowPrestationTemplate(false);
              setSelectedPrestation(null);
            }}
            className="text-white hover:text-gray-200 p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>

    {/* Contenu scrollable */}
    <div className="flex-1 overflow-y-auto">
      <PrestationTemplate
        prestationData={selectedPrestation}
        onDownload={() => console.log('Download')}
        onPrint={() => window.print()}
      />
    </div>
  </div>
</div>
      )}

      {/* Forms */}
      {showPrestationForm && (
        <PrestationForm
          onClose={() => setShowPrestationForm(false)}
          onSuccess={(newPrestation) => {
            setCreatedPrestation(newPrestation);
            refreshPrestations();
            setShowPrestationForm(false);
            setShowPrestationTemplate(true);
          }}
          editData={createdPrestation}
        />
      )}

      {/* Validation Modal */}
      {showValidationModal && prestationToValidate && (
        <ValidationModal
          prestation={prestationToValidate}
          onClose={() => {
            setShowValidationModal(false);
            setPrestationToValidate(null);
          }}
          onSuccess={() => {
            refreshPrestations();
            setShowValidationModal(false);
            setPrestationToValidate(null);
          }}
        />
      )}
    </div>
  );

  // Visites Dashboard
  const renderVisitesDashboard = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Tableau de Bord des Visites</h3>
          <button 
            onClick={() => setShowVisiteForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Plus className="w-4 h-4" />
            <span>Nouvelle Visite</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-800">{visiteStats.planifiee}</p>
              <p className="text-sm text-green-600">Planifiées</p>
            </div>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-800">{visiteStats.en_cours}</p>
              <p className="text-sm text-blue-600">En cours</p>
            </div>
          </div>
          <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-800">{visiteStats.realisee}</p>
              <p className="text-sm text-yellow-600">Réalisées</p>
            </div>
          </div>
          <div className="bg-red-50 rounded-xl p-4 border border-red-200">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-800">{visiteStats.urgent}</p>
              <p className="text-sm text-red-600">Urgentes</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une visite..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Numéro</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Client</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Type</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Lieu</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Statut</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visites.filter(visite =>
                visite.client_nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                visite.numero.toLowerCase().includes(searchTerm.toLowerCase())
              ).map((visite) => (
                <tr key={visite.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{visite.numero}</td>
                  <td className="py-3 px-4 text-gray-600">{visite.client_nom}</td>
                  <td className="py-3 px-4 text-gray-600">{visite.type_visite}</td>
                  <td className="py-3 px-4 text-gray-600">{visite.lieu_visite}</td>
                  <td className="py-3 px-4 text-gray-600">{new Date(visite.date_debut).toLocaleDateString('fr-FR')}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getVisiteStatusColor(visite.statut!)}`}>
                      {visite.statut}
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
                      <button className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Forms */}
      {showVisiteForm && (
        <VisiteForm
          onClose={() => setShowVisiteForm(false)}
          onSuccess={() => {
            refreshVisites();
            setShowVisiteForm(false);
          }}
        />
      )}
    </div>
  );

  // Planification Visite
  const renderPlanificationVisite = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Planification d'une Visite</h3>
          <button 
            onClick={() => setShowVisiteForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Plus className="w-4 h-4" />
            <span>Nouvelle Visite</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Visites Aujourd'hui */}
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-blue-900">Aujourd'hui</h4>
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-blue-800 mb-2">{visiteStats.today}</div>
            <p className="text-sm text-blue-600">Visites prévues</p>
          </div>

          {/* Visites Cette Semaine */}
          <div className="bg-green-50 rounded-xl p-6 border border-green-200">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-green-900">Cette Semaine</h4>
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-green-800 mb-2">{visiteStats.planifiee + visiteStats.confirmee}</div>
            <p className="text-sm text-green-600">Visites planifiées</p>
          </div>

          {/* Taux de Réalisation */}
          <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-purple-900">Taux Réalisation</h4>
              <CheckCircle className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-purple-800 mb-2">
              {visiteStats.total > 0 ? Math.round((visiteStats.realisee / visiteStats.total) * 100) : 0}%
            </div>
            <p className="text-sm text-purple-600">Visites réalisées</p>
          </div>
        </div>

        {/* Prochaines Visites */}
        <div className="mt-8">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Prochaines Visites</h4>
          <div className="space-y-3">
            {visites.filter(v => new Date(v.date_debut) > new Date()).slice(0, 3).map((visite) => (
              <div key={visite.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{visite.client_nom}</div>
                    <div className="text-sm text-gray-600">{visite.lieu_visite}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {new Date(visite.date_debut).toLocaleDateString('fr-FR')}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(visite.date_debut).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        {showVisiteForm && (
          <VisiteForm
            onClose={() => setShowVisiteForm(false)}
            onSuccess={() => {
              refreshVisites();
              setShowVisiteForm(false);
            }}
          />
        )}
      </div>
    </div>
  );

  // Suivi Visites
  const renderSuiviVisites = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Suivi des Visites</h3>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une visite..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              <Plus className="w-4 h-4" />
              <span>Nouvelle Visite</span>
            </button>
          </div>
        </div>

        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Suivi des visites</h4>
          <p className="text-gray-600">Le module de suivi détaillé des visites sera bientôt disponible.</p>
        </div>
      </div>

      {/* Forms */}
      {showPrestationForm && (
        <PrestationForm
          onClose={() => setShowPrestationForm(false)}
          onSuccess={() => {
            refreshPrestations();
            setShowPrestationForm(false);
          }}
        />
      )}

      {showVisiteForm && (
        <VisiteForm
          onClose={() => setShowVisiteForm(false)}
          onSuccess={() => {
            refreshVisites();
            setShowVisiteForm(false);
          }}
        />
      )}
    </div>
  );

  // Archives Dashboard
  const renderArchivesDashboard = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Gestion des Archives</h3>
        <div className="text-center py-12">
          <Archive className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Module Archives</h4>
          <p className="text-gray-600">Le module de gestion des archives sera bientôt disponible.</p>
        </div>
      </div>
    </div>
  );

  // Bibliothèque Dashboard
  const renderBibliotequeDashboard = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Gestion de la Bibliothèque</h3>
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Module Bibliothèque</h4>
          <p className="text-gray-600">Le module de gestion de la bibliothèque sera bientôt disponible.</p>
        </div>
      </div>
    </div>
  );

  // Main render function
  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
      case 'overview':
        return renderOfficeOverview();
      case 'accueil-standard':
        return renderPrestationsDashboard();
      case 'nouvelle-prestation':
        return renderNouvellePrestation();
      case 'suivi-prestations':
        return renderSuiviPrestations();
      case 'visites':
        return renderVisitesDashboard();
      case 'planification-visite':
        return renderPlanificationVisite();
      case 'suivi-visites':
        return renderSuiviVisites();
      case 'archives-dashboard':
        return renderArchivesDashboard();
      case 'bibliotheque-dashboard':
        return renderBibliotequeDashboard();
      default:
        return renderOfficeOverview();
    }
  };

  return (
    <div className="space-y-6">
      {renderContent()}

      {/* Forms and Modals */}
      {showPrestationForm && (
        <PrestationForm
          onClose={() => {
            setShowPrestationForm(false);
            setPrestationToEdit(null);
          }}
          onSuccess={handlePrestationSuccess}
        />
      )}

      {/* Success Modal */}
      {showSuccessModal && createdPrestation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-t-3xl p-8 text-white text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Prestation Créée avec Succès!</h2>
              <p className="text-green-100 text-lg">Votre demande a été enregistrée et est prête à être traitée</p>
            </div>
            <div className="p-8">
              <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                <div className="text-center mb-4">
                  <div className="text-sm text-gray-600 mb-2">Code de la Prestation</div>
                  <div className="text-3xl font-bold text-blue-600 font-mono">{createdPrestation.code_prestation}</div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600 mb-1">Client</div>
                    <div className="font-semibold text-gray-900">{createdPrestation.client_nom}</div>
                  </div>
                  <div>
                    <div className="text-gray-600 mb-1">Type</div>
                    <div className="font-semibold text-gray-900">{createdPrestation.client_type}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-gray-600 mb-1">Procédure</div>
                    <div className="font-semibold text-gray-900">{createdPrestation.procedure_choisie}</div>
                  </div>
                </div>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    setSelectedPrestation(createdPrestation);
                    setShowSuccessModal(false);
                    setShowPrestationTemplate(true);
                  }}
                  className="flex-1 px-6 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 flex items-center justify-center space-x-2 font-semibold"
                >
                  <Eye className="w-5 h-5" />
                  <span>Voir les Détails</span>
                </button>
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    setCreatedPrestation(null);
                  }}
                  className="flex-1 px-6 py-4 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-200 font-semibold"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPrestationTemplate && selectedPrestation && (
        <PrestationTemplate
          prestationData={selectedPrestation}
          onBack={() => {
            setShowPrestationTemplate(false);
            setSelectedPrestation(null);
          }}
          onDownload={() => console.log('Download PDF')}
          onPrint={() => window.print()}
        />
      )}

      {showVisiteForm && (
        <VisiteForm
          onClose={() => setShowVisiteForm(false)}
          onSuccess={() => {
            refreshVisites();
            setShowVisiteForm(false);
          }}
        />
      )}
    </div>
  );
};

export default ArchivesDashboard;