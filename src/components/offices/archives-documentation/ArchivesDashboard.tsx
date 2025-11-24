import React, { useState, useEffect } from 'react';
import { Archive, BookOpen, FileText, Users, TrendingUp, Plus, Search, Send, X, ChevronRight, ChevronLeft, Trash2, Eye, CreditCard as Edit, Download, Upload, BarChart3, PieChart as PieChartIcon, Calendar, Clock, CheckCircle, Package, Zap, Target, ArrowRight, XCircle, RotateCcw, AlertCircle, Grid, List } from 'lucide-react';
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

// Composant Carte pour la vue grille
const PrestationCard = ({ prestation, onView, onEdit, onDelete, onValidate, getPrestationStatusColor, getPrestationStatusLabel }) => {
  return (
    <div className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 hover:border-blue-300 hover:scale-102">
      {/* En-tête de la carte */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-3">
            <div className="bg-blue-100 text-blue-800 font-mono font-bold px-3 py-1.5 rounded-lg text-xs">
              {prestation.numero}
            </div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getPrestationStatusColor(prestation.statut!)}`}>
              {getPrestationStatusLabel(prestation.statut!)}
            </span>
          </div>
          <h4 className="text-lg font-bold text-gray-900 mb-1 truncate" title={prestation.nom_du_dossier}>
            {prestation.nom_du_dossier}
          </h4>
          <h4 className="text-base font-semibold text-gray-800 mb-1 truncate" title={prestation.client_nom}>
            {prestation.client_nom}
          </h4>
          <p className="text-sm text-gray-600">{prestation.client_type}</p>
        </div>
        <div className="flex items-center space-x-1 ml-2">
          {prestation.priorite === 'urgente' && (
            <div className="bg-red-100 text-red-600 p-2 rounded-lg shadow-sm" title="Urgent">
              <AlertCircle className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>

      {/* Section Raison de Refus pour les statuts Refusées */}
      {(prestation.statut === 'refusees' || prestation.statut === 'renvoyees') && prestation.raison_refus && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs font-semibold text-red-800 mb-1">Raison du {prestation.statut === 'refusees' ? 'Refus' : 'Renvoi'}</p>
              <p className="text-sm text-red-700">{prestation.raison_refus}</p>
              {prestation.date_refus && (
                <p className="text-xs text-red-600 mt-1">
                  Le {new Date(prestation.date_refus).toLocaleDateString('fr-FR')}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Informations détaillées */}
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

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-1">
          <button
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
            onClick={onView}
            title="Voir les détails"
          >
            <Eye className="w-5 h-5" />
          </button>
          
          {/* Actions pour Nouvelles */}
          {prestation.statut === 'nouvelles' && (
            <>
              <button
                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                onClick={onValidate}
                title="Valider la prestation"
              >
                <CheckCircle className="w-5 h-5" />
              </button>
              
              <button
                className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors duration-200"
                onClick={onEdit}
                title="Modifier"
              >
                <Edit className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Actions pour Renvoyées */}
          {prestation.statut === 'renvoyees' && (
            <>
              <button
                className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors duration-200"
                onClick={onEdit}
                title="Modifier"
              >
                <Edit className="w-5 h-5" />
              </button>
              
              <button
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                onClick={onDelete}
                title="Supprimer"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Actions pour Refusées */}
          {prestation.statut === 'refusees' && (
            <>
              <button
                className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors duration-200"
                onClick={onEdit}
                title="Modifier"
              >
                <Edit className="w-5 h-5" />
              </button>
              
              <button
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                onClick={onDelete}
                title="Supprimer"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
        
        {/* Bouton Supprimer pour Nouvelles seulement */}
        {prestation.statut === 'nouvelles' && (
          <button
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
            onClick={onDelete}
            title="Supprimer"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

// Composant Ligne pour la vue liste
const PrestationListItem = ({ prestation, onView, onEdit, onDelete, onValidate, getPrestationStatusColor, getPrestationStatusLabel }) => {
  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6 flex-1">
          {/* Numéro et Statut */}
          <div className="flex flex-col items-center space-y-2 min-w-20">
            <div className="bg-blue-100 text-blue-800 font-mono font-bold px-3 py-1.5 rounded-lg text-xs">
              {prestation.numero}
            </div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getPrestationStatusColor(prestation.statut!)}`}>
              {getPrestationStatusLabel(prestation.statut!)}
            </span>
          </div>

          {/* Informations principales */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Dossier</p>
              <p className="font-semibold text-gray-900 truncate">{prestation.nom_du_dossier}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Client</p>
              <p className="font-medium text-gray-800 truncate">{prestation.client_nom}</p>
              <p className="text-xs text-gray-600">{prestation.client_type}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Procédure</p>
              <p className="font-medium text-gray-800 truncate">{prestation.procedure_choisie}</p>
            </div>
          </div>

          {/* Localisation */}
          <div className="text-right min-w-32">
            <p className="text-xs text-gray-500 mb-1">Localisation</p>
            <p className="font-medium text-gray-800">
              {prestation.ville}{prestation.region ? `, ${prestation.region}` : ''}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 ml-6">
          <button
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
            onClick={onView}
            title="Voir les détails"
          >
            <Eye className="w-5 h-5" />
          </button>

          {/* Actions conditionnelles par statut */}
          {prestation.statut === 'nouvelles' && (
            <>
              <button
                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                onClick={onValidate}
                title="Valider la prestation"
              >
                <CheckCircle className="w-5 h-5" />
              </button>
              <button
                className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors duration-200"
                onClick={onEdit}
                title="Modifier"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                onClick={onDelete}
                title="Supprimer"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </>
          )}

          {(prestation.statut === 'renvoyees' || prestation.statut === 'refusees') && (
            <>
              <button
                className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors duration-200"
                onClick={onEdit}
                title="Modifier"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                onClick={onDelete}
                title="Supprimer"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Section Raison de Refus pour les statuts Refusées et Renvoyées */}
      {(prestation.statut === 'refusees' || prestation.statut === 'renvoyees') && prestation.raison_refus && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs font-semibold text-red-800 mb-1">
                Raison du {prestation.statut === 'refusees' ? 'Refus' : 'Renvoi'}
              </p>
              <p className="text-sm text-red-700">{prestation.raison_refus}</p>
              {prestation.date_refus && (
                <p className="text-xs text-red-600 mt-1">
                  Le {new Date(prestation.date_refus).toLocaleDateString('fr-FR')}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ArchivesDashboard: React.FC<ArchivesDashboardProps> = ({ user, activeSection }) => {
  const { archives, stats: archiveStats, refreshArchives } = useArchives();
  const { documents, stats: bibliothequeStats, refreshDocuments } = useBibliotheque();
  const { visites, stats: visiteStats, refreshVisites } = useVisites();
  const { prestations, stats: prestationStats, refreshPrestations, updatePrestation, deletePrestation } = usePrestations();
  
  // États d'affichage des modals
  const [showPrestationForm, setShowPrestationForm] = useState(false);
  const [showVisiteForm, setShowVisiteForm] = useState(false);
  const [showPrestationTemplate, setShowPrestationTemplate] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // États des données
  const [currentPrestation, setCurrentPrestation] = useState<any>(null);
  const [selectedPrestation, setSelectedPrestation] = useState<any>(null);
  const [prestationToValidate, setPrestationToValidate] = useState<any>(null);
  const [prestationToDelete, setPrestationToDelete] = useState<any>(null);
  const [createdPrestation, setCreatedPrestation] = useState<any>(null);
  const [prestationToEdit, setPrestationToEdit] = useState<any>(null);
  
  // États d'interface
  const [isEditMode, setIsEditMode] = useState(false);
  const [timeStats, setTimeStats] = useState<any>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(false);

  // États de pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [viewMode, setViewMode] = useState('grid'); 

  // Statistiques combinées
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
      setTimeStats({}); 
    } catch (error) {
      console.error('Erreur chargement stats:', error);
    }
  };

  // Fonctions utilitaires pour les statuts
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

  // Données pour les graphiques
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

  // Données pour les prestations
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

  // Gestion des succès
  const handlePrestationSuccess = (prestationData: any) => {
    const editing = !!prestationToEdit;
    setIsEditMode(editing);
    setCreatedPrestation(prestationData);
    setShowSuccessModal(true);
    refreshPrestations();
    setPrestationToEdit(null);
    
    console.log(`${editing ? 'Édition' : 'Création'} réussie:`, prestationData);
  };

  // Fonction pour éditer une prestation
  const handleEditPrestation = async (prestation: any) => {
    try {
      setLoading(true);
      setPrestationToEdit(prestation);
      setIsEditMode(true);
      setShowPrestationForm(true);
    } catch (error) {
      console.error('Erreur lors de la préparation de l\'édition:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour supprimer une prestation
  const handleDeletePrestation = async (prestation: any) => {
    try {
      setLoading(true);
      await deletePrestation(prestation.id);
      setShowDeleteModal(false);
      setPrestationToDelete(null);
      refreshPrestations();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour confirmer la suppression
  const confirmDelete = (prestation: any) => {
    setPrestationToDelete(prestation);
    setShowDeleteModal(true);
  };

  // Fonctions de pagination
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const goToPreviousPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const goToNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

  // Vue d'Ensemble du Bureau
  const renderOfficeOverview = () => (
    <div className="space-y-8">
      {/* En-tête du bureau */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white shadow-2xl">
        <div className="flex flex-col lg:flex-row items-center justify-between space-y-6 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center">
              <Archive className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold mb-2">Bureau des Archives Documentation et Services Internes</h1>
              <p className="text-indigo-100 text-sm lg:text-lg">Gestion complète des prestations, visites, archives et bibliothèque</p>
            </div>
          </div>
          <div className="text-center lg:text-right">
            <div className="text-3xl lg:text-4xl font-bold">{stats.prestations.total + stats.visites.total + stats.archives.total}</div>
            <div className="text-indigo-200">Total activités</div>
          </div>
        </div>
      </div>

      {/* Cartes de statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300 group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Zap className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
            </div>
            <div className="text-right">
              <div className="text-2xl lg:text-3xl font-bold text-gray-900">{stats.prestations.total}</div>
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
            <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Users className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
            </div>
            <div className="text-right">
              <div className="text-2xl lg:text-3xl font-bold text-gray-900">{stats.visites.total}</div>
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
            <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Archive className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
            </div>
            <div className="text-right">
              <div className="text-2xl lg:text-3xl font-bold text-gray-900">{stats.archives.total}</div>
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
            <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <BookOpen className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
            </div>
            <div className="text-right">
              <div className="text-2xl lg:text-3xl font-bold text-gray-900">{stats.bibliotheque.total}</div>
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

      {/* Distribution des activités du bureau */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6 lg:mb-8">
            <h3 className="text-xl lg:text-2xl font-bold text-gray-900">Répartition des Activités du Bureau</h3>
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-indigo-50 rounded-2xl flex items-center justify-center">
              <PieChartIcon className="w-4 h-4 lg:w-5 lg:h-5 text-indigo-600" />
            </div>
          </div>
          <div className="h-64 lg:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={officeOverviewData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
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
                <div className="w-3 h-3 lg:w-4 lg:h-4 rounded-full" style={{ backgroundColor: item.color }}></div>
                <div>
                  <span className="font-semibold text-gray-900 text-sm lg:text-base">{item.name}</span>
                  <div className="text-sm text-gray-600">{item.value} éléments</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6 lg:mb-8">
            <h3 className="text-xl lg:text-2xl font-bold text-gray-900">Évolution Mensuelle</h3>
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-green-50 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-4 h-4 lg:w-5 lg:h-5 text-green-600" />
            </div>
          </div>
          <div className="h-64 lg:h-80">
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

      {/* Indicateurs de performance */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 lg:p-8">
        <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-6 lg:mb-8">Indicateurs de Performance du Bureau</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {officePerformanceData.map((metric, index) => (
            <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-gray-900 text-sm lg:text-base">{metric.metric}</h4>
                <div className={`text-xl lg:text-2xl font-bold ${metric.value >= metric.target ? 'text-green-600' : 'text-orange-600'}`}>
                  {metric.value}%
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Objectif</span>
                  <span className="font-medium">{metric.target}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 lg:h-3">
                  <div 
                    className={`h-2 lg:h-3 rounded-full ${metric.value >= metric.target ? 'bg-green-500' : 'bg-orange-500'}`}
                    style={{ width: `${metric.value}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions rapides */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 lg:p-8">
        <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-6 lg:mb-8">Actions Rapides</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <button 
            onClick={() => {
              setPrestationToEdit(null);
              setIsEditMode(false);
              setShowPrestationForm(true);
            }}
            className="flex flex-col items-center space-y-4 p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl hover:from-blue-100 hover:to-blue-200 transition-all duration-300 border-2 border-blue-200 group"
          >
            <div className="w-12 h-12 lg:w-16 lg:h-16 bg-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Plus className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
            </div>
            <div className="text-center">
              <div className="font-bold text-blue-900 text-base lg:text-lg">Nouvelle Prestation</div>
              <div className="text-sm text-blue-600">Créer une demande</div>
            </div>
          </button>
          
          <button 
            onClick={() => setShowVisiteForm(true)}
            className="flex flex-col items-center space-y-4 p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-3xl hover:from-green-100 hover:to-green-200 transition-all duration-300 border-2 border-green-200 group"
          >
            <div className="w-12 h-12 lg:w-16 lg:h-16 bg-green-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Calendar className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
            </div>
            <div className="text-center">
              <div className="font-bold text-green-900 text-base lg:text-lg">Planifier Visite</div>
              <div className="text-sm text-green-600">Nouvelle visite</div>
            </div>
          </button>
          
          <button className="flex flex-col items-center space-y-4 p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-3xl hover:from-purple-100 hover:to-purple-200 transition-all duration-300 border-2 border-purple-200 group">
            <div className="w-12 h-12 lg:w-16 lg:h-16 bg-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Upload className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
            </div>
            <div className="text-center">
              <div className="font-bold text-purple-900 text-base lg:text-lg">Archiver Document</div>
              <div className="text-sm text-purple-600">Nouveau document</div>
            </div>
          </button>
          
          <button className="flex flex-col items-center space-y-4 p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-3xl hover:from-orange-100 hover:to-orange-200 transition-all duration-300 border-2 border-orange-200 group">
            <div className="w-12 h-12 lg:w-16 lg:h-16 bg-orange-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <BarChart3 className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
            </div>
            <div className="text-center">
              <div className="font-bold text-orange-900 text-base lg:text-lg">Générer Rapport</div>
              <div className="text-sm text-orange-600">Statistiques</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  // Tableau de bord des prestations avec statistiques détaillées
  const renderPrestationsDashboard = () => {
    // Calcul de la pagination pour le tableau de bord
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const totalPages = Math.ceil(prestations.length / itemsPerPage);

    return (
      <div className="space-y-8">
        {/* En-tête des prestations */}
        <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-6 lg:p-8 text-white shadow-2xl">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-6 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center">
                <Zap className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold mb-2">Tableau de Bord des Prestations</h1>
                <p className="text-blue-100 text-sm lg:text-lg">Analyse complète des demandes de services</p>
              </div>
            </div>
            <div className="text-center lg:text-right">
              <div className="text-3xl lg:text-4xl font-bold">{prestationStats.total}</div>
              <div className="text-blue-200">Total prestations</div>
            </div>
          </div>
        </div>

        {/* Statistiques des prestations */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 lg:p-6">
            <div className="text-center">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3 lg:mb-4">
                <FileText className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
              </div>
              <div className="text-xl lg:text-3xl font-bold text-blue-900 mb-1 lg:mb-2">{prestationStats.total}</div>
              <div className="text-xs lg:text-sm text-blue-600 font-semibold">Total Prestations</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 lg:p-6">
            <div className="text-center">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3 lg:mb-4">
                <Plus className="w-5 h-5 lg:w-6 lg:h-6 text-green-600" />
              </div>
              <div className="text-xl lg:text-3xl font-bold text-green-900 mb-1 lg:mb-2">{prestationStats.nouvelles}</div>
              <div className="text-xs lg:text-sm text-green-600 font-semibold">Nouveaux</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 lg:p-6">
            <div className="text-center">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-3 lg:mb-4">
                <Clock className="w-5 h-5 lg:w-6 lg:h-6 text-yellow-600" />
              </div>
              <div className="text-xl lg:text-3xl font-bold text-yellow-900 mb-1 lg:mb-2">{prestationStats.receptionnees}</div>
              <div className="text-xs lg:text-sm text-yellow-600 font-semibold">Receptionnees</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 lg:p-6">
            <div className="text-center">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-3 lg:mb-4">
                <CheckCircle className="w-5 h-5 lg:w-6 lg:h-6 text-purple-600" />
              </div>
              <div className="text-xl lg:text-3xl font-bold text-purple-900 mb-1 lg:mb-2">{prestationStats.validees}</div>
              <div className="text-xs lg:text-sm text-purple-600 font-semibold">Validés</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 lg:p-6 col-span-2 lg:col-span-1">
            <div className="text-center">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3 lg:mb-4">
                <Package className="w-5 h-5 lg:w-6 lg:h-6 text-gray-600" />
              </div>
              <div className="text-xl lg:text-3xl font-bold text-gray-900 mb-1 lg:mb-2">{prestationStats.traitees}</div>
              <div className="text-xs lg:text-sm text-gray-600 font-semibold">Traitees</div>
            </div>
          </div>
        </div>

        {/* Graphiques d'analyse des prestations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Distribution par statut */}
          <div className="bg-white rounded-2xl lg:rounded-3xl shadow-xl border border-gray-100 p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6 lg:mb-8">
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900">Répartition par Statut</h3>
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-50 rounded-2xl flex items-center justify-center">
                <PieChartIcon className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" />
              </div>
            </div>
            <div className="h-64 lg:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={prestationStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
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
            <div className="grid grid-cols-2 gap-3 lg:gap-4 mt-4 lg:mt-6">
              {prestationStatusData.map((item, index) => (
                <div key={index} className="flex items-center space-x-2 lg:space-x-3 p-2 lg:p-3 rounded-xl bg-gray-50">
                  <div className="w-3 h-3 lg:w-4 lg:h-4 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <div className="flex-1 min-w-0">
                    <span className="font-semibold text-gray-900 text-sm lg:text-base truncate block">{item.name}</span>
                    <div className="text-xs lg:text-sm text-gray-600">{item.value} prestations</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Analyse du temps de traitement */}
          <div className="bg-white rounded-2xl lg:rounded-3xl shadow-xl border border-gray-100 p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6 lg:mb-8">
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900">Temps de Traitement Moyen</h3>
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-orange-50 rounded-2xl flex items-center justify-center">
                <Clock className="w-4 h-4 lg:w-5 lg:h-5 text-orange-600" />
              </div>
            </div>
            <div className="h-64 lg:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={prestationTimelineData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="stage" type="category" width={80} />
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

        {/* Performance par département */}
        <div className="bg-white rounded-2xl lg:rounded-3xl shadow-xl border border-gray-100 p-6 lg:p-8">
          <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-6 lg:mb-8">Performance par Département</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {departmentPrestationData.map((dept, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 lg:p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-3 lg:mb-4">
                  <h4 className="font-bold text-gray-900 text-sm lg:text-base">{dept.department}</h4>
                  <div className="text-xl lg:text-2xl font-bold text-indigo-600">{dept.count}</div>
                </div>
                <div className="space-y-2 lg:space-y-3">
                  <div className="flex justify-between text-xs lg:text-sm">
                    <span className="text-gray-600">Part du total</span>
                    <span className="font-semibold">{dept.percentage}%</span>
                  </div>
                  <div className="flex justify-between text-xs lg:text-sm">
                    <span className="text-gray-600">Temps moyen</span>
                    <span className="font-semibold">{dept.avgTime} jours</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 lg:h-3">
                    <div 
                      className="bg-indigo-500 h-2 lg:h-3 rounded-full"
                      style={{ width: `${dept.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Analyse des tendances */}
        <div className="bg-white rounded-2xl lg:rounded-3xl shadow-xl border border-gray-100 p-6 lg:p-8">
          <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-6 lg:mb-8">Tendances des Prestations</h3>
          <div className="h-80 lg:h-96">
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

        {/* Liste des prestations avec pagination */}
        <div className="bg-white rounded-2xl lg:rounded-3xl shadow-xl border border-gray-100 p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 lg:mb-8">
            <h3 className="text-xl lg:text-2xl font-bold text-gray-900">Liste des Prestations</h3>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Affichage de {indexOfFirstItem + 1} à {Math.min(indexOfLastItem, prestations.length)} sur {prestations.length} prestations
              </span>
            </div>
          </div>

          {/* Table des prestations */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Nom</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Département</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Statut</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {prestations.slice(indexOfFirstItem, indexOfLastItem).map((prestation, index) => (
                  <tr key={prestation.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-600">#{prestation.id}</td>
                    <td className="py-3 px-4 font-medium text-gray-900">{prestation.nom_du_dossier}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{prestation.departement}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPrestationStatusColor(prestation.statut!)}`}>
                        {getPrestationStatusLabel(prestation.statut!)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(prestation.created_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditPrestation(prestation)}
                          className="text-blue-600 hover:text-blue-700 p-1"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => confirmDelete(prestation)}
                          className="text-red-600 hover:text-red-700 p-1"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col lg:flex-row items-center justify-between mt-6 lg:mt-8 pt-6 border-t border-gray-200 space-y-4 lg:space-y-0">
              <div className="text-sm text-gray-600">
                Page {currentPage} sur {totalPages} - {prestations.length} prestations au total
              </div>
              
              <div className="flex items-center space-x-2">
                {/* Bouton précédent */}
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg border-2 transition-all duration-200 ${
                    currentPage === 1 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-300' 
                      : 'bg-white text-gray-700 hover:bg-blue-50 hover:border-blue-300 border-gray-300 hover:scale-105'
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Numéros de page */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => paginate(page)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      currentPage === page
                        ? 'bg-blue-600 text-white shadow-lg scale-105'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 hover:scale-105'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                {/* Bouton suivant */}
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg border-2 transition-all duration-200 ${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-300'
                      : 'bg-white text-gray-700 hover:bg-blue-50 hover:border-blue-300 border-gray-300 hover:scale-105'
                  }`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Suivi des prestations avec tableau
  const renderSuiviPrestations = () => {
    // Filtrer les prestations
    const filteredPrestations = prestations.filter(prestation =>
      (filterStatus === 'all' || prestation.statut === filterStatus) &&
      (prestation.client_nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
       prestation.nom_du_dossier.toLowerCase().includes(searchTerm.toLowerCase()) ||
       (prestation.code_prestation && prestation.numero.toLowerCase().includes(searchTerm.toLowerCase())))
    );

    // Calcul de la pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentPrestations = filteredPrestations.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredPrestations.length / itemsPerPage);

    return (
      <div className="space-y-6">
        {/* Header avec boutons d'action */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold">Suivi des Prestations</h1>
                <p className="text-orange-100">Gérez et suivez l'ensemble de vos prestations</p>
              </div>
            </div>
            
            {/* Bouton pour afficher le template vierge */}
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <button 
                onClick={() => {
                  setSelectedPrestation(null);
                  setShowPrestationTemplate(true);
                }}
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 font-semibold shadow-lg transition-all duration-200 hover:scale-105 border border-white/30"
              >
                <FileText className="w-5 h-5" />
                <span>Fiche Vierge</span>
              </button>
               <button 
              onClick={() => {
                setPrestationToEdit(null);
                setIsEditMode(false);
                setShowPrestationForm(true);
              }}
              className="flex items-center space-x-2 px-6 py-3 bg-white text-orange-600 rounded-xl hover:bg-gray-100 font-semibold shadow-lg transition-all duration-200 hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              <span>Nouvelle Prestation</span>
            </button>
            </div>
          </div>
        </div>

        {/* Statistiques rapides */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 lg:gap-4">
            {[
              { key: 'all', label: 'Total', icon: FileText, color: 'gray', count: prestationStats.total },
              { key: 'nouvelles', label: 'Nouvelles', icon: Plus, color: 'blue', count: prestations.filter(p => p.statut === 'nouvelles').length },
              { key: 'validees', label: 'Validées', icon: CheckCircle, color: 'green', count: prestations.filter(p => p.statut === 'validees').length },
              { key: 'receptionnees', label: 'Réceptionnées', icon: Package, color: 'purple', count: prestations.filter(p => p.statut === 'receptionnees').length },
              { key: 'renvoyees', label: 'Renvoyées', icon: RotateCcw, color: 'yellow', count: prestations.filter(p => p.statut === 'renvoyees').length },
              { key: 'traitees', label: 'Traitées', icon: Zap, color: 'teal', count: prestations.filter(p => p.statut === 'traitees').length },
              { key: 'refusees', label: 'Refusées', icon: XCircle, color: 'red', count: prestations.filter(p => p.statut === 'refusees').length }
            ].map((item) => (
              <div
                key={item.key}
                onClick={() => {
                  setFilterStatus(item.key);
                  setCurrentPage(1);
                }}
                className={`rounded-xl p-3 lg:p-4 border-2 cursor-pointer transition-all duration-200 ${
                  filterStatus === item.key 
                    ? `bg-${item.color}-100 border-${item.color}-400 shadow-md scale-105` 
                    : `bg-${item.color}-50 border-${item.color}-200 hover:bg-${item.color}-100 hover:scale-102`
                }`}
              >
                <div className="text-center">
                  <item.icon className={`w-5 h-5 lg:w-6 lg:h-6 mx-auto mb-2 text-${item.color}-600`} />
                  <p className="text-lg lg:text-2xl font-bold text-gray-800">{item.count}</p>
                  <p className={`text-xs lg:text-sm text-${item.color}-600 font-medium`}>{item.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-4 flex-1">
              <div className="flex-1 w-full relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher par client, numéro ou code prestation..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                />
              </div>
              {/* <select
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full lg:w-48 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
              >
                <option value="all">Tous les statuts</option>
                <option value="nouvelles">Nouvelles</option>
                <option value="validees">Validées</option>
                <option value="receptionnees">Réceptionnées</option>
                <option value='renvoyees'>Renvoyées</option>
                <option value="traitees">Traitées</option>
                <option value="refusees">Refusées</option>
              </select> */}
            </div>

            {/* Bouton de changement de vue */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                  viewMode === 'grid' 
                    ? 'bg-orange-500 text-white border-orange-500' 
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
                title="Vue Grille"
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                  viewMode === 'list' 
                    ? 'bg-orange-500 text-white border-orange-500' 
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
                title="Vue Liste"
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Informations de pagination */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mt-4 space-y-2 lg:space-y-0">
            <div className="text-sm text-gray-600">
              Affichage de {indexOfFirstItem + 1} à {Math.min(indexOfLastItem, filteredPrestations.length)} sur {filteredPrestations.length} prestations
            </div>
            {filteredPrestations.length > itemsPerPage && (
              <div className="text-sm text-gray-600">
                Page {currentPage} sur {totalPages}
              </div>
            )}
          </div>
        </div>

        {/* Grille ou Liste des prestations */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          {currentPrestations.length > 0 ? (
            <>
              {viewMode === 'grid' ? (
                // Vue Grille
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {currentPrestations.map((prestation) => (
                    <PrestationCard 
                      key={prestation.id} 
                      prestation={prestation}
                      onView={() => {
                        setSelectedPrestation(prestation);
                        setShowPrestationTemplate(true);
                      }}
                      onEdit={() => handleEditPrestation(prestation)}
                      onDelete={() => confirmDelete(prestation)}
                      onValidate={() => {
                        setPrestationToValidate(prestation);
                        setShowValidationModal(true);
                      }}
                      getPrestationStatusColor={getPrestationStatusColor}
                      getPrestationStatusLabel={getPrestationStatusLabel}
                    />
                  ))}
                </div>
              ) : (
                // Vue Liste
                <div className="space-y-4">
                  {currentPrestations.map((prestation) => (
                    <PrestationListItem 
                      key={prestation.id} 
                      prestation={prestation}
                      onView={() => {
                        setSelectedPrestation(prestation);
                        setShowPrestationTemplate(true);
                      }}
                      onEdit={() => handleEditPrestation(prestation)}
                      onDelete={() => confirmDelete(prestation)}
                      onValidate={() => {
                        setPrestationToValidate(prestation);
                        setShowValidationModal(true);
                      }}
                      getPrestationStatusColor={getPrestationStatusColor}
                      getPrestationStatusLabel={getPrestationStatusLabel}
                    />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex flex-col lg:flex-row items-center justify-between mt-8 pt-6 border-t border-gray-200 space-y-4 lg:space-y-0">
                  <div className="text-sm text-gray-600">
                    {filteredPrestations.length} prestation(s) trouvée(s)
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {/* Bouton précédent */}
                    <button
                      onClick={goToPreviousPage}
                      disabled={currentPage === 1}
                      className={`p-2 rounded-lg border-2 transition-all duration-200 ${
                        currentPage === 1 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-300' 
                          : 'bg-white text-gray-700 hover:bg-orange-50 hover:border-orange-300 border-gray-300 hover:scale-105'
                      }`}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    {/* Numéros de page */}
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNumber;
                        if (totalPages <= 5) {
                          pageNumber = i + 1;
                        } else if (currentPage <= 3) {
                          pageNumber = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNumber = totalPages - 4 + i;
                        } else {
                          pageNumber = currentPage - 2 + i;
                        }

                        return (
                          <button
                            key={pageNumber}
                            onClick={() => paginate(pageNumber)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                              currentPage === pageNumber
                                ? 'bg-orange-600 text-white shadow-lg scale-105'
                                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 hover:scale-105'
                            }`}
                          >
                            {pageNumber}
                          </button>
                        );
                      })}
                    </div>

                    {/* Bouton suivant */}
                    <button
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                      className={`p-2 rounded-lg border-2 transition-all duration-200 ${
                        currentPage === totalPages
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-300'
                          : 'bg-white text-gray-700 hover:bg-orange-50 hover:border-orange-300 border-gray-300 hover:scale-105'
                      }`}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            // État vide
            <div className="text-center py-16">
              <FileText className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-500 mb-2">Aucune prestation trouvée</h3>
              <p className="text-gray-400 mb-6">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Aucune prestation ne correspond à vos critères de recherche.' 
                  : 'Commencez par créer votre première prestation.'}
              </p>
              {!searchTerm && filterStatus === 'all' && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={() => {
                      setSelectedPrestation(null);
                      setShowPrestationTemplate(true);
                    }}
                    className="inline-flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold shadow-lg transition-all duration-200 hover:scale-105"
                  >
                    <FileText className="w-5 h-5" />
                    <span>Fiche Vierge</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modals */}
        {showPrestationTemplate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 no-print">
            <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[95vh] flex flex-col">
              <div className="flex-shrink-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-2xl p-6 text-white no-print sticky top-0 z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Eye className="w-8 h-8" />
                    <h2 className="text-2xl font-bold">
                      {selectedPrestation ? 'Détails de la Prestation' : 'Fiche Prestation Vierge'}
                    </h2>
                  </div>
                  <div className="flex items-center space-x-3">
                    {selectedPrestation && (
                      <button
                        onClick={() => {
                          console.log('Transfer prestation:', selectedPrestation.id);
                        }}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Send className="w-4 h-4" />
                        <span>Transférer</span>
                      </button>
                    )}
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
              <div className="flex-1 overflow-y-auto">
                <PrestationTemplate
                  prestationData={selectedPrestation}
                  onDownload={() => console.log('Download')}
                  onPrint={() => window.print()}
                   onClose={() => {
              setShowPrestationTemplate(false);
            }}
                />
              </div>
            </div>
          </div>
        )}

        {showPrestationForm && (
          <PrestationForm
            onClose={() => {
              setShowPrestationForm(false);
              setPrestationToEdit(null);
              setIsEditMode(false);
            }}
            onSuccess={handlePrestationSuccess}
            editData={prestationToEdit}
          />
        )}

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

        {/* Modal de confirmation de suppression */}
        {showDeleteModal && prestationToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
              <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-t-2xl p-6 text-white text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Confirmer la suppression</h2>
                <p className="text-red-100">Êtes-vous sûr de vouloir supprimer cette prestation ?</p>
              </div>
              <div className="p-6">
                <div className="bg-red-50 rounded-xl p-4 mb-6">
                  <div className="text-center">
                    <div className="text-sm text-red-600 mb-2">Prestation à supprimer</div>
                    <div className="text-lg font-bold text-red-800">{prestationToDelete.nom_du_dossier}</div>
                    <div className="text-sm text-red-700">{prestationToDelete.numero}</div>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleDeletePrestation(prestationToDelete)}
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200 flex items-center justify-center space-x-2 font-semibold disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Trash2 className="w-5 h-5" />
                    )}
                    <span>{loading ? 'Suppression...' : 'Supprimer'}</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setPrestationToDelete(null);
                    }}
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-200 font-semibold"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

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

  // Fonction de rendu principal
  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
      case 'overview':
        return renderOfficeOverview();
      case 'accueil-standard':
        return renderPrestationsDashboard();
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
      
      {/* Prestation Form Modal */}
      {showPrestationForm && (
        <PrestationForm
          onClose={() => {
            setShowPrestationForm(false);
            setPrestationToEdit(null);
            setIsEditMode(false);
          }}
          onSuccess={handlePrestationSuccess}
          editData={prestationToEdit}
        />
      )}

      {/* Success Modal */}
      {showSuccessModal && createdPrestation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl">
            {/* Success Header */}
            <div className={`rounded-t-3xl p-8 text-white text-center ${
              isEditMode 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600' 
                : 'bg-gradient-to-r from-green-600 to-emerald-600'
            }`}>
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-2">
                {isEditMode ? 'Prestation Modifiée avec Succès!' : 'Prestation Créée avec Succès!'}
              </h2>
              <p className="text-blue-100 text-lg">
                {isEditMode 
                  ? 'Les modifications ont été enregistrées avec succès' 
                  : 'Votre demande a été enregistrée et est prête à être traitée'
                }
              </p>
            </div>

            {/* Success Content */}
            <div className="p-8">
              <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                <div className="text-center mb-4">
                  <div className="text-sm text-gray-600 mb-2">Code de la Prestation</div>
                  <div className="text-3xl font-bold text-blue-600 font-mono">
                    {createdPrestation.code_prestation}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600 mb-1">Nom Du Dossier</div>
                    <div className="font-semibold text-gray-900">{createdPrestation.nom_du_dossier}</div>
                  </div>
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
                  {isEditMode && (
                    <div className="col-span-2">
                      <div className="text-gray-600 mb-1">Statut</div>
                      <div className="font-semibold text-gray-900 capitalize">{createdPrestation.statut}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
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
                    setIsEditMode(false);
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

      {/* Prestation Template Modal */}
      {showPrestationTemplate && (
        <PrestationTemplate
          prestationData={selectedPrestation}
          onClose={() => {
            setShowPrestationTemplate(false);
            setSelectedPrestation(null);
          }}
          onDownload={() => console.log('Download PDF')}
          onPrint={() => window.print()}
        />
      )}

      {/* Visite Form Modal */}
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