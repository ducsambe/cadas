import React, { useState } from 'react';
import {
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  X,
  ArrowLeft,
  ArrowRight,
  ListTodo,
  FolderOpen,
  Check,
  XCircle,
  Package,
  MapPin,
  Phone,
  Calendar,
  User,
  Save
} from 'lucide-react';
import { useGFCDossiers } from '../../hooks/useGFCDossiers';
import PrestationTemplate from '../PrestationTemplate';

interface GFCDocumentTrackingProps {
  onCreateNew?: () => void;
}

interface PhaseTodo {
  id: string;
  label: string;
  completed: boolean;
}

const GFCDocumentTracking: React.FC<GFCDocumentTrackingProps> = ({ onCreateNew }) => {
  const { dossiers, loading, updateDossier, createDossier } = useGFCDossiers();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPhase, setFilterPhase] = useState('all');
  const [selectedDossier, setSelectedDossier] = useState<any>(null);
  const [showTemplate, setShowTemplate] = useState(false);
  const [showPhaseModal, setShowPhaseModal] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<string>('');
  const [editingDossier, setEditingDossier] = useState<any>(null);
  const [selectedPhaseView, setSelectedPhaseView] = useState<string>('all');
  const [todos, setTodos] = useState<Record<string, PhaseTodo[]>>({});
  const [showRefuseModal, setShowRefuseModal] = useState(false);
  const [refuseReason, setRefuseReason] = useState('');
  const [dossierToRefuse, setDossierToRefuse] = useState<any>(null);
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);

  const phases = [
    { id: 'nouveau', label: 'À Traiter', field: 'nouveau', dateField: 'created_at', color: 'red', nextPhase: 'phase_1' },
    { id: 'phase_1', label: 'Phase 1', field: 'phase_1', dateField: 'phase_1_date', color: 'green', prevPhase: 'nouveau', nextPhase: 'phase_2' },
    { id: 'phase_2', label: 'Phase 2', field: 'phase_2', dateField: 'phase_2_date', color: 'purple', prevPhase: 'phase_1', nextPhase: 'phase_3' },
    { id: 'phase_3', label: 'Phase 3', field: 'phase_3', dateField: 'phase_3_date', color: 'amber', prevPhase: 'phase_2', nextPhase: 'phase_4' },
    { id: 'phase_4', label: 'Phase 4', field: 'phase_4', dateField: 'phase_4_date', color: 'teal', prevPhase: 'phase_3', nextPhase: 'phase_5' },
    { id: 'phase_5', label: 'Phase 5', field: 'phase_5', dateField: 'phase_5_date', color: 'indigo', prevPhase: 'phase_4', nextPhase: 'completed' }
  ];

  // Todo lists initiales pour chaque phase
  const initialPhaseTodos: Record<string, PhaseTodo[]> = {
    nouveau: [
      { id: 'n_1', label: 'Vérifier la complétude du dossier', completed: false },
      { id: 'n_2', label: 'Analyser les documents reçus', completed: false },
      { id: 'n_3', label: 'Décider de la réception ou du refus', completed: false }
    ],
    phase_1: [
      { id: 'p1_1', label: 'Analyse initiale des documents', completed: false },
      { id: 'p1_2', label: 'Vérification des pièces manquantes', completed: false },
      { id: 'p1_3', label: 'Contact client pour compléments', completed: false }
    ],
    phase_2: [
      { id: 'p2_1', label: 'Traitement technique', completed: false },
      { id: 'p2_2', label: 'Validation des données', completed: false },
      { id: 'p2_3', label: 'Contrôle qualité interne', completed: false }
    ],
    phase_3: [
      { id: 'p3_1', label: 'Expertise approfondie', completed: false },
      { id: 'p3_2', label: 'Rédaction du rapport', completed: false },
      { id: 'p3_3', label: 'Vérification juridique', completed: false }
    ],
    phase_4: [
      { id: 'p4_1', label: 'Finalisation du dossier', completed: false },
      { id: 'p4_2', label: 'Appro validation hiérarchique', completed: false },
      { id: 'p4_3', label: 'Préparation envoi client', completed: false }
    ],
    phase_5: [
      { id: 'p5_1', label: 'Envoi au client', completed: false },
      { id: 'p5_2', label: 'Archivage du dossier', completed: false },
      { id: 'p5_3', label: 'Clôture administrative', completed: false }
    ]
  };

  // Initialiser les todos
  React.useEffect(() => {
    if (dossiers.length > 0 && Object.keys(todos).length === 0) {
      const initialTodos: Record<string, PhaseTodo[]> = {};
      phases.forEach(phase => {
        initialTodos[phase.id] = [...initialPhaseTodos[phase.id]];
      });
      setTodos(initialTodos);
    }
  }, [dossiers]);

  const generateCodePrestation = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    
    // Pattern: GFC-YYYY-MMXXXX where XXXX is the sequential number
    const currentMonthPattern = `GFC-${year}-${month}`;
    
    // Find all existing codes for this month
    const existingCodes = dossiers
      .filter(d => d.code_prestation && d.code_prestation.startsWith(currentMonthPattern))
      .map(d => {
        const code = d.code_prestation;
        if (!code) return 0;
        
        // Extract the sequential number (last 4 digits)
        // Remove the prefix to get just the number part
        const numberPart = code.replace(currentMonthPattern, '');
        
        // Parse the number, handle cases where it might not be exactly 4 digits
        const sequentialNumber = parseInt(numberPart);
        
        return isNaN(sequentialNumber) ? 0 : sequentialNumber;
      })
      .filter(num => num > 0 && num < 10000); // Ensure it's a valid 4-digit number
    
    console.log('Existing codes for month:', existingCodes);
    
    // Find the highest existing number
    const lastNumber = existingCodes.length > 0 ? Math.max(...existingCodes) : 0;
    console.log('Last number found:', lastNumber);
    
    // Generate next number (4 digits, padded with zeros)
    const nextNumber = (lastNumber + 1).toString().padStart(4, '0');
    const newCode = `${currentMonthPattern}${nextNumber}`;
    
    console.log('Generated new code:', newCode);
    
    return newCode;
  };

  // Get trackable dossiers (receptionnees2 and phase-based dossiers)
  const getTrackableDossiers = () => {
    return dossiers.filter(dossier => 
      dossier.statut === 'receptionnees2' || // Dossiers to validate/refuse
      dossier.statut === 'validees' ||       // Validated dossiers
      dossier.statut === 'renvoyees' ||      // Refused dossiers  
      dossier.statut === 'traitees' ||       // Treated dossiers
      // Add any phase-based dossiers
      phases.some(phase => dossier[phase.field] === true)
    );
  };

  const getCurrentPhase = (dossier: any) => {
    // Handle receptionnees2 status - these are the ones that should show in tracking as "nouveau"
    if (dossier.statut === 'receptionnees2') {
      return 'nouveau';
    }
    
    for (let i = phases.length - 1; i >= 0; i--) {
      if (dossier[phases[i].field] === true) {
        return phases[i].id;
      }
    }
    return 'nouveau';
  };

  const getProgressionColor = (percentage: number) => {
    if (percentage === 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-amber-500';
    if (percentage >= 25) return 'bg-orange-500';
    return 'bg-gray-400';
  };

  const getDossiersInPhase = (phaseId: string) => {
    const trackableDossiers = getTrackableDossiers();
    
    if (phaseId === 'all') return trackableDossiers;
    
    // Handle "nouveau" phase which includes receptionnees2 status
    if (phaseId === 'nouveau') {
      return trackableDossiers.filter(dossier => 
        dossier.statut === 'receptionnees2' || getCurrentPhase(dossier) === 'nouveau'
      );
    }
    
    return trackableDossiers.filter(dossier => getCurrentPhase(dossier) === phaseId);
  };

  const getPhaseCompletionCount = (phaseId: string) => {
    return getDossiersInPhase(phaseId).length;
  };

  const openPhaseModal = (dossier: any, phase: string) => {
    setEditingDossier(dossier);
    setCurrentPhase(phase);
    
    if (!todos[phase]) {
      setTodos(prev => ({
        ...prev,
        [phase]: [...initialPhaseTodos[phase]]
      }));
    }
    
    setShowPhaseModal(true);
  };

  const toggleTodo = (phase: string, todoId: string) => {
    setTodos(prev => ({
      ...prev,
      [phase]: prev[phase].map(todo => 
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
      )
    }));
  };

  const allTodosCompleted = (phase: string) => {
    return todos[phase]?.every(todo => todo.completed) || false;
  };

  const handleRefuserDossier = async () => {
    if (!dossierToRefuse || !refuseReason.trim()) return;

    const updates: any = {
      statut: 'renvoyees',
      raison_refus: refuseReason,
      date_refus: new Date().toISOString()
    };

    try {
      await updateDossier(dossierToRefuse.id, updates);
      setShowRefuseModal(false);
      setDossierToRefuse(null);
      setRefuseReason('');
    } catch (error) {
      console.error('Error refusing dossier:', error);
    }
  };

  const handleReceptionnerDossier = async (dossier: any) => {
    if (!dossier) return;

    setIsGeneratingCode(true);
    
    try {
      const newCode = generateCodePrestation();
      const updates: any = {
        code_prestation: newCode,
        statut: 'validees',
        date_validation: new Date().toISOString(),
        phase_1: true,
        phase_1_date: new Date().toISOString()
      };

      await updateDossier(dossier.id, updates);
    } catch (error) {
      console.error('Error receiving dossier:', error);
    } finally {
      setIsGeneratingCode(false);
    }
  };

  const openRefuseModal = (dossier: any) => {
    setDossierToRefuse(dossier);
    setRefuseReason('');
    setShowRefuseModal(true);
  };

  const handleTransmitPhase = async (fromPhase: string, toPhase: string) => {
    if (!editingDossier) return;

    const fromPhaseData = phases.find(p => p.id === fromPhase);
    const toPhaseData = phases.find(p => p.id === toPhase);

    if (!fromPhaseData || !toPhaseData) return;

    const updates: any = {
      [fromPhaseData.field]: false,
      [toPhaseData.field]: true,
      [toPhaseData.dateField]: new Date().toISOString()
    };

    try {
      await updateDossier(editingDossier.id, updates);
      setShowPhaseModal(false);
      setEditingDossier(null);
    } catch (error) {
      console.error('Error transmitting phase:', error);
    }
  };

  const handleReturnToPreviousPhase = async (currentPhase: string) => {
    if (!editingDossier) return;

    const currentPhaseData = phases.find(p => p.id === currentPhase);
    const prevPhaseData = phases.find(p => p.id === currentPhaseData?.prevPhase);

    if (!currentPhaseData || !prevPhaseData) return;

    const updates: any = {
      [currentPhaseData.field]: false,
      [prevPhaseData.field]: true
    };

    try {
      await updateDossier(editingDossier.id, updates);
      setShowPhaseModal(false);
      setEditingDossier(null);
    } catch (error) {
      console.error('Error returning to previous phase:', error);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Non défini';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const filteredDossiers = getDossiersInPhase(selectedPhaseView).filter(dossier => {
    const matchesSearch =
      dossier.code_prestation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dossier.client_nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dossier.client_telephone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dossier.client_adresse?.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterPhase === 'all') return matchesSearch;
    if (filterPhase === 'completed') return matchesSearch && dossier.progression_percentage === 100;
    if (filterPhase === 'in_progress') return matchesSearch && dossier.progression_percentage > 0 && dossier.progression_percentage < 100;
    if (filterPhase === 'not_started') return matchesSearch && (dossier.progression_percentage === 0 || !dossier.progression_percentage);

    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Suivi des Documents GFC</h1>
            <p className="text-blue-100">Gestion des réceptions et phases de traitement</p>
          </div>
          {onCreateNew && (
            <button
              onClick={onCreateNew}
              className="px-6 py-3 bg-white text-blue-600 rounded-xl hover:bg-gray-100 flex items-center gap-2 font-semibold shadow-lg transition-all duration-200"
            >
              <Plus className="w-5 h-5" />
              Nouveau Dossier
            </button>
          )}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Aperçu des Dossiers</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {/* Total Dossiers */}
          <button
            onClick={() => setSelectedPhaseView('all')}
            className={`rounded-xl p-4 text-center shadow-lg transition-all duration-200 transform hover:scale-105 ${
              selectedPhaseView === 'all'
                ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white ring-4 ring-blue-200'
                : 'bg-blue-50 border-2 border-blue-200 text-blue-700 hover:bg-blue-100'
            }`}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
              selectedPhaseView === 'all' ? 'bg-white/20' : 'bg-blue-100'
            }`}>
              <FolderOpen className={`w-6 h-6 ${selectedPhaseView === 'all' ? 'text-white' : 'text-blue-600'}`} />
            </div>
            <div className={`text-2xl font-bold ${selectedPhaseView === 'all' ? 'text-white' : 'text-blue-700'}`}>
              {getTrackableDossiers().length}
            </div>
            <div className={`text-sm font-medium ${selectedPhaseView === 'all' ? 'text-blue-100' : 'text-blue-600'}`}>
              Total Dossiers
            </div>
          </button>

          {/* Nouveau Phase (includes receptionnees2) */}
          <button
            onClick={() => setSelectedPhaseView('nouveau')}
            className={`rounded-xl p-4 text-center shadow-lg transition-all duration-200 transform hover:scale-105 ${
              selectedPhaseView === 'nouveau'
                ? 'bg-gradient-to-br from-red-500 to-red-600 text-white ring-4 ring-red-200'
                : 'bg-red-50 border-2 border-red-200 text-red-700 hover:bg-red-100'
            }`}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
              selectedPhaseView === 'nouveau' ? 'bg-white/20' : 'bg-red-100'
            }`}>
              <Clock className={`w-6 h-6 ${selectedPhaseView === 'nouveau' ? 'text-white' : 'text-red-600'}`} />
            </div>
            <div className={`text-2xl font-bold ${selectedPhaseView === 'nouveau' ? 'text-white' : 'text-red-700'}`}>
              {getPhaseCompletionCount('nouveau')}
            </div>
            <div className={`text-sm font-medium ${selectedPhaseView === 'nouveau' ? 'text-red-100' : 'text-red-600'}`}>
              À Traiter
            </div>
          </button>

          {/* Rest of the phases */}
          {phases.filter(phase => phase.id !== 'nouveau').map((phase) => {
            const phaseCount = getPhaseCompletionCount(phase.id);
            const isSelected = selectedPhaseView === phase.id;
            
            return (
              <button
                key={phase.id}
                onClick={() => setSelectedPhaseView(phase.id)}
                className={`rounded-xl p-4 text-center shadow-lg transition-all duration-200 transform hover:scale-105 ${
                  isSelected
                    ? `bg-gradient-to-br from-${phase.color}-500 to-${phase.color}-600 text-white ring-4 ring-${phase.color}-200`
                    : `bg-${phase.color}-50 border-2 border-${phase.color}-200 text-${phase.color}-700 hover:bg-${phase.color}-100`
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                  isSelected ? 'bg-white/20' : `bg-${phase.color}-100`
                }`}>
                  <CheckCircle className={`w-6 h-6 ${isSelected ? 'text-white' : `text-${phase.color}-600`}`} />
                </div>
                <div className={`text-2xl font-bold ${isSelected ? 'text-white' : `text-${phase.color}-700`}`}>
                  {phaseCount}
                </div>
                <div className={`text-sm font-medium ${isSelected ? 'text-blue-100' : `text-${phase.color}-600`}`}>
                  {phase.label}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex-1 w-full relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par code, client, téléphone ou adresse..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex gap-4">
            <select
              value={filterPhase}
              onChange={(e) => setFilterPhase(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="not_started">Non démarrés</option>
              <option value="in_progress">En cours</option>
              <option value="completed">Complétés</option>
            </select>
            <button
              onClick={() => {
                setSelectedPhaseView('all');
                setSearchTerm('');
                setFilterPhase('all');
              }}
              className="px-4 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 font-semibold transition-all duration-200"
            >
              Réinitialiser
            </button>
          </div>
        </div>
        
        {/* Phase sélectionnée */}
        {selectedPhaseView !== 'all' && (
          <div className="mt-4 p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full bg-${phases.find(p => p.id === selectedPhaseView)?.color}-500`}></div>
                <span className="font-semibold text-blue-800">
                  Affichage des dossiers en {phases.find(p => p.id === selectedPhaseView)?.label}
                </span>
              </div>
              <span className="text-blue-600 font-bold">
                {filteredDossiers.length} dossier(s)
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Dossiers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredDossiers.map((dossier) => {
          const progression = dossier.progression_percentage || 0;
          const currentDossierPhase = getCurrentPhase(dossier);
          const currentPhaseData = phases.find(p => p.id === currentDossierPhase);
          const isNouveau = currentDossierPhase === 'nouveau';
          const isReceptionnees2 = dossier.statut === 'receptionnees2';

          return (
            <div key={dossier.id} className="bg-white rounded-xl shadow-lg border-2 border-gray-100 hover:shadow-xl transition-all duration-300 hover:border-blue-300 group">
              {/* Header avec badge de phase */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-xl p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      isNouveau ? 'bg-red-500' : `bg-${currentPhaseData?.color}-500`
                    }`}></div>
                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      {isReceptionnees2 ? 'À Valider' : (isNouveau ? 'Nouveau' : currentPhaseData?.label)}
                    </span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold text-white ${
                    progression === 100 ? 'bg-green-500' :
                    progression >= 50 ? 'bg-blue-500' :
                    progression > 0 ? 'bg-amber-500' : 'bg-gray-400'
                  }`}>
                    {progression}%
                  </span>
                </div>
                
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-1 rounded-lg font-mono font-bold text-sm ${
                    dossier.code_prestation 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {dossier.code_prestation || 'En attente de code'}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 truncate">{dossier.client_nom}</h3>
                <p className="text-sm text-gray-600 truncate">{dossier.procedure_choisie}</p>
              </div>

              {/* Informations détaillées */}
              <div className="p-4 space-y-3">
                {/* Informations client */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-600">Client:</span>
                    <span className="font-medium text-gray-900 truncate">{dossier.client_nom}</span>
                  </div>
                  
                  {dossier.client_phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-600">Tél:</span>
                      <span className="font-medium text-gray-900">{dossier.client_phone}</span>
                    </div>
                  )}
                  
                  {dossier.client_adresse && (
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="text-gray-600">Adresse:</span>
                        <span className="font-medium text-gray-900 block truncate">{dossier.client_adresse}</span>
                      </div>
                    </div>
                  )}
                  
                  {dossier.created_at && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-600">Créé le:</span>
                      <span className="font-medium text-gray-900">{formatDate(dossier.created_at)}</span>
                    </div>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="pt-2">
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                    <span>Progression globale</span>
                    <span>{progression}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${getProgressionColor(progression)}`}
                      style={{ width: `${progression}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                {/* Boutons pour dossiers receptionnees2 (À Valider) */}
                {isReceptionnees2 && (
                  <div className="flex gap-2 mb-3">
                    <button
                      onClick={() => openRefuseModal(dossier)}
                      className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2 text-sm font-semibold transition-all duration-200"
                    >
                      <XCircle className="w-4 h-4" />
                      Refuser
                    </button>
                    <button
                      onClick={() => handleReceptionnerDossier(dossier)}
                      disabled={isGeneratingCode}
                      className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isGeneratingCode ? (
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                      ) : (
                        <Package className="w-4 h-4" />
                      )}
                      {isGeneratingCode ? 'Génération...' : 'Valide'}
                    </button>
                  </div>
                )}

                {/* Boutons standard */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        setSelectedDossier(dossier);
                        setShowTemplate(true);
                      }}
                      className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center transition-all duration-200 group/btn"
                      title="Voir les détails"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedDossier(dossier);
                        // Ouvrir modal modification
                      }}
                      className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center transition-all duration-200 group/btn"
                      title="Modifier le dossier"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {!isReceptionnees2 && currentPhaseData && (
                    <button
                      onClick={() => openPhaseModal(dossier, currentDossierPhase)}
                      className={`px-3 py-2 bg-${currentPhaseData?.color}-600 text-white rounded-lg hover:bg-${currentPhaseData?.color}-700 flex items-center justify-center gap-2 text-sm font-semibold transition-all duration-200`}
                    >
                      <ListTodo className="w-4 h-4" />
                      Phase
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filteredDossiers.length === 0 && (
          <div className="col-span-full bg-white rounded-xl shadow-lg p-12 text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Aucun dossier trouvé</h3>
            <p className="text-gray-600">
              {selectedPhaseView !== 'all' 
                ? `Aucun dossier dans la phase "${phases.find(p => p.id === selectedPhaseView)?.label}"`
                : 'Essayez de modifier vos filtres de recherche'
              }
            </p>
          </div>
        )}
      </div>

      {/* Modal de refus */}
      {showRefuseModal && dossierToRefuse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
            <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-t-2xl p-6 text-white">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <XCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Refuser le Dossier</h3>
                  <p className="text-red-100">Veuillez indiquer le motif du refus</p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="bg-red-50 rounded-xl p-4 mb-4">
                <div className="text-center">
                  <div className="text-sm text-red-600 mb-1">Dossier à refuser</div>
                  <div className="text-lg font-bold text-red-800">{dossierToRefuse.client_nom}</div>
                  <div className="text-sm text-red-700">{dossierToRefuse.code_prestation || 'Sans code'}</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Motif du refus *
                  </label>
                  <textarea
                    value={refuseReason}
                    onChange={(e) => setRefuseReason(e.target.value)}
                    placeholder="Décrivez la raison du refus..."
                    rows={4}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                  />
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={handleRefuserDossier}
                    disabled={!refuseReason.trim()}
                    className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 flex items-center justify-center gap-2 font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-5 h-5" />
                    Confirmer le refus
                  </button>
                  <button
                    onClick={() => {
                      setShowRefuseModal(false);
                      setDossierToRefuse(null);
                      setRefuseReason('');
                    }}
                    className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 font-semibold transition-all duration-200"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Prestation Template Modal */}
      {showTemplate && selectedDossier && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="text-xl font-bold">Détails du Dossier</h3>
              <button
                onClick={() => {
                  setShowTemplate(false);
                  setSelectedDossier(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(95vh-80px)]">
              <PrestationTemplate
                prestationData={selectedDossier}
                onBack={() => {
                  setShowTemplate(false);
                  setSelectedDossier(null);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Phase Modal */}
      {showPhaseModal && editingDossier && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[95vh] overflow-hidden">
            <div className="p-6 border-b flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <div>
                <h3 className="text-xl font-bold">
                  {phases.find(p => p.id === currentPhase)?.label} - {editingDossier.code_prestation}
                </h3>
                <p className="text-blue-100">{editingDossier.client_nom}</p>
              </div>
              <button
                onClick={() => {
                  setShowPhaseModal(false);
                  setEditingDossier(null);
                }}
                className="p-2 hover:bg-white/10 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(95vh-200px)]">
              {/* Todo List */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-4">Liste des tâches</h4>
                <div className="space-y-3">
                  {todos[currentPhase]?.map((todo) => (
                    <div key={todo.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <button
                        onClick={() => toggleTodo(currentPhase, todo.id)}
                        className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                          todo.completed
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'bg-white border-gray-300 text-transparent hover:border-green-500'
                        }`}
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <span className={`flex-1 ${todo.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                        {todo.label}
                      </span>
                    </div>
                  ))}
                </div>
                
                {/* Progression des todos */}
                {todos[currentPhase] && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-blue-700 font-medium">
                        Progression des tâches
                      </span>
                      <span className="text-blue-600 font-bold">
                        {todos[currentPhase].filter(t => t.completed).length} / {todos[currentPhase].length}
                      </span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                      <div
                        className="h-2 rounded-full bg-blue-500 transition-all duration-500"
                        style={{ 
                          width: `${(todos[currentPhase].filter(t => t.completed).length / todos[currentPhase].length) * 100}%` 
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3">
                {/* Bouton phase précédente */}
                {phases.find(p => p.id === currentPhase)?.prevPhase && (
                  <button
                    onClick={() => handleReturnToPreviousPhase(currentPhase)}
                    className="w-full px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center justify-center gap-2 font-semibold transition-all duration-200"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Retour à {phases.find(p => p.id === phases.find(p => p.id === currentPhase)?.prevPhase)?.label}
                  </button>
                )}

                {/* Bouton phase suivante */}
                {phases.find(p => p.id === currentPhase)?.nextPhase && phases.find(p => p.id === currentPhase)?.nextPhase !== 'completed' && (
                  <button
                    onClick={() => handleTransmitPhase(currentPhase, phases.find(p => p.id === currentPhase)?.nextPhase!)}
                    disabled={!allTodosCompleted(currentPhase)}
                    className={`w-full px-4 py-3 flex items-center justify-center gap-2 font-semibold transition-all duration-200 rounded-lg ${
                      allTodosCompleted(currentPhase)
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    }`}
                  >
                    <ArrowRight className="w-5 h-5" />
                    Transmettre à {phases.find(p => p.id === phases.find(p => p.id === currentPhase)?.nextPhase)?.label}
                    {!allTodosCompleted(currentPhase) && (
                      <span className="text-xs">(Tâches incomplètes)</span>
                    )}
                  </button>
                )}

                {/* Bouton finalisation */}
                {phases.find(p => p.id === currentPhase)?.nextPhase === 'completed' && (
                  <button
                    onClick={() => handleTransmitPhase(currentPhase, 'phase_5')}
                    disabled={!allTodosCompleted(currentPhase)}
                    className={`w-full px-4 py-3 flex items-center justify-center gap-2 font-semibold transition-all duration-200 rounded-lg ${
                      allTodosCompleted(currentPhase)
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    }`}
                  >
                    <CheckCircle className="w-5 h-5" />
                    Finaliser le dossier
                    {!allTodosCompleted(currentPhase) && (
                      <span className="text-xs">(Tâches incomplètes)</span>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GFCDocumentTracking;