import React, { useState, useEffect } from 'react';
import {
  MapPin,
  LayoutDashboard,
  FolderOpen,
  UserCircle,
  Search,
  Mail,
  Package,
  Archive,
  BarChart3,
  AlertTriangle,
  Clock,
  CheckCircle,
  FileText,
  TrendingUp,
  Users,
  Activity,
  CheckCircle2,
  XCircle,
  Eye,
  Target,
  Download,
  MoreVertical,
  Filter,
  Edit,
  PlayCircle,
  Plus,
  X,
  ArrowLeft,
  ArrowRight,
  ListTodo,
  Check,
  FileCheck,
  Phone,
  Calendar,
  User,
  Save,
  Trash2,
  Grid,
  List,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Info
} from 'lucide-react';
import { useGFCDossiers } from '../../hooks/useGFCDossiers';
import { GFCModule } from '../Dashboard';
import PrestationTemplate from '../PrestationTemplate';

// Interfaces
interface LandCadastralDashboardProps {
  activeModule: GFCModule;
  onModuleChange: (module: GFCModule) => void;
  onCreateNew?: () => void;
}

interface PhaseTodo {
  id: string;
  label: string;
  completed: boolean;
}

interface ActionModalData {
  dossier: any;
  action: 'abandon' | 'waiting' | 'refuse';
}

interface AssignModalData {
  dossier: any;
  fromPhase: string;
  toPhase: string;
}

interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

type Priority = 'normal' | 'urgent' | 'very-urgent';

interface PriorityConfig {
  icon: React.ReactNode;
  color: string;
  label: string;
}

// Constants
const phases = [
  { id: 'phase_1', label: 'Phase 1', field: 'phase_1', dateField: 'phase_1_date', color: 'blue', prevPhase: 'receptionnees', nextPhase: 'phase_2' },
  { id: 'phase_2', label: 'Phase 2', field: 'phase_2', dateField: 'phase_2_date', color: 'green', prevPhase: 'phase_1', nextPhase: 'phase_3' },
  { id: 'phase_3', label: 'Phase 3', field: 'phase_3', dateField: 'phase_3_date', color: 'purple', prevPhase: 'phase_2', nextPhase: 'phase_4' },
  { id: 'phase_4', label: 'Phase 4', field: 'phase_4', dateField: 'phase_4_date', color: 'amber', prevPhase: 'phase_3', nextPhase: 'phase_5' },
  { id: 'phase_5', label: 'Phase 5', field: 'phase_5', dateField: 'phase_5_date', color: 'teal', prevPhase: 'phase_4', nextPhase: 'completed' }
];

const phaseTodosConfig: Record<string, { todos: PhaseTodo[], deliverables: string[] }> = {
  phase_1: {
    todos: [
      { id: 'p1_1', label: 'Réception du dossier par le Chef de Département', completed: false },
      { id: 'p1_2', label: 'Enregistrement physique et numérique du dossier dans le Cloud', completed: false },
      { id: 'p1_3', label: 'Attribution du numéro interne GFC', completed: false },
      { id: 'p1_4', label: 'Cadrage du besoin client (objectif, localisation, contraintes)', completed: false },
      { id: 'p1_5', label: 'Collecte des documents de base', completed: false },
      { id: 'p1_6', label: 'Réalisation de l\'étude préliminaire de faisabilité', completed: false },
      { id: 'p1_7', label: 'Analyse technique, juridique et administrative', completed: false },
      { id: 'p1_8', label: 'Planification globale de la procédure à engager', completed: false },
      { id: 'p1_9', label: 'Élaboration de la fiche des documents/éléments à fournir par le client', completed: false },
      { id: 'p1_10', label: 'Élaboration de la liste des livrables à remettre par le Département', completed: false }
    ],
    deliverables: [
      'Rapport prélimaire de faisabilité validé',
      'Fichier de planification de procédure',
      'Listing des Inputs',
      'Listing des Outputs'
    ]
  },
  phase_2: {
    todos: [
      { id: 'p2_1', label: 'Ouverture physique et création numérique dans le Cloud du dossier financier', completed: false },
      { id: 'p2_2', label: 'Évaluation technique et financière détaillée du projet', completed: false },
      { id: 'p2_3', label: 'Transmission du montant estimatif au client', completed: false },
      { id: 'p2_4', label: 'Montage du devis + lettre d\'engagement', completed: false },
      { id: 'p2_5', label: 'Signature du devis + lettre d\'engagement (DG)', completed: false },
      { id: 'p2_6', label: 'Transmission au client pour accord formel', completed: false },
      { id: 'p2_7', label: 'Établissement de l\'ordre de versement', completed: false },
      { id: 'p2_8', label: 'Transmission à la Trésorerie & Engagements', completed: false },
      { id: 'p2_9', label: 'Encaissement des frais des travaux par Trésorerie', completed: false },
      { id: 'p2_10', label: 'Remise du reçu de paiement au Chef de Département', completed: false },
      { id: 'p2_11', label: 'Remise du reçu au client', completed: false },
      { id: 'p2_12', label: 'Constitution du Dossier de Traitement', completed: false },
      { id: 'p2_13', label: 'Cotation et transmission du dossier au cadre technique', completed: false }
    ],
    deliverables: [
      'Évaluation technique et financière',
      'Devis et lettre d\'engagement signés',
      'Ordre de versement établi',
      'Reçu de paiement',
      'Dossier de traitement constitué'
    ]
  },
  phase_3: {
    todos: [
      { id: 'p3_1', label: 'Expertise approfondie', completed: false },
      { id: 'p3_2', label: 'Rédaction du rapport', completed: false },
      { id: 'p3_3', label: 'Vérification juridique', completed: false }
    ],
    deliverables: [
      'Rapport d\'expertise complet',
      'Vérification juridique validée'
    ]
  },
  phase_4: {
    todos: [
      { id: 'p4_1', label: 'Finalisation du dossier', completed: false },
      { id: 'p4_2', label: 'Appro validation hiérarchique', completed: false },
      { id: 'p4_3', label: 'Préparation envoi client', completed: false }
    ],
    deliverables: [
      'Dossier finalisé',
      'Validation hiérarchique obtenue'
    ]
  },
  phase_5: {
    todos: [
      { id: 'p5_1', label: 'Envoi au client', completed: false },
      { id: 'p5_2', label: 'Archivage du dossier', completed: false },
      { id: 'p5_3', label: 'Clôture administrative', completed: false }
    ],
    deliverables: [
      'Documents livrés au client',
      'Archivage complet effectué',
      'Clôture administrative finalisée'
    ]
  }
};

const priorityConfig: Record<Priority, PriorityConfig> = {
  'normal': {
    icon: <Info className="w-4 h-4" />,
    color: 'text-green-500',
    label: 'Normal'
  },
  'urgent': {
    icon: <AlertCircle className="w-4 h-4" />,
    color: 'text-yellow-500',
    label: 'Urgent'
  },
  'very-urgent': {
    icon: <AlertTriangle className="w-4 h-4" />,
    color: 'text-red-500',
    label: 'Très Urgent'
  }
};

// Components
const PieChart = ({ data, colors, size = 120 }: { data: { label: string; value: number }[]; colors: string[]; size?: number }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {data.map((item, index) => {
          const percentage = (item.value / total) * 100;
          const angle = (percentage / 100) * 360;
          const largeArcFlag = angle > 180 ? 1 : 0;
          
          const x1 = size / 2 + (size / 2) * Math.cos(currentAngle * Math.PI / 180);
          const y1 = size / 2 + (size / 2) * Math.sin(currentAngle * Math.PI / 180);
          const x2 = size / 2 + (size / 2) * Math.cos((currentAngle + angle) * Math.PI / 180);
          const y2 = size / 2 + (size / 2) * Math.sin((currentAngle + angle) * Math.PI / 180);

          const pathData = [
            `M ${size / 2} ${size / 2}`,
            `L ${x1} ${y1}`,
            `A ${size / 2} ${size / 2} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            'Z'
          ].join(' ');

          const slice = (
            <path
              key={index}
              d={pathData}
              fill={colors[index % colors.length]}
              stroke="#fff"
              strokeWidth="2"
            />
          );

          currentAngle += angle;
          return slice;
        })}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-bold text-gray-700">{total}</div>
          <div className="text-xs text-gray-500">Total</div>
        </div>
      </div>
    </div>
  );
};

const BarChart = ({ data, colors }: { data: { label: string; value: number }[]; colors: string[] }) => {
  const maxValue = Math.max(...data.map(item => item.value));
  
  return (
    <div className="w-full h-48 flex items-end justify-between space-x-2">
      {data.map((item, index) => (
        <div key={index} className="flex flex-col items-center flex-1">
          <div className="text-xs text-gray-600 mb-1 text-center">{item.label}</div>
          <div
            className="w-full rounded-t transition-all duration-500 hover:opacity-80"
            style={{
              height: `${(item.value / maxValue) * 100}%`,
              backgroundColor: colors[index % colors.length],
              minHeight: '20px'
            }}
          />
          <div className="text-xs font-semibold text-gray-700 mt-1">{item.value}</div>
        </div>
      ))}
    </div>
  );
};

// Main Component
const LandCadastralDashboard: React.FC<LandCadastralDashboardProps> = ({ 
  activeModule, 
  onModuleChange
}) => {
  const { dossiers, loading, getStatistiques, updateDossier } = useGFCDossiers();
  
  // State declarations
  const [selectedDossier, setSelectedDossier] = useState<any>(null);
  const [validationModal, setValidationModal] = useState<any>(null);
  const [refusRaison, setRefusRaison] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPhase, setFilterPhase] = useState('all');
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
  const [validationNotes, setValidationNotes] = useState('');
  const [showActionModal, setShowActionModal] = useState<ActionModalData | null>(null);
  const [actionReason, setActionReason] = useState('');
  const [assignModal, setAssignModal] = useState<AssignModalData | null>(null);
  const [assignTo, setAssignTo] = useState('');
  const [phaseTraitementViewMode, setPhaseTraitementViewMode] = useState<'grid' | 'list'>('grid');
  const [documentTrackingViewMode, setDocumentTrackingViewMode] = useState<'grid' | 'list'>('grid');
  const [livrablesCompleted, setLivrablesCompleted] = useState<Record<string, boolean[]>>({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingDossierData, setEditingDossierData] = useState<any>(null);

  // Search states
  const [dashboardSearchTerm, setDashboardSearchTerm] = useState('');
  const [phase12SearchTerm, setPhase12SearchTerm] = useState('');
  const [phase34SearchTerm, setPhase34SearchTerm] = useState('');
  const [dossiersSearchTerm, setDossiersSearchTerm] = useState('');
  const [phase5SearchTerm, setPhase5SearchTerm] = useState('');

  // Pagination States
  const [dossiersPagination, setDossiersPagination] = useState<PaginationState>({
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 0
  });

  const [documentTrackingPagination, setDocumentTrackingPagination] = useState<PaginationState>({
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 0
  });

  const [phaseTraitementPagination, setPhaseTraitementPagination] = useState<PaginationState>({
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 0
  });

  const [phase5Pagination, setPhase5Pagination] = useState<PaginationState>({
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 0
  });

  // Filter states
  const [phaseTraitementFilter, setPhaseTraitementFilter] = useState<string>('all');
  const [documentTrackingFilter, setDocumentTrackingFilter] = useState<string>('all');

  const stats = getStatistiques();

  // Data filtering functions
  const dossiersReceptionnes = dossiers.filter(d => d.statut === 'receptionnees');
  const dossiersValidees = dossiers.filter(d => d.statut === 'validees');
  const dossiersRenvoyees = dossiers.filter(d => d.statut === 'renvoyees');
  const dossiersTraitees = dossiers.filter(d => d.statut === 'traitees');
  const dossiersPhase1 = dossiers.filter(d => d.phase_1 === true && !d.phase_2);
  const dossiersPhase2 = dossiers.filter(d => d.phase_2 === true && !d.phase_3);
  const dossiersPhase3 = dossiers.filter(d => d.phase_3 === true && !d.phase_4);
  const dossiersPhase4 = dossiers.filter(d => d.phase_4 === true && !d.phase_5);
  const dossiersPhase5 = dossiers.filter(d => d.phase_5 === true);
  const dossiersEnAttente = dossiers.filter(d => d.statut === 'en_attente');
  const dossiersAbandonne = dossiers.filter(d => d.statut === 'abandonne');
  const dossiersEnCours = dossiers.filter(d => d.abandonne === false && d.en_cours === true);

  const filteredDossiers = selectedStatus === 'all' 
    ? dossiers 
    : dossiers.filter(d => d.statut === selectedStatus);

  const safeStats = {
    total: stats?.total || 0,
    alertes: {
      retard: stats?.alertes?.retard || 0,
      complement: stats?.alertes?.complement || 0,
      paiement: stats?.alertes?.paiement || 0
    },
    par_statut: {
      en_traitement: stats?.par_statut?.en_traitement || 0,
      en_attente_client: stats?.par_statut?.en_attente_client || 0,
      en_attente_admin: stats?.par_statut?.en_attente_admin || 0,
      valide: stats?.par_statut?.valide || 0
    },
    par_categorie: {
      traitees: stats?.par_categorie?.traitees || 0,
      cloture: stats?.par_categorie?.cloture || 0,
      en_cours: stats?.par_categorie?.en_cours || 0,
      a_transmettre: stats?.par_categorie?.a_transmettre || 0
    }
  };

  // CORRECTION: Déplacer getDossierPriority ici, au niveau du composant principal
  const getDossierPriority = (dossier: any): Priority => {
    const progression = typeof dossier.progression_percentage === 'string' 
      ? parseFloat(dossier.progression_percentage) || 0 
      : dossier.progression_percentage || 0;
    
    const createdDate = dossier.created_at ? new Date(dossier.created_at) : new Date();
    const daysSinceCreation = Math.floor((new Date().getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSinceCreation > 30 || progression < 10) return 'very-urgent';
    if (daysSinceCreation > 15 || progression < 30) return 'urgent';
    return 'normal';
  };

  // Priority Icon Component avec la fonction intégrée
  const PriorityIcon: React.FC<{ dossier: any }> = ({ dossier }) => {
    const priority = getDossierPriority(dossier);
    const config = priorityConfig[priority];
    
    return (
      <div className="relative group">
        <div className={`${config.color} cursor-help`}>
          {config.icon}
        </div>
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 pointer-events-none">
          {config.label}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
        </div>
      </div>
    );
  };

  // Utility functions
  const getSuiviDocumentsDossiers = () => {
    return dossiers.filter(dossier => {
      const isPhase3To5 = dossier.phase_3 === true || dossier.phase_4 === true || dossier.phase_5 === true;
      const isSpecialStatus = dossier.statut === 'en_attente' || dossier.statut === 'abandonne' || 
                            (dossier.abandonne === false && dossier.en_cours === true);
      return isPhase3To5 || isSpecialStatus;
    });
  };

  const getFilteredDocumentTrackingDossiers = () => {
    let filtered = getSuiviDocumentsDossiers();
    
    if (documentTrackingFilter !== 'all') {
      switch (documentTrackingFilter) {
        case 'phase_3':
          filtered = filtered.filter(d => d.phase_3 === true && !d.phase_4);
          break;
        case 'phase_4':
          filtered = filtered.filter(d => d.phase_4 === true && !d.phase_5);
          break;
        case 'phase_5':
          filtered = filtered.filter(d => d.phase_5 === true);
          break;
        case 'en_attente':
          filtered = filtered.filter(d => d.statut === 'en_attente');
          break;
        case 'abandonne':
          filtered = filtered.filter(d => d.statut === 'abandonne');
          break;
        case 'en_cours':
          filtered = filtered.filter(d => d.abandonne === false && d.en_cours === true);
          break;
        default:
          break;
      }
    }

    const searchTermToUse = phase34SearchTerm;
    return filtered.filter(dossier => {
      const matchesSearch =
        dossier.code_prestation?.toLowerCase().includes(searchTermToUse.toLowerCase()) ||
        dossier.client_nom?.toLowerCase().includes(searchTermToUse.toLowerCase()) ||
        dossier.client_phone?.toLowerCase().includes(searchTermToUse.toLowerCase()) ||
        dossier.client_adresse?.toLowerCase().includes(searchTermToUse.toLowerCase());

      if (!matchesSearch) return false;

      const progress = dossier.progression_percentage 
        ? Math.max(0, Math.min(100, parseFloat(dossier.progression_percentage) || 0))
        : dossier.progression_percentage || 0;

      if (filterPhase === 'all') return true;
      if (filterPhase === 'completed') return progress === 100;
      if (filterPhase === 'in_progress') return progress > 0 && progress < 100;
      if (filterPhase === 'not_started') return progress === 0;

      return true;
    });
  };

  const getFilteredPhaseTraitementDossiers = () => {
    let filtered = [
      ...dossiersPhase1.map(d => ({ ...d, phaseType: 'phase_1' })),
      ...dossiersPhase2.map(d => ({ ...d, phaseType: 'phase_2' })),
      ...dossiersEnAttente.map(d => ({ ...d, phaseType: 'en_attente' })),
      ...dossiersAbandonne.map(d => ({ ...d, phaseType: 'abandonne' })),
      ...dossiersEnCours.map(d => ({ ...d, phaseType: 'en_cours' }))
    ];

    if (phaseTraitementFilter !== 'all') {
      filtered = filtered.filter(d => d.phaseType === phaseTraitementFilter);
    }

    const searchTermToUse = phase12SearchTerm;
    return filtered.filter(dossier => {
      return (
        dossier.code_prestation?.toLowerCase().includes(searchTermToUse.toLowerCase()) ||
        dossier.client_nom?.toLowerCase().includes(searchTermToUse.toLowerCase()) ||
        dossier.client_phone?.toLowerCase().includes(searchTermToUse.toLowerCase()) ||
        dossier.client_adresse?.toLowerCase().includes(searchTermToUse.toLowerCase())
      );
    });
  };

  const getFilteredPhase5Dossiers = () => {
    return dossiersPhase5.filter(dossier => 
      dossier.code_prestation?.toLowerCase().includes(phase5SearchTerm.toLowerCase()) ||
      dossier.client_nom?.toLowerCase().includes(phase5SearchTerm.toLowerCase()) ||
      dossier.client_phone?.toLowerCase().includes(phase5SearchTerm.toLowerCase()) ||
      dossier.client_adresse?.toLowerCase().includes(phase5SearchTerm.toLowerCase())
    );
  };

  // Pagination functions
  const updatePagination = (paginationState: PaginationState, totalItems: number) => {
    const totalPages = Math.ceil(totalItems / paginationState.itemsPerPage);
    return {
      ...paginationState,
      totalItems,
      totalPages,
      currentPage: paginationState.currentPage > totalPages ? 1 : paginationState.currentPage
    };
  };

  const getPaginatedItems = (items: any[], paginationState: PaginationState) => {
    const startIndex = (paginationState.currentPage - 1) * paginationState.itemsPerPage;
    const endIndex = startIndex + paginationState.itemsPerPage;
    return items.slice(startIndex, endIndex);
  };

  const handlePageChange = (newPage: number, setPagination: React.Dispatch<React.SetStateAction<PaginationState>>) => {
    setPagination(prev => ({
      ...prev,
      currentPage: newPage
    }));
  };

  const renderPagination = (paginationState: PaginationState, setPagination: React.Dispatch<React.SetStateAction<PaginationState>>) => {
    if (paginationState.totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-gray-200">
        <div className="text-sm text-gray-700">
          Affichage de {Math.min((paginationState.currentPage - 1) * paginationState.itemsPerPage + 1, paginationState.totalItems)} à{' '}
          {Math.min(paginationState.currentPage * paginationState.itemsPerPage, paginationState.totalItems)} sur{' '}
          {paginationState.totalItems} documents
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(paginationState.currentPage - 1, setPagination)}
            disabled={paginationState.currentPage === 1}
            className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          {Array.from({ length: paginationState.totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => handlePageChange(page, setPagination)}
              className={`px-3 py-1 rounded-lg border ${
                paginationState.currentPage === page
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
          
          <button
            onClick={() => handlePageChange(paginationState.currentPage + 1, setPagination)}
            disabled={paginationState.currentPage === paginationState.totalPages}
            className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  // Core functions
  const generateCodePrestation = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    
    const currentMonthPattern = `GFC-${year}-${month}`;
    
    const existingCodes = dossiers
      .filter(d => d.code_prestation && d.code_prestation.startsWith(currentMonthPattern))
      .map(d => {
        const code = d.code_prestation;
        if (!code) return 0;
        const numberPart = code.replace(currentMonthPattern, '');
        const sequentialNumber = parseInt(numberPart);
        return isNaN(sequentialNumber) ? 0 : sequentialNumber;
      })
      .filter(num => num > 0 && num < 10000);
    
    const lastNumber = existingCodes.length > 0 ? Math.max(...existingCodes) : 0;
    const nextNumber = (lastNumber + 1).toString().padStart(4, '0');
    const newCode = `${currentMonthPattern}${nextNumber}`;
    
    return newCode;
  };

  const getTrackableDossiers = () => {
    return dossiers.filter(dossier => 
      dossier.statut === 'receptionnees' ||
      dossier.statut === 'validees' || 
      dossier.statut === 'renvoyees' || 
      dossier.statut === 'traitees' ||
      phases.some(phase => dossier[phase.field] === true)
    );
  };

  const getCurrentPhase = (dossier: any) => {
    if (dossier.statut === 'receptionnees') {
      return 'receptionnees';
    }
    
    for (let i = phases.length - 1; i >= 0; i--) {
      if (dossier[phases[i].field] === true) {
        return phases[i].id;
      }
    }
    return 'receptionnees';
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
    
    if (phaseId === 'receptionnees') {
      return trackableDossiers.filter(dossier => 
        dossier.statut === 'receptionnees' || getCurrentPhase(dossier) === 'receptionnees'
      );
    }
    
    return trackableDossiers.filter(dossier => getCurrentPhase(dossier) === phaseId);
  };

  const getPhaseCompletionCount = (phaseId: string) => {
    return getDossiersInPhase(phaseId).length;
  };

  const toggleTodo = (phase: string, todoId: string) => {
    setTodos(prev => ({
      ...prev,
      [phase]: prev[phase].map(todo => 
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
      )
    }));
  };

  const toggleLivrable = (phase: string, index: number) => {
    setLivrablesCompleted(prev => ({
      ...prev,
      [phase]: prev[phase].map((completed, i) => 
        i === index ? !completed : completed
      )
    }));
  };

  const allTodosCompleted = (phase: string) => {
    return todos[phase]?.every(todo => todo.completed) || false;
  };

  const allLivrablesCompleted = (phase: string) => {
    return livrablesCompleted[phase]?.every(completed => completed) || false;
  };

  const canProceedToNextPhase = (phase: string) => {
    return allTodosCompleted(phase) && allLivrablesCompleted(phase);
  };

  // Handler functions
  const handleViewDossier = (dossier: any) => {
    setSelectedDossier(dossier);
    setShowTemplate(true);
  };

  const handleEditDossier = (dossier: any) => {
    setEditingDossierData(dossier);
    setShowEditModal(true);
  };

  const handleValidateDossier = (dossier: any) => {
    setValidationModal(dossier);
    setValidationNotes('');
  };

  const handleRefuseDossier = (dossier: any) => {
    setDossierToRefuse(dossier);
    setRefuseReason('');
    setShowRefuseModal(true);
  };

  const handleAbandonDossier = (dossier: any) => {
    setShowActionModal({ dossier, action: 'abandon' });
    setActionReason('');
  };

  const handleWaitDossier = (dossier: any) => {
    setShowActionModal({ dossier, action: 'waiting' });
    setActionReason('');
  };

  const handleManagePhase = (dossier: any) => {
    const currentDossierPhase = getCurrentPhase(dossier);
    console.log('Opening phase modal for:', dossier.code_prestation, 'Phase:', currentDossierPhase);
    
    setEditingDossier(dossier);
    setCurrentPhase(currentDossierPhase);
    
    if (!todos[currentDossierPhase] && phaseTodosConfig[currentDossierPhase]) {
      console.log('Initializing todos for phase:', currentDossierPhase);
      setTodos(prev => ({
        ...prev,
        [currentDossierPhase]: phaseTodosConfig[currentDossierPhase].todos.map(todo => ({
          ...todo,
          completed: false
        }))
      }));
    } else {
      console.log('Todos already exist for phase:', currentDossierPhase, todos[currentDossierPhase]);
    }
    
    if (!livrablesCompleted[currentDossierPhase] && phaseTodosConfig[currentDossierPhase]) {
      console.log('Initializing livrables for phase:', currentDossierPhase);
      setLivrablesCompleted(prev => ({
        ...prev,
        [currentDossierPhase]: new Array(phaseTodosConfig[currentDossierPhase].deliverables.length).fill(false)
      }));
    }
    
    setShowPhaseModal(true);
  };

  const closeAllModals = () => {
    setShowTemplate(false);
    setShowEditModal(false);
    setValidationModal(null);
    setShowRefuseModal(false);
    setShowActionModal(null);
    setShowPhaseModal(false);
    setAssignModal(null);
    setSelectedDossier(null);
    setEditingDossierData(null);
    setDossierToRefuse(null);
    setEditingDossier(null);
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
        validation_notes: validationNotes,
        phase_1: true,
        phase_1_date: new Date().toISOString()
      };

      await updateDossier(dossier.id, updates);
      setValidationModal(null);
      setValidationNotes('');
    } catch (error) {
      console.error('Error receiving dossier:', error);
    } finally {
      setIsGeneratingCode(false);
    }
  };

  const handleTransmitPhase = async (fromPhase: string, toPhase: string, assignTo?: string) => {
    if (!editingDossier) return;

    const fromPhaseData = phases.find(p => p.id === fromPhase);
    const toPhaseData = phases.find(p => p.id === toPhase);

    if (!fromPhaseData || !toPhaseData) return;

    const updates: any = {
      [fromPhaseData.field]: false,
      [toPhaseData.field]: true,
      [toPhaseData.dateField]: new Date().toISOString()
    };

    if (assignTo) {
      updates.assigned_person = assignTo;
    }

    try {
      await updateDossier(editingDossier.id, updates);
      setShowPhaseModal(false);
      setEditingDossier(null);
      setAssignModal(null);
      setAssignTo('');
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

  const handleActionOnDossier = async () => {
    if (!showActionModal || !actionReason.trim()) return;

    const { dossier, action } = showActionModal;
    let updates: any = {};

    switch (action) {
      case 'abandon':
        updates = {
          statut: 'abandonne',
          raison_abandon: actionReason,
          date_abandon: new Date().toISOString()
        };
        break;
      case 'waiting':
        updates = {
          statut: 'en_attente',
          raison_attente: actionReason,
          date_mise_attente: new Date().toISOString()
        };
        break;
      case 'refuse':
        updates = {
          statut: 'renvoyees',
          raison_refus: actionReason,
          date_refus: new Date().toISOString()
        };
        break;
    }

    try {
      await updateDossier(dossier.id, updates);
      setShowActionModal(null);
      setActionReason('');
    } catch (error) {
      console.error('Error updating dossier:', error);
    }
  };

  const openAssignModal = (dossier: any, fromPhase: string, toPhase: string) => {
    setAssignModal({ dossier, fromPhase, toPhase });
    setAssignTo('');
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Non défini';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleValiderDossier = async (dossierId: string) => {
    try {
      await updateDossier(dossierId, { 
        statut: 'receptionnees',
        date_validation: new Date().toISOString()
      });
      setValidationModal(null);
    } catch (error) {
      console.error('Erreur lors de la validation:', error);
    }
  };

  const handleRefuserDossierOriginal = async (dossierId: string, raison: string) => {
    try {
      await updateDossier(dossierId, { 
        statut: 'renvoyees',
        raison_refus: raison,
        date_refus: new Date().toISOString()
      });
      setValidationModal(null);
      setRefusRaison('');
    } catch (error) {
      console.error('Erreur lors du refus:', error);
    }
  };

  const closeModal = () => {
    setValidationModal(null);
    setRefusRaison('');
    setValidationNotes('');
  };

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'receptionnees': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'validees': return 'bg-green-100 text-green-700 border-green-200';
      case 'renvoyees': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'traitees': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusText = (statut: string) => {
    switch (statut) {
      case 'receptionnees': return 'Réceptionné';
      case 'validees': return 'Validé';
      case 'renvoyees': return 'Renvoyé';
      case 'traitees': return 'Traité';
      default: return statut;
    }
  };

  const getStatusCount = (statut: string) => {
    switch (statut) {
      case 'receptionnees': return dossiersReceptionnes.length;
      case 'validees': return dossiersValidees.length;
      case 'renvoyees': return dossiersRenvoyees.length;
      case 'traitees': return dossiersTraitees.length;
      default: return dossiers.length;
    }
  };

  const getPhaseTraitementStats = () => {
    const total = dossiersPhase1.length + dossiersPhase2.length;
    const enAttente = dossiers.filter(d => d.statut === 'en_attente').length;
    const abandonne = dossiers.filter(d => d.statut === 'abandonne').length;
    const enCours = dossiers.filter(d => d.abandonne === false && d.en_cours === true).length;
    
    return { total, enAttente, abandonne, enCours };
  };

  // Dossier Card Components
  const renderDossierCardSimple = (dossier: any) => {
    const progression = typeof dossier.progression_percentage === 'string' 
      ? parseFloat(dossier.progression_percentage) || 0 
      : dossier.progression_percentage || 0;
    
    const currentDossierPhase = getCurrentPhase(dossier);
    const currentPhaseData = phases.find(p => p.id === currentDossierPhase);
    const isReceptionnees = dossier.statut === 'receptionnees';
    const isValidees = dossier.statut === 'validees';
    const isRenvoyees = dossier.statut === 'renvoyees';

    return (
      <div key={dossier.id} className="bg-white rounded-xl shadow-lg border-2 border-gray-100 hover:shadow-xl transition-all duration-300 hover:border-blue-300 group">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-xl p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                isReceptionnees ? 'bg-blue-500' :
                isValidees ? 'bg-green-500' :
                isRenvoyees ? 'bg-amber-500' :
                `bg-${currentPhaseData?.color}-500`
              }`}></div>
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                {isReceptionnees ? 'Réceptionné' : 
                 isValidees ? 'Validé' :
                 isRenvoyees ? 'Renvoyé' :
                 currentPhaseData?.label}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <PriorityIcon dossier={dossier} />
              <span className={`px-2 py-1 rounded-full text-xs font-bold text-white ${
                progression === 100 ? 'bg-green-500' :
                progression >= 50 ? 'bg-blue-500' :
                progression > 0 ? 'bg-amber-500' : 'bg-gray-400'
              }`}>
                {progression}%
              </span>
            </div>
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

        <div className="p-4 space-y-3">
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

            {dossier.validation_notes && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mt-2">
                <p className="text-xs text-blue-800 font-medium">Notes de validation:</p>
                <p className="text-xs text-blue-700">{dossier.validation_notes}</p>
              </div>
            )}
          </div>

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

        <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          {isReceptionnees && (
            <div className="flex gap-2 items-center">
              <div className="flex gap-2">
                <button
                  onClick={() => handleViewDossier(dossier)}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center transition-all duration-200 group/btn relative"
                  title="Voir les détails"
                >
                  <Eye className="w-4 h-4" />
                  <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap">
                    Voir
                  </span>
                </button>
                <button
                  onClick={() => handleEditDossier(dossier)}
                  className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center transition-all duration-200 group/btn relative"
                  title="Modifier le dossier"
                >
                  <Edit className="w-4 h-4" />
                  <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap">
                    Modifier
                  </span>
                </button>
              </div>

              <div className="h-6 w-px bg-gray-300 mx-1"></div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleRefuseDossier(dossier)}
                  className="p-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 flex items-center justify-center transition-all duration-200 group/btn relative"
                  title="Renvoyer le dossier"
                >
                  <XCircle className="w-10 h-4" />
                  <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap">
                    Renvoyer
                  </span>
                </button>
                <button
                  onClick={() => handleValidateDossier(dossier)}
                  className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center transition-all duration-200 group/btn relative"
                  title="Valider le dossier"
                >
                  <CheckCircle2 className="w-10 h-4" />
                  <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap">
                    Valider
                  </span>
                </button>
              </div>
            </div>
          )}

          {isRenvoyees && (
            <div className="flex gap-2">
              <button
                onClick={() => handleViewDossier(dossier)}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center transition-all duration-200 group/btn relative"
                title="Voir les détails"
              >
                <Eye className="w-4 h-4" />
                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap">
                  Voir
                </span>
              </button>
              <button
                onClick={() => handleEditDossier(dossier)}
                className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center transition-all duration-200 group/btn relative"
                title="Modifier le dossier"
              >
                <Edit className="w-4 h-4" />
                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap">
                  Modifier
                </span>
              </button>
            </div>
          )}

          {(isValidees || (!isReceptionnees && !isRenvoyees)) && (
            <div className="flex gap-2">
              <button
                onClick={() => handleViewDossier(dossier)}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center transition-all duration-200 group/btn relative"
                title="Voir les détails"
              >
                <Eye className="w-4 h-4" />
                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap">
                  Voir
                </span>
              </button>
              <button
                onClick={() => handleEditDossier(dossier)}
                className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center transition-all duration-200 group/btn relative"
                title="Modifier le dossier"
              >
                <Edit className="w-4 h-4" />
                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap">
                  Modifier
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderDossierCardComplete = (dossier: any) => {
    const progression = typeof dossier.progression_percentage === 'string' 
      ? parseFloat(dossier.progression_percentage) || 0 
      : dossier.progression_percentage || 0;
    
    const currentDossierPhase = getCurrentPhase(dossier);
    const currentPhaseData = phases.find(p => p.id === currentDossierPhase);
    const isReceptionnees = dossier.statut === 'receptionnees';

    return (
      <div key={dossier.id} className="bg-white rounded-xl shadow-lg border-2 border-gray-100 hover:shadow-xl transition-all duration-300 hover:border-blue-300 group">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-xl p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                currentDossierPhase === 'receptionnees' ? 'bg-blue-500' :
                `bg-${currentPhaseData?.color}-500`
              }`}></div>
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                {currentDossierPhase === 'receptionnees' ? 'Réceptionné' : currentPhaseData?.label}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <PriorityIcon dossier={dossier} />
              <span className={`px-2 py-1 rounded-full text-xs font-bold text-white ${
                progression === 100 ? 'bg-green-500' :
                progression >= 50 ? 'bg-blue-500' :
                progression > 0 ? 'bg-amber-500' : 'bg-gray-400'
              }`}>
                {progression}%
              </span>
            </div>
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

        <div className="p-4 space-y-3">
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

            {dossier.validation_notes && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mt-2">
                <p className="text-xs text-blue-800 font-medium">Notes de validation:</p>
                <p className="text-xs text-blue-700">{dossier.validation_notes}</p>
              </div>
            )}
          </div>

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

        <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <div className="flex items-center justify-between gap-2">
            <div className="flex gap-2">
              <button
                onClick={() => handleViewDossier(dossier)}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center transition-all duration-200 group/btn relative"
                title="Voir les détails"
              >
                <Eye className="w-4 h-4" />
                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap z-10">
                  Voir
                </span>
              </button>

              <button
                onClick={() => handleEditDossier(dossier)}
                className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center transition-all duration-200 group/btn relative"
                title="Modifier le dossier"
              >
                <Edit className="w-4 h-4" />
                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap z-10">
                  Modifier
                </span>
              </button>

              {!isReceptionnees && (
                <button
                  onClick={() => handleAbandonDossier(dossier)}
                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center justify-center transition-all duration-200 group/btn relative"
                  title="Abandonner le dossier"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap z-10">
                    Abandonner
                  </span>
                </button>
              )}

              {!isReceptionnees && (
                <button
                  onClick={() => handleWaitDossier(dossier)}
                  className="p-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 flex items-center justify-center transition-all duration-200 group/btn relative"
                  title="Mettre en attente"
                >
                  <Clock className="w-4 h-4" />
                  <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap z-10">
                    En attente
                  </span>
                </button>
              )}
            </div>
            
            {!isReceptionnees && currentPhaseData && (
              <button
                onClick={() => handleManagePhase(dossier)}
                className={`px-4 py-2 bg-${currentPhaseData?.color}-600 text-white rounded-lg hover:bg-${currentPhaseData?.color}-700 flex items-center justify-center gap-2 text-sm font-semibold transition-all duration-200 group/btn relative`}
                title="Gérer la phase"
              >
                <ListTodo className="w-4 h-4" />
                <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap z-10">
                  Ouvrir gestion de phase
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Render functions for different sections
  const renderDocumentGrid = () => {
    const filteredDossiersWithSearch = filteredDossiers.filter(dossier => 
      dossier.code_prestation?.toLowerCase().includes(dossiersSearchTerm.toLowerCase()) ||
      dossier.client_nom?.toLowerCase().includes(dossiersSearchTerm.toLowerCase()) ||
      dossier.client_phone?.toLowerCase().includes(dossiersSearchTerm.toLowerCase()) ||
      dossier.client_adresse?.toLowerCase().includes(dossiersSearchTerm.toLowerCase())
    );
    
    const paginatedDossiers = getPaginatedItems(filteredDossiersWithSearch, dossiersPagination);
    
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {paginatedDossiers.map((dossier) => renderDossierCardSimple(dossier))}
        </div>
        {renderPagination(dossiersPagination, setDossiersPagination)}
      </>
    );
  };

  const renderDocumentList = () => {
    const filteredDossiersWithSearch = filteredDossiers.filter(dossier => 
      dossier.code_prestation?.toLowerCase().includes(dossiersSearchTerm.toLowerCase()) ||
      dossier.client_nom?.toLowerCase().includes(dossiersSearchTerm.toLowerCase()) ||
      dossier.client_phone?.toLowerCase().includes(dossiersSearchTerm.toLowerCase()) ||
      dossier.client_adresse?.toLowerCase().includes(dossiersSearchTerm.toLowerCase())
    );
    
    const paginatedDossiers = getPaginatedItems(filteredDossiersWithSearch, dossiersPagination);
    
    return (
      <>
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">N° Dossier</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Client</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Procédure</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Statut</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Progression</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedDossiers.map((dossier) => {
                const progression = typeof dossier.progression_percentage === 'string' 
                  ? parseFloat(dossier.progression_percentage) || 0 
                  : dossier.progression_percentage || 0;
                  
                return (
                  <tr key={dossier.id} className="hover:bg-gray-50 transition-colors border-b border-gray-200">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <PriorityIcon dossier={dossier} />
                        <span className="font-mono font-bold text-gray-900">{dossier.code_prestation || 'En attente'}</span>
                      </div>
                      {dossier.validation_notes && (
                        <div className="mt-1">
                          <div className="bg-blue-50 border border-blue-200 rounded p-1">
                            <p className="text-xs text-blue-800 font-medium">Notes:</p>
                            <p className="text-xs text-blue-700 truncate">{dossier.validation_notes}</p>
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{dossier.client_nom}</p>
                        <p className="text-sm text-gray-500">{dossier.client_phone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-700">{dossier.procedure_choisie}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${
                          dossier.statut === 'receptionnees' ? 'bg-blue-500' :
                          dossier.statut === 'validees' ? 'bg-green-500' :
                          dossier.statut === 'renvoyees' ? 'bg-amber-500' : 'bg-gray-500'
                        }`}></div>
                        <span className="text-sm font-medium text-gray-700">
                          {getStatusText(dossier.statut)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${getProgressionColor(progression)}`}
                            style={{ width: `${progression}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-700">{progression}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewDossier(dossier)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors relative group"
                          title="Voir"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditDossier(dossier)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors relative group"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {dossier.statut === 'receptionnees' && (
                          <>
                            <button
                              onClick={() => handleRefuseDossier(dossier)}
                              className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors relative group"
                              title="Renvoyer"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleValidateDossier(dossier)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors relative group"
                              title="Valider"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {renderPagination(dossiersPagination, setDossiersPagination)}
      </>
    );
  };

  // Main render functions for each module
  const renderDossiers = () => {
    const filteredDossiersWithSearch = filteredDossiers.filter(dossier => 
      dossier.code_prestation?.toLowerCase().includes(dossiersSearchTerm.toLowerCase()) ||
      dossier.client_nom?.toLowerCase().includes(dossiersSearchTerm.toLowerCase()) ||
      dossier.client_phone?.toLowerCase().includes(dossiersSearchTerm.toLowerCase()) ||
      dossier.client_adresse?.toLowerCase().includes(dossiersSearchTerm.toLowerCase())
    );

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <FolderOpen className="w-7 h-7 text-green-600" />
              Gestion Centralisée des Dossiers GFC
            </h2>
            
            <div className="flex items-center space-x-4">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex-1 w-full relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher par code, client, téléphone ou adresse..."
                  value={dossiersSearchTerm}
                  onChange={(e) => setDossiersSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <button 
              onClick={() => setSelectedStatus('all')}
              className={`p-4 border-2 rounded-xl hover:bg-gray-50 transition-all text-left ${
                selectedStatus === 'all' 
                  ? 'bg-gray-100 border-gray-300 shadow-sm' 
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="text-2xl font-bold text-gray-700">{dossiers.length}</div>
              <div className="text-sm text-gray-600 font-medium">Tous les dossiers</div>
            </button>
            
            <button 
              onClick={() => setSelectedStatus('receptionnees')}
              className={`p-4 border-2 rounded-xl hover:bg-blue-50 transition-all text-left ${
                selectedStatus === 'receptionnees' 
                  ? 'bg-blue-100 border-blue-300 shadow-sm' 
                  : 'bg-white border-blue-200'
              }`}
            >
              <div className="text-2xl font-bold text-blue-700">{dossiersReceptionnes.length}</div>
              <div className="text-sm text-blue-600 font-medium">À Valider</div>
            </button>
            
            <button 
              onClick={() => setSelectedStatus('validees')}
              className={`p-4 border-2 rounded-xl hover:bg-green-50 transition-all text-left ${
                selectedStatus === 'validees' 
                  ? 'bg-green-100 border-green-300 shadow-sm' 
                  : 'bg-white border-green-200'
              }`}
            >
              <div className="text-2xl font-bold text-green-700">{dossiersValidees.length}</div>
              <div className="text-sm text-green-600 font-medium">Validés</div>
            </button>
            
            <button 
              onClick={() => setSelectedStatus('renvoyees')}
              className={`p-4 border-2 rounded-xl hover:bg-amber-50 transition-all text-left ${
                selectedStatus === 'renvoyees' 
                  ? 'bg-amber-100 border-amber-300 shadow-sm' 
                  : 'bg-white border-amber-200'
              }`}
            >
              <div className="text-2xl font-bold text-amber-700">{dossiersRenvoyees.length}</div>
              <div className="text-sm text-amber-600 font-medium">Renvoyés</div>
            </button>
            
            <button 
              onClick={() => setSelectedStatus('traitees')}
              className={`p-4 border-2 rounded-xl hover:bg-purple-50 transition-all text-left ${
                selectedStatus === 'traitees' 
                  ? 'bg-purple-100 border-purple-300 shadow-sm' 
                  : 'bg-white border-purple-200'
              }`}
            >
              <div className="text-2xl font-bold text-purple-700">{dossiersTraitees.length}</div>
              <div className="text-sm text-purple-600 font-medium">Clôturés</div>
            </button>
          </div>

          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedStatus === 'all' ? 'Tous les Dossiers' : getStatusText(selectedStatus)} 
                ({filteredDossiersWithSearch.length})
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {selectedStatus === 'all' 
                  ? 'Affichage de tous les dossiers' 
                  : `Dossiers avec le statut "${getStatusText(selectedStatus)}"`}
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500">
                {viewMode === 'grid' ? 'Vue Grille' : 'Vue Liste'}
              </span>
              <div className="w-px h-6 bg-gray-300"></div>
              <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                <Filter className="w-4 h-4" />
                <span>Filtrer</span>
              </button>
            </div>
          </div>

          {filteredDossiersWithSearch.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-2xl">
              <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-500 mb-2">Aucun dossier trouvé</h4>
              <p className="text-gray-400">
                {selectedStatus === 'all' 
                  ? "Aucun dossier n'est disponible pour le moment." 
                  : `Aucun dossier avec le statut "${getStatusText(selectedStatus)}".`}
              </p>
            </div>
          ) : viewMode === 'grid' ? (
            renderDocumentGrid()
          ) : (
            renderDocumentList()
          )}
        </div>

        {/* Modals for Dossiers section */}
        {validationModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold mb-4">Valider le Dossier</h3>
              
              <div className="mb-4 p-4 bg-gray-50 rounded-xl">
                <p><strong>Dossier:</strong> {validationModal.code_prestation}</p>
                <p><strong>Client:</strong> {validationModal.client_nom}</p>
                <p><strong>Procédure:</strong> {validationModal.procedure_choisie}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes de validation
                  </label>
                  <textarea
                    value={validationNotes}
                    onChange={(e) => setValidationNotes(e.target.value)}
                    rows={3}
                    placeholder="Ajoutez des notes pour la phase 1..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div className="p-4 bg-green-50 rounded-xl">
                  <p className="text-green-800 font-medium">
                    Êtes-vous sûr de vouloir valider ce dossier ? Cette action créera le code GFC et passera en Phase 1.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleReceptionnerDossier(validationModal)}
                    disabled={isGeneratingCode}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 disabled:bg-green-300 disabled:cursor-not-allowed"
                  >
                    {isGeneratingCode ? (
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                    {isGeneratingCode ? 'Génération...' : 'Confirmer la Validation'}
                  </button>
                  <button
                    onClick={closeModal}
                    className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showRefuseModal && dossierToRefuse && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold mb-4">Refuser le Dossier</h3>
              
              <div className="mb-4 p-4 bg-gray-50 rounded-xl">
                <p><strong>Dossier:</strong> {dossierToRefuse.code_prestation}</p>
                <p><strong>Client:</strong> {dossierToRefuse.client_nom}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Raison du refus
                  </label>
                  <textarea
                    value={refuseReason}
                    onChange={(e) => setRefuseReason(e.target.value)}
                    rows={3}
                    placeholder="Saisissez la raison du refus..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleRefuserDossier}
                    disabled={!refuseReason.trim()}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed"
                  >
                    Confirmer le Refus
                  </button>
                  <button
                    onClick={() => {
                      setShowRefuseModal(false);
                      setDossierToRefuse(null);
                      setRefuseReason('');
                    }}
                    className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showEditModal && editingDossierData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold mb-4">Modifier le Dossier</h3>
              
              <div className="mb-4 p-4 bg-gray-50 rounded-xl">
                <p><strong>Dossier:</strong> {editingDossierData.code_prestation}</p>
                <p><strong>Client:</strong> {editingDossierData.client_nom}</p>
                <p><strong>Statut:</strong> {getStatusText(editingDossierData.statut)}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes de modification
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Ajoutez des notes de modification..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingDossierData(null);
                    }}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Sauvegarder
                  </button>
                  <button
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingDossierData(null);
                    }}
                    className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
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

  const renderDashboard = () => {
    const statusData = [
      { label: 'À Valider', value: dossiersReceptionnes.length },
      { label: 'Validés', value: dossiersValidees.length },
      { label: 'Renvoyés', value: dossiersRenvoyees.length },
      { label: 'Clôturés', value: dossiersTraitees.length }
    ];

    const phaseData = [
      { label: 'Phase 1', value: dossiersPhase1.length },
      { label: 'Phase 2', value: dossiersPhase2.length },
      { label: 'Phase 3', value: dossiersPhase3.length },
      { label: 'Phase 4', value: dossiersPhase4.length },
      { label: 'Phase 5', value: dossiersPhase5.length }
    ];

    // CORRECTION: Utiliser la fonction getDossierPriority qui est maintenant définie dans le composant
    const priorityData = [
      { label: 'Normal', value: dossiers.filter(d => getDossierPriority(d) === 'normal').length, color: 'text-green-500', icon: <Info className="w-5 h-5" /> },
      { label: 'Urgent', value: dossiers.filter(d => getDossierPriority(d) === 'urgent').length, color: 'text-yellow-500', icon: <AlertCircle className="w-5 h-5" /> },
      { label: 'Très Urgent', value: dossiers.filter(d => getDossierPriority(d) === 'very-urgent').length, color: 'text-red-500', icon: <AlertTriangle className="w-5 h-5" /> }
    ];

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 w-full relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un dossier par code, client, téléphone ou adresse..."
                value={dashboardSearchTerm}
                onChange={(e) => setDashboardSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-3xl p-8 text-white shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <MapPin className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">Gestion Foncière et Cadastrale</h1>
                <p className="text-blue-100 text-lg">Plateforme numérique intégrée - Pilotage en temps réel</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">{safeStats.total}</div>
              <div className="text-blue-200">Dossiers totaux</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Répartition par Statut
            </h3>
            <div className="flex items-center justify-center">
              <PieChart data={statusData} colors={['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6']} size={160} />
            </div>
            <div className="mt-4 space-y-2">
              {statusData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'][index] }}
                    />
                    <span className="text-sm text-gray-700">{item.label}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Distribution par Phase
            </h3>
            <BarChart data={phaseData} colors={['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#14b8a6']} />
            <div className="mt-4 grid grid-cols-2 gap-2">
              {phaseData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#14b8a6'][index] }}
                  />
                  <span className="text-xs text-gray-700">{item.label}: {item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              Niveaux de Priorité
            </h3>
            <div className="space-y-4">
              {priorityData.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border-2" 
                  style={{ borderColor: item.color === 'text-green-500' ? '#10b981' : item.color === 'text-yellow-500' ? '#f59e0b' : '#ef4444' }}>
                  <div className="flex items-center gap-3">
                    <div className={item.color}>
                      {item.icon}
                    </div>
                    <span className="font-medium text-gray-900">{item.label}</span>
                  </div>
                  <span className="text-lg font-bold" style={{ color: item.color === 'text-green-500' ? '#10b981' : item.color === 'text-yellow-500' ? '#f59e0b' : '#ef4444' }}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FolderOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">{dossiersReceptionnes.length}</div>
              </div>
            </div>
            <h3 className="font-semibold text-gray-900">À Valider</h3>
            <p className="text-sm text-gray-600">Dossiers réceptionnés</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">{dossiersValidees.length}</div>
              </div>
            </div>
            <h3 className="font-semibold text-gray-900">Validés</h3>
            <p className="text-sm text-gray-600">Dossiers en traitement</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-amber-500">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">{dossiersRenvoyees.length}</div>
              </div>
            </div>
            <h3 className="font-semibold text-gray-900">Renvoyés</h3>
            <p className="text-sm text-gray-600">Dossiers refusés</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">{safeStats.par_categorie.traitees}</div>
              </div>
            </div>
            <h3 className="font-semibold text-gray-900">Clôturés</h3>
            <p className="text-sm text-gray-600">Dossiers terminés</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <PlayCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">{dossiersPhase1.length}</div>
              </div>
            </div>
            <h3 className="font-semibold text-gray-900">Phase 1</h3>
            <p className="text-sm text-gray-600">Initialisation</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">{dossiersPhase2.length}</div>
              </div>
            </div>
            <h3 className="font-semibold text-gray-900">Phase 2</h3>
            <p className="text-sm text-gray-600">Contractualisation</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">{dossiersPhase3.length}</div>
              </div>
            </div>
            <h3 className="font-semibold text-gray-900">Phase 3</h3>
            <p className="text-sm text-gray-600">Traitement technique</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-amber-500">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-amber-600" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">{dossiersPhase4.length}</div>
              </div>
            </div>
            <h3 className="font-semibold text-gray-900">Phase 4</h3>
            <p className="text-sm text-gray-600">Finalisation</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-teal-500">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-teal-600" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">{dossiersPhase5.length}</div>
              </div>
            </div>
            <h3 className="font-semibold text-gray-900">Phase 5</h3>
            <p className="text-sm text-gray-600">Livraison & Archivage</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Activity className="w-6 h-6 text-blue-600" />
            Cycle Complet de Traitement
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold mb-2">1</div>
                  <p className="text-xs text-gray-600">Réception</p>
                </div>
                <div className="flex-1 h-1 bg-blue-200"></div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center font-bold mb-2">2</div>
                  <p className="text-xs text-gray-600">Traitement</p>
                </div>
                <div className="flex-1 h-1 bg-green-200"></div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-amber-500 text-white rounded-full flex items-center justify-center font-bold mb-2">3</div>
                  <p className="text-xs text-gray-600">Validation</p>
                </div>
                <div className="flex-1 h-1 bg-amber-200"></div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold mb-2">4</div>
                  <p className="text-xs text-gray-600">Livraison</p>
                </div>
                <div className="flex-1 h-1 bg-purple-200"></div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-teal-500 text-white rounded-full flex items-center justify-center font-bold mb-2">5</div>
                  <p className="text-xs text-gray-600">Archivage</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPhaseTraitement = () => {
    const phaseTraitementStats = getPhaseTraitementStats();
    const paginatedDossiers = getPaginatedItems(getFilteredPhaseTraitementDossiers(), phaseTraitementPagination);

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <PlayCircle className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold mb-2">🧩 PHASE 1 & 2 : INITIALISATION ET CONTRACTUALISATION</h1>
                <p className="text-blue-100 text-lg">Gestion combinée des phases d'initialisation et contractualisation</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">
                {phaseTraitementStats.total}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Aperçu des Dossiers</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <button 
              onClick={() => setPhaseTraitementFilter('all')}
              className={`rounded-xl p-4 text-center shadow-lg transition-all duration-200 ${
                phaseTraitementFilter === 'all' 
                  ? 'bg-blue-100 border-2 border-blue-300 text-blue-700 transform scale-105' 
                  : 'bg-blue-50 border-2 border-blue-200 text-blue-700 hover:bg-blue-100'
              }`}
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 bg-blue-100">
                <FolderOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-700">
                {phaseTraitementStats.total}
              </div>
              <div className="text-sm font-medium text-blue-600">
                Total
              </div>
            </button>

            <button 
              onClick={() => setPhaseTraitementFilter('phase_1')}
              className={`rounded-xl p-4 text-center shadow-lg transition-all duration-200 ${
                phaseTraitementFilter === 'phase_1' 
                  ? 'bg-blue-100 border-2 border-blue-300 text-blue-700 transform scale-105' 
                  : 'bg-blue-50 border-2 border-blue-200 text-blue-700 hover:bg-blue-100'
              }`}
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 bg-blue-100">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-700">
                {dossiersPhase1.length}
              </div>
              <div className="text-sm font-medium text-blue-600">
                Phase 1
              </div>
            </button>

            <button 
              onClick={() => setPhaseTraitementFilter('phase_2')}
              className={`rounded-xl p-4 text-center shadow-lg transition-all duration-200 ${
                phaseTraitementFilter === 'phase_2' 
                  ? 'bg-green-100 border-2 border-green-300 text-green-700 transform scale-105' 
                  : 'bg-green-50 border-2 border-green-200 text-green-700 hover:bg-green-100'
              }`}
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 bg-green-100">
                <FileCheck className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-700">
                {dossiersPhase2.length}
              </div>
              <div className="text-sm font-medium text-green-600">
                Phase 2
              </div>
            </button>

            <button 
              onClick={() => setPhaseTraitementFilter('en_attente')}
              className={`rounded-xl p-4 text-center shadow-lg transition-all duration-200 ${
                phaseTraitementFilter === 'en_attente' 
                  ? 'bg-yellow-100 border-2 border-yellow-300 text-yellow-700 transform scale-105' 
                  : 'bg-yellow-50 border-2 border-yellow-200 text-yellow-700 hover:bg-yellow-100'
              }`}
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 bg-yellow-100">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="text-2xl font-bold text-yellow-700">
                {phaseTraitementStats.enAttente}
              </div>
              <div className="text-sm font-medium text-yellow-600">
                En Attente
              </div>
            </button>

            <button 
              onClick={() => setPhaseTraitementFilter('abandonne')}
              className={`rounded-xl p-4 text-center shadow-lg transition-all duration-200 ${
                phaseTraitementFilter === 'abandonne' 
                  ? 'bg-red-100 border-2 border-red-300 text-red-700 transform scale-105' 
                  : 'bg-red-50 border-2 border-red-200 text-red-700 hover:bg-red-100'
              }`}
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 bg-red-100">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="text-2xl font-bold text-red-700">
                {phaseTraitementStats.abandonne}
              </div>
              <div className="text-sm font-medium text-red-600">
                Abandonné
              </div>
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 w-full relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par code, client, téléphone ou adresse..."
                value={phase12SearchTerm}
                onChange={(e) => setPhase12SearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex gap-4">       
             <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setPhaseTraitementViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    phaseTraitementViewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'
                  }`}
                  title="Vue Grille"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPhaseTraitementViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    phaseTraitementViewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'
                  }`}
                  title="Vue Liste"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {phaseTraitementFilter === 'all' ? 'Tous les Dossiers' : 
                 phaseTraitementFilter === 'phase_1' ? 'Phase 1' :
                 phaseTraitementFilter === 'phase_2' ? 'Phase 2' :
                 phaseTraitementFilter === 'en_attente' ? 'En Attente' : 'Abandonné'} 
                ({getFilteredPhaseTraitementDossiers().length})
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {phaseTraitementFilter === 'all' 
                  ? 'Affichage de tous les dossiers en Phase 1, Phase 2, En Attente, Abandonné et En Cours'
                  : `Dossiers dans la catégorie ${phaseTraitementFilter === 'phase_1' ? 'Phase 1' :
                    phaseTraitementFilter === 'phase_2' ? 'Phase 2' :
                    phaseTraitementFilter === 'en_attente' ? 'En Attente' : 'Abandonné'}`}
              </p>
            </div>
          </div>

          {getFilteredPhaseTraitementDossiers().length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-2xl">
              <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-500 mb-2">Aucun dossier trouvé</h4>
              <p className="text-gray-400">
                Aucun dossier n'est disponible dans cette catégorie.
              </p>
            </div>
          ) : phaseTraitementViewMode === 'grid' ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {paginatedDossiers.map((dossier) => renderDossierCardComplete(dossier))}
              </div>
              {renderPagination(phaseTraitementPagination, setPhaseTraitementPagination)}
            </>
          ) : (
            <>
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">N° Dossier</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Client</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Procédure</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Phase</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Progression</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedDossiers.map((dossier) => {
                      const progression = typeof dossier.progression_percentage === 'string' 
                        ? parseFloat(dossier.progression_percentage) || 0 
                        : dossier.progression_percentage || 0;
                        
                      return (
                        <tr key={dossier.id} className="hover:bg-gray-50 transition-colors border-b border-gray-200">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <PriorityIcon dossier={dossier} />
                              <span className="font-mono font-bold text-gray-900">{dossier.code_prestation || 'En attente'}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium text-gray-900">{dossier.client_nom}</p>
                              <p className="text-sm text-gray-500">{dossier.client_phone}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-gray-700">{dossier.procedure_choisie}</p>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full bg-${dossier.phaseType === 'phase_1' ? 'blue' : dossier.phaseType === 'phase_2' ? 'green' : 'gray'}-500`}></div>
                              <span className="text-sm font-medium text-gray-700">
                                {dossier.phaseType === 'phase_1' ? 'Phase 1' : 
                                 dossier.phaseType === 'phase_2' ? 'Phase 2' :
                                 dossier.phaseType === 'en_attente' ? 'En Attente' :
                                 dossier.phaseType === 'abandonne' ? 'Abandonné' : 'En Cours'}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${getProgressionColor(progression)}`}
                                  style={{ width: `${progression}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium text-gray-700">{progression}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleViewDossier(dossier)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Voir"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleEditDossier(dossier)}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Modifier"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              {dossier.phaseType !== 'receptionnees' && (
                                <>
                                  <button
                                    onClick={() => handleAbandonDossier(dossier)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Abandonner"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleWaitDossier(dossier)}
                                    className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                    title="Mettre en attente"
                                  >
                                    <Clock className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleManagePhase(dossier)}
                                    className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                    title="Gérer la phase"
                                  >
                                    <ListTodo className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {renderPagination(phaseTraitementPagination, setPhaseTraitementPagination)}
            </>
          )}
        </div>
      </div>
    );
  };

  const renderDocumentTracking = () => {
    const paginatedDossiers = getPaginatedItems(getFilteredDocumentTrackingDossiers(), documentTrackingPagination);

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold mb-2">🧩 PHASE 3 & 4 : EXÉCUTION TECHNIQUE ET SUIVI ADMINISTRATIF</h1>
                <p className="text-blue-100 text-lg">Gestion combinée des phases d'exécution technique et suivi administratif</p> 
            </div>
           <div className="text-right">
              <div className="text-4xl font-bold">
                {getFilteredDocumentTrackingDossiers().length}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 w-full relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par code, client, téléphone ou adresse..."
                value={phase34SearchTerm}
                onChange={(e) => setPhase34SearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex gap-4">            
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setDocumentTrackingViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    documentTrackingViewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'
                  }`}
                  title="Vue Grille"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDocumentTrackingViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    documentTrackingViewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'
                  }`}
                  title="Vue Liste"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {getFilteredDocumentTrackingDossiers().length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Aucun dossier trouvé</h3>
            <p className="text-gray-600">
              Aucun dossier ne correspond aux critères de recherche
            </p>
          </div>
        ) : documentTrackingViewMode === 'grid' ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {paginatedDossiers.map((dossier) => renderDossierCardComplete(dossier))}
            </div>
            {renderPagination(documentTrackingPagination, setDocumentTrackingPagination)}
          </>
        ) : (
          <>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">N° Dossier</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Client</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Procédure</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Phase</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Progression</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedDossiers.map((dossier) => {
                    const progression = typeof dossier.progression_percentage === 'string' 
                      ? parseFloat(dossier.progression_percentage) || 0 
                      : dossier.progression_percentage || 0;
                      
                    return (
                      <tr key={dossier.id} className="hover:bg-gray-50 transition-colors border-b border-gray-200">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <PriorityIcon dossier={dossier} />
                            <span className="font-mono font-bold text-gray-900">{dossier.code_prestation || 'En attente'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900">{dossier.client_nom}</p>
                            <p className="text-sm text-gray-500">{dossier.client_phone}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-gray-700">{dossier.procedure_choisie}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${
                              dossier.phase_3 ? 'bg-purple-500' :
                              dossier.phase_4 ? 'bg-amber-500' :
                              dossier.phase_5 ? 'bg-teal-500' : 'bg-gray-500'
                            }`}></div>
                            <span className="text-sm font-medium text-gray-700">
                              {dossier.phase_3 ? 'Phase 3' : 
                               dossier.phase_4 ? 'Phase 4' :
                               dossier.phase_5 ? 'Phase 5' : 'Autre'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${getProgressionColor(progression)}`}
                                style={{ width: `${progression}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-gray-700">{progression}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleViewDossier(dossier)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Voir"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEditDossier(dossier)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Modifier"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleAbandonDossier(dossier)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Abandonner"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleWaitDossier(dossier)}
                              className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                              title="Mettre en attente"
                            >
                              <Clock className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleManagePhase(dossier)}
                              className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                              title="Gérer la phase"
                            >
                              <ListTodo className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {renderPagination(documentTrackingPagination, setDocumentTrackingPagination)}
          </>
        )}
      </div>
    );
  };

  const renderPhase5 = () => {
    const paginatedDossiers = getPaginatedItems(getFilteredPhase5Dossiers(), phase5Pagination);

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-8 text-white shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold mb-2">✅ PHASE 5 : LIVRAISON ET ARCHIVAGE</h1>
                <p className="text-teal-100 text-lg">Finalisation, livraison au client et archivage des dossiers</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">
                {getFilteredPhase5Dossiers().length}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 w-full relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par code, client, téléphone ou adresse..."
                value={phase5SearchTerm}
                onChange={(e) => setPhase5SearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
          </div>
        </div>

        {getFilteredPhase5Dossiers().length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Aucun dossier en Phase 5</h3>
            <p className="text-gray-600">
              Aucun dossier n'est actuellement en phase de livraison et archivage.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {paginatedDossiers.map((dossier) => renderDossierCardComplete(dossier))}
            </div>
            {renderPagination(phase5Pagination, setPhase5Pagination)}
          </>
        )}
      </div>
    );
  };

  const renderModuleContent = () => {
    switch (activeModule) {
      case 'dashboard':
        return renderDashboard();
      case 'phase3&4':
        return renderDocumentTracking();
      case 'dossiers':
        return renderDossiers();
      case 'phase1&2-traitement':
        return renderPhaseTraitement();
      case 'phase5':
        return renderPhase5();
      case 'mes-dossiers':
        return (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <UserCircle className="w-16 h-16 text-purple-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Mes Dossiers GFC</h2>
            <p className="text-gray-600">Interface utilisateur dédiée - En développement</p>
          </div>
        );
      case 'recherche':
        return (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <Search className="w-16 h-16 text-amber-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Recherche Avancée</h2>
            <p className="text-gray-600">Moteur de recherche multicritères - En développement</p>
          </div>
        );
      case 'courrier':
        return (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <Mail className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Courrier & Communication</h2>
            <p className="text-gray-600">Gestion du courrier et messagerie interne - En développement</p>
          </div>
        );
      case 'logistique':
        return (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <Package className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Logistique & Stocks</h2>
            <p className="text-gray-600">Gestion des ressources et stocks - En développement</p>
          </div>
        );
      case 'archives':
        return (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <Archive className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Archives & Bibliothèque</h2>
            <p className="text-gray-600">Archivage sécurisé et bibliothèque administrative - En développement</p>
          </div>
        );
      case 'statistiques':
        return (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <BarChart3 className="w-16 h-16 text-teal-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Rapports & Statistiques</h2>
            <p className="text-gray-600">Tableaux de bord et exports - En développement</p>
          </div>
        );
      default:
        return renderDashboard();
    }
  };

  // Effects
  useEffect(() => {
    const initialLivrablesState: Record<string, boolean[]> = {};
    Object.keys(phaseTodosConfig).forEach(phase => {
      initialLivrablesState[phase] = new Array(phaseTodosConfig[phase].deliverables.length).fill(false);
    });
    setLivrablesCompleted(initialLivrablesState);
  }, []);

  useEffect(() => {
    setDossiersPagination(prev => updatePagination(prev, filteredDossiers.length));
  }, [filteredDossiers]);

  const documentTrackingFilteredDossiers = getFilteredDocumentTrackingDossiers();
  useEffect(() => {
    setDocumentTrackingPagination(prev => updatePagination(prev, documentTrackingFilteredDossiers.length));
  }, [documentTrackingFilteredDossiers]);

  const phaseTraitementFilteredDossiers = getFilteredPhaseTraitementDossiers();
  useEffect(() => {
    setPhaseTraitementPagination(prev => updatePagination(prev, phaseTraitementFilteredDossiers.length));
  }, [phaseTraitementFilteredDossiers]);

  const phase5FilteredDossiers = getFilteredPhase5Dossiers();
  useEffect(() => {
    setPhase5Pagination(prev => updatePagination(prev, phase5FilteredDossiers.length));
  }, [phase5FilteredDossiers]);

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des données GFC...</p>
        </div>
      ) : (
        renderModuleContent()
      )}

      {/* Modal Prestation Template */}
      {showTemplate && selectedDossier && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="text-xl font-bold">Détails du Dossier</h3>
              <button
                onClick={closeAllModals}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(95vh-80px)]">
              <PrestationTemplate
                prestationData={selectedDossier}
                onClose={closeAllModals}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal Action (Abandonner/Mettre en attente) */}
      {showActionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
            <div className={`rounded-t-2xl p-6 text-white ${
              showActionModal.action === 'abandon' ? 'bg-gradient-to-r from-red-600 to-orange-600' :
              showActionModal.action === 'waiting' ? 'bg-gradient-to-r from-amber-600 to-yellow-600' :
              'bg-gradient-to-r from-red-600 to-orange-600'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  {showActionModal.action === 'abandon' && <Trash2 className="w-6 h-6" />}
                  {showActionModal.action === 'waiting' && <Clock className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="text-xl font-bold">
                    {showActionModal.action === 'abandon' ? 'Abandonner le Dossier' :
                     showActionModal.action === 'waiting' ? 'Mettre en Attente' : 'Refuser le Dossier'}
                  </h3>
                  <p className="text-white/80">
                    {showActionModal.action === 'abandon' ? 'Êtes-vous sûr de vouloir abandonner ce dossier ?' :
                     showActionModal.action === 'waiting' ? 'Veuillez indiquer la raison de la mise en attente' :
                     'Veuillez indiquer le motif du refus'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">Dossier concerné</div>
                  <div className="text-lg font-bold text-gray-800">{showActionModal.dossier.client_nom}</div>
                  <div className="text-sm text-gray-700">{showActionModal.dossier.code_prestation || 'Sans code'}</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {showActionModal.action === 'abandon' ? 'Raison de l\'abandon *' :
                     showActionModal.action === 'waiting' ? 'Raison de la mise en attente *' :
                     'Motif du refus *'}
                  </label>
                  <textarea
                    value={actionReason}
                    onChange={(e) => setActionReason(e.target.value)}
                    placeholder={
                      showActionModal.action === 'abandon' ? 'Décrivez la raison de l\'abandon...' :
                      showActionModal.action === 'waiting' ? 'Décrivez la raison de la mise en attente...' :
                      'Décrivez la raison du refus...'
                    }
                    rows={4}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  />
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={handleActionOnDossier}
                    disabled={!actionReason.trim()}
                    className={`flex-1 px-4 py-3 text-white rounded-xl flex items-center justify-center gap-2 font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                      showActionModal.action === 'abandon' ? 'bg-red-600 hover:bg-red-700' :
                      showActionModal.action === 'waiting' ? 'bg-amber-600 hover:bg-amber-700' :
                      'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    <Save className="w-5 h-5" />
                    {showActionModal.action === 'abandon' ? 'Confirmer l\'abandon' :
                     showActionModal.action === 'waiting' ? 'Confirmer la mise en attente' :
                     'Confirmer le refus'}
                  </button>
                  <button
                    onClick={() => {
                      setShowActionModal(null);
                      setActionReason('');
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

      {/* Phase Modal */}
      {showPhaseModal && editingDossier && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden">
            <div className="p-6 border-b flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <div>
                <h3 className="text-xl font-bold">
                  {phases.find(p => p.id === currentPhase)?.label || 'Gestion de Phase'} - {editingDossier.code_prestation}
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
              {!todos[currentPhase] && !phaseTodosConfig[currentPhase] ? (
                <div className="text-center py-8">
                  <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-600">Chargement des tâches...</p>
                  <button 
                    onClick={() => {
                      if (phaseTodosConfig[currentPhase]) {
                        setTodos(prev => ({
                          ...prev,
                          [currentPhase]: phaseTodosConfig[currentPhase].todos.map(todo => ({
                            ...todo,
                            completed: false
                          }))
                        }));
                        setLivrablesCompleted(prev => ({
                          ...prev,
                          [currentPhase]: new Array(phaseTodosConfig[currentPhase].deliverables.length).fill(false)
                        }));
                      }
                    }}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
                  >
                    Forcer l'initialisation
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold mb-4">📋 Liste des tâches</h4>
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

                  <div>
                    <h4 className="text-lg font-semibold mb-4">📁 Livrables</h4>
                    <div className="mt-6">
                      <h4 className="text-lg font-semibold mb-4">✅ Cocher les livrables</h4>
                      <div className="space-y-3">
                        {phaseTodosConfig[currentPhase]?.deliverables.map((deliverable, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                            <button
                              onClick={() => toggleLivrable(currentPhase, index)}
                              className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                                livrablesCompleted[currentPhase]?.[index]
                                  ? 'bg-blue-500 border-blue-500 text-white'
                                  : 'bg-white border-blue-500 text-transparent hover:bg-blue-500 hover:text-white'
                              }`}
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <span className={`flex-1 ${livrablesCompleted[currentPhase]?.[index] ? 'text-blue-900 font-medium' : 'text-blue-900'}`}>
                              {deliverable}
                            </span>
                          </div>
                        ))}
                      </div>

                      {livrablesCompleted[currentPhase] && (
                        <div className="mt-4 p-3 bg-green-50 rounded-lg">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-green-700 font-medium">
                              Progression des livrables
                            </span>
                            <span className="text-green-600 font-bold">
                              {livrablesCompleted[currentPhase].filter(l => l).length} / {livrablesCompleted[currentPhase].length}
                            </span>
                          </div>
                          <div className="w-full bg-green-200 rounded-full h-2 mt-2">
                            <div
                              className="h-2 rounded-full bg-green-500 transition-all duration-500"
                              style={{ 
                                width: `${(livrablesCompleted[currentPhase].filter(l => l).length / livrablesCompleted[currentPhase].length) * 100}%` 
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 flex flex-col gap-3">
                {phases.find(p => p.id === currentPhase)?.prevPhase && (
                  <button
                    onClick={() => handleReturnToPreviousPhase(currentPhase)}
                    className="w-full px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center justify-center gap-2 font-semibold transition-all duration-200"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Retour à {phases.find(p => p.id === phases.find(p => p.id === currentPhase)?.prevPhase)?.label}
                  </button>
                )}

                {phases.find(p => p.id === currentPhase)?.nextPhase && phases.find(p => p.id === currentPhase)?.nextPhase !== 'completed' && (
                  <button
                    onClick={() => {
                      if (currentPhase === 'phase_2') {
                        openAssignModal(editingDossier, currentPhase, phases.find(p => p.id === currentPhase)?.nextPhase!);
                      } else {
                        handleTransmitPhase(currentPhase, phases.find(p => p.id === currentPhase)?.nextPhase!);
                      }
                    }}
                    disabled={!canProceedToNextPhase(currentPhase)}
                    className={`w-full px-4 py-3 flex items-center justify-center gap-2 font-semibold transition-all duration-200 rounded-lg ${
                      canProceedToNextPhase(currentPhase)
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    }`}
                  >
                    <ArrowRight className="w-5 h-5" />
                    Transmettre à {phases.find(p => p.id === phases.find(p => p.id === currentPhase)?.nextPhase)?.label}
                    {!canProceedToNextPhase(currentPhase) && (
                      <span className="text-xs">(Tâches ou livrables incomplets)</span>
                    )}
                  </button>
                )}

                {phases.find(p => p.id === currentPhase)?.nextPhase === 'completed' && (
                  <button
                    onClick={() => handleTransmitPhase(currentPhase, 'phase_5')}
                    disabled={!canProceedToNextPhase(currentPhase)}
                    className={`w-full px-4 py-3 flex items-center justify-center gap-2 font-semibold transition-all duration-200 rounded-lg ${
                      canProceedToNextPhase(currentPhase)
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    }`}
                  >
                    <CheckCircle className="w-5 h-5" />
                    Finaliser le dossier
                    {!canProceedToNextPhase(currentPhase) && (
                      <span className="text-xs">(Tâches ou livrables incomplets)</span>
                    )}
                  </button>
                )}

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => handleAbandonDossier(editingDossier)}
                    className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2 font-semibold transition-all duration-200"
                  >
                    <Trash2 className="w-5 h-5" />
                    Abandonner le dossier
                  </button>
                  <button
                    onClick={() => handleWaitDossier(editingDossier)}
                    className="flex-1 px-4 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 flex items-center justify-center gap-2 font-semibold transition-all duration-200"
                  >
                    <Clock className="w-5 h-5" />
                    Mettre en attente
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assign Modal */}
      {assignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Assigner à la {phases.find(p => p.id === assignModal.toPhase)?.label}</h3>
            
            <div className="mb-4 p-4 bg-gray-50 rounded-xl">
              <p><strong>Dossier:</strong> {assignModal.dossier.code_prestation}</p>
              <p><strong>Client:</strong> {assignModal.dossier.client_nom}</p>
              <p><strong>Procédure:</strong> {assignModal.dossier.procedure_choisie}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assigner à *
                </label>
                <input
                  type="text"
                  value={assignTo}
                  onChange={(e) => setAssignTo(e.target.value)}
                  placeholder="Spécifiez à qui assigner le dossier..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleTransmitPhase(assignModal.fromPhase, assignModal.toPhase, assignTo)}
                  disabled={!assignTo.trim()}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-purple-300 disabled:cursor-not-allowed"
                >
                  Confirmer l'assignation
                </button>
                <button
                  onClick={() => {
                    setAssignModal(null);
                    setAssignTo('');
                  }}
                  className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
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

export default LandCadastralDashboard;