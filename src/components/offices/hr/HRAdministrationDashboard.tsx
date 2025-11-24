import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  FileText,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  UserCheck,
  Clock,
  Search,
  Filter,
  Download,
  BarChart3,
  Shield,
  Award,
  MessageSquare,
  Mail,
  Settings,
  Bell,
  Eye,
  Edit,
  Trash2,
  Plus,
  MoreVertical,
  ChevronDown,
  Upload,
  FileUp,
  Calculator,
  Briefcase,
  Move,
  LogOut,
  Star,
  Target,
  PieChart,
  FileBarChart
} from 'lucide-react';
import { usePersonnel, MultiAssignments } from '../../../hooks/usePersonnel';
import { useSystemUsers, SystemUser } from '../../../hooks/useSystemUsers';
import { PersonnelRegistrationForm } from '../../forms/PersonnelRegistrationForm';
import { EnhancedPersonnelRegistrationForm } from '../../forms/EnhancedPersonnelRegistrationForm';
import { AssignmentForm } from '../../forms/AssignmentForm';
import { HRPersonnel, HRAlert, User, Contract, Payroll, Attendance, Evaluation } from '../../../types';
import { supabase } from '../../../lib/supabase';

interface HRAdministrationDashboardProps {
  user: User;
  activeSection: string;
}

// Mock data for demonstration
const mockContracts: Contract[] = [
  {
    id: '1',
    personnel_id: '1',
    type_contrat: 'CDI',
    date_debut: '2024-01-15',
    date_fin: null,
    salaire_base: 2500000,
    statut: 'Actif',
    periode_essai_fin: '2024-04-15',
    created_at: '2024-01-15'
  },
  {
    id: '2',
    personnel_id: '2',
    type_contrat: 'CDD',
    date_debut: '2024-02-01',
    date_fin: '2024-12-31',
    salaire_base: 1800000,
    statut: 'Actif',
    periode_essai_fin: '2024-05-01',
    created_at: '2024-02-01'
  }
];

const mockPayroll: Payroll[] = [
  {
    id: '1',
    personnel_id: '1',
    mois: '2024-03',
    salaire_brut: 2500000,
    primes: 300000,
    retenues: 450000,
    salaire_net: 2350000,
    statut: 'Payé',
    date_paiement: '2024-03-31'
  }
];

const mockAttendance: Attendance[] = [
  {
    id: '1',
    personnel_id: '1',
    date: '2024-03-20',
    heure_arrivee: '08:00',
    heure_depart: '17:00',
    statut: 'Présent',
    heures_supp: 0
  }
];

const mockEvaluations: Evaluation[] = [
  {
    id: '1',
    personnel_id: '1',
    periode: '2024-T1',
    date_evaluation: '2024-03-15',
    evaluateur_id: 'manager1',
    note_globale: 4.2,
    competences: {},
    objectifs_atteints: 85,
    statut: 'Terminé'
  }
];

const HRAdministrationDashboard: React.FC<HRAdministrationDashboardProps> = ({ user, activeSection }) => {
  const {
    personnel,
    loading,
    addPersonnel,
    addPersonnelWithAssignments,
    updatePersonnel,
    validatePersonnel,
    getActiveAlerts,
    getPersonnelStats,
  } = usePersonnel();

  const {
    users: systemUsers,
    loading: usersLoading,
    getUsersByOffice,
    getAvailableUsers,
  } = useSystemUsers();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [showEnhancedForm, setShowEnhancedForm] = useState(false);
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [newPersonnelId, setNewPersonnelId] = useState<string | null>(null);
  const [newPersonnelData, setNewPersonnelData] = useState<Partial<HRPersonnel> | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [alerts, setAlerts] = useState<HRAlert[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [contracts, setContracts] = useState<Contract[]>(mockContracts);
  const [payrolls, setPayrolls] = useState<Payroll[]>(mockPayroll);
  const [attendances, setAttendances] = useState<Attendance[]>(mockAttendance);
  const [evaluations, setEvaluations] = useState<Evaluation[]>(mockEvaluations);

  useEffect(() => {
    loadAlerts();
    loadStats();
  }, []);

  const loadAlerts = async () => {
    const result = await getActiveAlerts();
    if (result.success && result.data) {
      setAlerts(result.data);
    }
  };

  const loadStats = async () => {
    const result = await getPersonnelStats();
    if (result.success && result.data) {
      setStats(result.data);
    }
  };

  const handleAddPersonnel = async (data: Partial<HRPersonnel>) => {
    const result = await addPersonnel(data);
    if (result.success) {
      setShowRegistrationForm(false);
      setNewPersonnelData(data);
      setNewPersonnelId(result.data?.id || null);
      setShowAssignmentForm(true);
      loadStats();
    }
  };

  const handleAddPersonnelWithAssignments = async (
    data: Partial<HRPersonnel>,
    assignments: MultiAssignments
  ) => {
    const result = await addPersonnelWithAssignments(data, assignments);
    if (result.success) {
      setShowEnhancedForm(false);
      loadStats();
      alert('Personnel enregistré avec succès avec toutes ses affectations!');
    } else {
      alert('Erreur: ' + result.error);
    }
  };

  const handleAssignOffices = async (assignments: MultiAssignments) => {
    if (!newPersonnelId || !newPersonnelData) {
      alert('Erreur: Données du personnel non trouvées');
      return;
    }

    try {
      const { data: existingUser, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('email', newPersonnelData.email_personnel)
        .maybeSingle();

      if (userError) {
        alert('Erreur lors de la recherche de l\'utilisateur: ' + userError.message);
        return;
      }

      if (!existingUser) {
        alert('Utilisateur non trouvé dans la table users. Le personnel doit être validé et actif.');
        setShowAssignmentForm(false);
        setNewPersonnelId(null);
        setNewPersonnelData(null);
        return;
      }

      const userId = existingUser.id;

      if (assignments.departments.length > 0) {
        const deptAssignments = assignments.departments.map((dept) => ({
          user_id: userId,
          department_id: dept.id,
          granted_at: new Date().toISOString(),
        }));

        const { error: deptError } = await supabase
          .from('user_department_access')
          .insert(deptAssignments);

        if (deptError) {
          console.error('Erreur départements:', deptError);
        }
      }

      if (assignments.divisions.length > 0) {
        const divAssignments = assignments.divisions.map((div) => ({
          user_id: userId,
          division_id: div.id,
          granted_at: new Date().toISOString(),
        }));

        const { error: divError } = await supabase
          .from('user_division_access')
          .insert(divAssignments);

        if (divError) {
          console.error('Erreur divisions:', divError);
        }
      }

      if (assignments.offices.length > 0) {
        const officeAssignments = assignments.offices.map((office) => ({
          user_id: userId,
          office_id: office.id,
          office_name: office.name,
          is_primary: office.is_primary,
          role_in_office: newPersonnelData?.poste_occupe || 'Employee',
          access_level: 'Editor',
          can_view_documents: true,
          can_create_documents: true,
          can_validate_documents: false,
          can_assign_tasks: false,
          assigned_date: new Date().toISOString(),
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }));

        const { error: officeError } = await supabase
          .from('user_offices')
          .insert(officeAssignments);

        if (officeError) {
          console.error('Erreur bureaux:', officeError);
          alert('Erreur lors de l\'ajout des bureaux: ' + officeError.message);
          return;
        }
      }

      alert('Affectations ajoutées avec succès!');
      setShowAssignmentForm(false);
      setNewPersonnelId(null);
      setNewPersonnelData(null);
      loadStats();
    } catch (err) {
      alert('Erreur lors de l\'ajout des affectations: ' + (err instanceof Error ? err.message : 'Erreur inconnue'));
    }
  };

  const handleSkipAssignments = () => {
    setShowAssignmentForm(false);
    setNewPersonnelId(null);
    setNewPersonnelData(null);
    alert('Personnel enregistré sans affectations supplémentaires');
  };

  const handleValidation = async (id: string, type: 'chef' | 'drh') => {
    await validatePersonnel(id, type, 'current-user-id');
    loadStats();
  };

  const filteredPersonnel = personnel.filter((p) => {
    const matchesSearch =
      p.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.prenoms?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.matricule?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === 'all' ||
      (filterStatus === 'active' && p.is_active) ||
      (filterStatus === 'pending' && p.statut_validation === 'En cours') ||
      (filterStatus === 'validated' && p.statut_validation === 'Actif');

    return matchesSearch && matchesFilter;
  });

  // New Components for Enhanced HR Dashboard

  const ContractsManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des Contrats</h2>
          <p className="text-gray-600 mt-1">Suivi des contrats, avenants et périodes d'essai</p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Nouveau Contrat
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <FileText className="w-8 h-8 opacity-80" />
            <span className="text-3xl font-bold">{contracts.length}</span>
          </div>
          <h3 className="text-lg font-semibold">Contrats Actifs</h3>
          <p className="text-sm opacity-80 mt-1">Total des contrats</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <AlertCircle className="w-8 h-8 opacity-80" />
            <span className="text-3xl font-bold">3</span>
          </div>
          <h3 className="text-lg font-semibold">Fin de Période Essai</h3>
          <p className="text-sm opacity-80 mt-1">Dans les 30 jours</p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Clock className="w-8 h-8 opacity-80" />
            <span className="text-3xl font-bold">2</span>
          </div>
          <h3 className="text-lg font-semibold">Contrats à Renouveler</h3>
          <p className="text-sm opacity-80 mt-1">Dans 60 jours</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Move className="w-8 h-8 opacity-80" />
            <span className="text-3xl font-bold">5</span>
          </div>
          <h3 className="text-lg font-semibold">Mouvements</h3>
          <p className="text-sm opacity-80 mt-1">Ce mois-ci</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Liste des Contrats</h3>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-64"
                />
              </div>
              <select className="px-4 py-2 border border-gray-300 rounded-lg">
                <option>Tous les statuts</option>
                <option>Actif</option>
                <option>En attente</option>
                <option>Expiré</option>
              </select>
            </div>
          </div>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Collaborateur
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type Contrat
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dates
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Salaire Base
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {contracts.map((contract) => (
              <tr key={contract.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {personnel.find(p => p.id === contract.personnel_id)?.nom} {personnel.find(p => p.id === contract.personnel_id)?.prenoms}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {contract.type_contrat}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div>Début: {contract.date_debut}</div>
                  {contract.date_fin && <div>Fin: {contract.date_fin}</div>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {contract.salaire_base?.toLocaleString()} FCFA
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    contract.statut === 'Actif' ? 'bg-green-100 text-green-800' :
                    contract.statut === 'En attente' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {contract.statut}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center gap-2">
                    <button className="p-1 text-blue-600 hover:text-blue-800">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-green-600 hover:text-green-800">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-red-600 hover:text-red-800">
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
  );

  const PayrollManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion de la Paie</h2>
          <p className="text-gray-600 mt-1">Calcul des salaires, primes et obligations sociales</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Calculer Paie
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2">
            <Download className="w-5 h-5" />
            Exporter CNPS
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8 opacity-80" />
            <span className="text-3xl font-bold">28.5M</span>
          </div>
          <h3 className="text-lg font-semibold">Masse Salariale</h3>
          <p className="text-sm opacity-80 mt-1">Mois en cours</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <FileUp className="w-8 h-8 opacity-80" />
            <span className="text-3xl font-bold">45</span>
          </div>
          <h3 className="text-lg font-semibold">Bullets Générés</h3>
          <p className="text-sm opacity-80 mt-1">Ce mois</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Clock className="w-8 h-8 opacity-80" />
            <span className="text-3xl font-bold">3</span>
          </div>
          <h3 className="text-lg font-semibold">En Attente</h3>
          <p className="text-sm opacity-80 mt-1">Validations requises</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Historique de Paie</h3>
            <div className="flex items-center gap-4">
              <select className="px-4 py-2 border border-gray-300 rounded-lg">
                <option>Mars 2024</option>
                <option>Février 2024</option>
                <option>Janvier 2024</option>
              </select>
            </div>
          </div>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Collaborateur
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Période
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Salaire Brut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Retenues
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Net à Payer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {payrolls.map((payroll) => (
              <tr key={payroll.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {personnel.find(p => p.id === payroll.personnel_id)?.nom} {personnel.find(p => p.id === payroll.personnel_id)?.prenoms}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {payroll.mois}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {payroll.salaire_brut?.toLocaleString()} FCFA
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {payroll.retenues?.toLocaleString()} FCFA
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {payroll.salaire_net?.toLocaleString()} FCFA
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    payroll.statut === 'Payé' ? 'bg-green-100 text-green-800' :
                    payroll.statut === 'En attente' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {payroll.statut}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      Voir
                    </button>
                    <button className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs flex items-center gap-1">
                      <Download className="w-3 h-3" />
                      PDF
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const AttendanceManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des Présences</h2>
          <p className="text-gray-600 mt-1">Suivi des pointages, absences et congés</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Planning Congés
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2">
            <Download className="w-5 h-5" />
            Exporter Rapport
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle className="w-8 h-8 opacity-80" />
            <span className="text-3xl font-bold">42</span>
          </div>
          <h3 className="text-lg font-semibold">Présents Aujourd'hui</h3>
          <p className="text-sm opacity-80 mt-1">Sur 45 collaborateurs</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Clock className="w-8 h-8 opacity-80" />
            <span className="text-3xl font-bold">8</span>
          </div>
          <h3 className="text-lg font-semibold">En Congé</h3>
          <p className="text-sm opacity-80 mt-1">Cette semaine</p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <AlertCircle className="w-8 h-8 opacity-80" />
            <span className="text-3xl font-bold">3</span>
          </div>
          <h3 className="text-lg font-semibold">Absences Non Justifiées</h3>
          <p className="text-sm opacity-80 mt-1">Ce mois</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 opacity-80" />
            <span className="text-3xl font-bold">96%</span>
          </div>
          <h3 className="text-lg font-semibold">Taux de Présence</h3>
          <p className="text-sm opacity-80 mt-1">Moyenne mensuelle</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Demandes de Congé en Attente</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Jean Dupont</h4>
                  <p className="text-sm text-gray-600">Congé annuel • 15-22 Mars 2024</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-green-600 text-white rounded text-xs">Approuver</button>
                  <button className="px-3 py-1 bg-red-600 text-white rounded text-xs">Refuser</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistiques des Absences</h3>
          <div className="space-y-3">
            {[
              { type: 'Maladie', count: 12, color: 'bg-orange-500' },
              { type: 'Congé Annuel', count: 45, color: 'bg-blue-500' },
              { type: 'Formation', count: 8, color: 'bg-green-500' },
              { type: 'Exceptionnel', count: 3, color: 'bg-purple-500' }
            ].map((stat, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-700">{stat.type}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className={`${stat.color} h-2 rounded-full`}
                      style={{ width: `${(stat.count / 68) * 100}%` }}
                    />
                  </div>
                  <span className="font-medium text-gray-900 w-8 text-right">{stat.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const EvaluationsManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Évaluations et Performance</h2>
          <p className="text-gray-600 mt-1">Suivi des performances individuelles et collectives</p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Nouvelle Évaluation
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Target className="w-8 h-8 opacity-80" />
            <span className="text-3xl font-bold">85%</span>
          </div>
          <h3 className="text-lg font-semibold">Objectifs Atteints</h3>
          <p className="text-sm opacity-80 mt-1">Moyenne trimestrielle</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Star className="w-8 h-8 opacity-80" />
            <span className="text-3xl font-bold">4.2</span>
          </div>
          <h3 className="text-lg font-semibold">Note Moyenne</h3>
          <p className="text-sm opacity-80 mt-1">Sur 5 points</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Clock className="w-8 h-8 opacity-80" />
            <span className="text-3xl font-bold">12</span>
          </div>
          <h3 className="text-lg font-semibold">En Cours</h3>
          <p className="text-sm opacity-80 mt-1">Évaluations</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Award className="w-8 h-8 opacity-80" />
            <span className="text-3xl font-bold">8</span>
          </div>
          <h3 className="text-lg font-semibold">Promotions</h3>
          <p className="text-sm opacity-80 mt-1">Cette année</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Historique des Évaluations</h3>
            <div className="flex items-center gap-4">
              <select className="px-4 py-2 border border-gray-300 rounded-lg">
                <option>T1 2024</option>
                <option>T4 2023</option>
                <option>T3 2023</option>
              </select>
            </div>
          </div>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Collaborateur
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Période
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Note Globale
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Objectifs
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Évaluateur
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {evaluations.map((evaluation) => (
              <tr key={evaluation.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {personnel.find(p => p.id === evaluation.personnel_id)?.nom} {personnel.find(p => p.id === evaluation.personnel_id)?.prenoms}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {evaluation.periode}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">{evaluation.note_globale}/5</span>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${(evaluation.note_globale / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {evaluation.objectifs_atteints}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Manager RH
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    evaluation.statut === 'Terminé' ? 'bg-green-100 text-green-800' :
                    evaluation.statut === 'En cours' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {evaluation.statut}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs">
                      Détails
                    </button>
                    <button className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs">
                      PDF
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const ReportsAnalytics = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Rapports et Statistiques</h2>
          <p className="text-gray-600 mt-1">Tableaux de bord dynamiques et analyses RH</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
            <Download className="w-5 h-5" />
            Exporter Excel
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2">
            <FileBarChart className="w-5 h-5" />
            Rapport Mensuel
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Évolution des Effectifs</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <BarChart3 className="w-16 h-16 text-gray-300" />
            <span className="ml-2 text-gray-500">Graphique d'évolution des effectifs</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition par Département</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <PieChart className="w-16 h-16 text-gray-300" />
            <span className="ml-2 text-gray-500">Graphique de répartition</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Indicateurs Clés</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Turnover</span>
              <span className="font-semibold text-green-600">8.2%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Taux d'absentéisme</span>
              <span className="font-semibold text-orange-600">3.1%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Coût recrutement moyen</span>
              <span className="font-semibold text-blue-600">450K FCFA</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Satisfaction collaborateurs</span>
              <span className="font-semibold text-purple-600">4.3/5</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 md:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Rapports Disponibles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: 'Rapport de Paie Mensuel', period: 'Mars 2024', type: 'PDF' },
              { title: 'Bilan Social Trimestriel', period: 'T1 2024', type: 'Excel' },
              { title: 'Analyse du Turnover', period: '2024', type: 'Power BI' },
              { title: 'Tableau de Bord RH', period: 'Temps réel', type: 'Dashboard' }
            ].map((report, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{report.title}</h4>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">{report.type}</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">Période: {report.period}</p>
                <button className="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  Télécharger
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const InternalCommunication = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Communication Interne</h2>
          <p className="text-gray-600 mt-1">Messagerie sécurisée et diffusion des informations</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Nouveau Message
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Publier Note
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Messages Réçus</h3>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    JD
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-gray-900">Jean Dupont</h4>
                      <span className="text-xs text-gray-500">Il y a 2h</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Demande d'information concernant la nouvelle politique de congés...</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Direction Générale</span>
                      <span>•</span>
                      <span>Urgent</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes de Service Récentes</h3>
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="p-3 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-900 text-sm mb-1">Nouvelle politique de télétravail</h4>
                  <p className="text-xs text-gray-600 mb-2">Mise à jour des règles de télétravail à compter du 1er avril</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>15 Mars 2024</span>
                    <button className="text-blue-600 hover:text-blue-800">Lire</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contacts Rapides</h3>
            <div className="space-y-2">
              {[
                { name: 'DRH', count: 3, unread: true },
                { name: 'Direction Générale', count: 1, unread: true },
                { name: 'Comptabilité', count: 0, unread: false },
                { name: 'Services Techniques', count: 2, unread: true }
              ].map((contact, index) => (
                <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                  <span className="text-sm text-gray-700">{contact.name}</span>
                  {contact.unread && (
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                      {contact.count}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 opacity-80" />
            <span className="text-3xl font-bold">{stats?.total || 0}</span>
          </div>
          <h3 className="text-lg font-semibold">Effectif Total</h3>
          <p className="text-sm opacity-80 mt-1">Tous statuts confondus</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle className="w-8 h-8 opacity-80" />
            <span className="text-3xl font-bold">{stats?.active || 0}</span>
          </div>
          <h3 className="text-lg font-semibold">Personnel Actif</h3>
          <p className="text-sm opacity-80 mt-1">Collaborateurs validés</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Clock className="w-8 h-8 opacity-80" />
            <span className="text-3xl font-bold">{stats?.pending || 0}</span>
          </div>
          <h3 className="text-lg font-semibold">En attente</h3>
          <p className="text-sm opacity-80 mt-1">Validations requises</p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <AlertCircle className="w-8 h-8 opacity-80" />
            <span className="text-3xl font-bold">{alerts.length}</span>
          </div>
          <h3 className="text-lg font-semibold">Alertes Actives</h3>
          <p className="text-sm opacity-80 mt-1">Nécessitent une action</p>
        </div>
      </div>

      {alerts.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            Alertes et Notifications
          </h3>
          <div className="space-y-3">
            {alerts.slice(0, 5).map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border-l-4 ${
                  alert.priorite === 'Urgente'
                    ? 'border-red-500 bg-red-50'
                    : alert.priorite === 'Haute'
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-blue-500 bg-blue-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{alert.titre}</h4>
                    <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                    {alert.date_echeance && (
                      <p className="text-xs text-gray-500 mt-2">
                        Échéance: {new Date(alert.date_echeance).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      alert.priorite === 'Urgente'
                        ? 'bg-red-100 text-red-800'
                        : alert.priorite === 'Haute'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {alert.priorite}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Répartition par Type de Contrat
          </h3>
          <div className="space-y-3">
            {stats?.byContract &&
              Object.entries(stats.byContract).map(([type, count]: [string, any]) => (
                <div key={type} className="flex items-center justify-between">
                  <span className="text-gray-700">{type}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{ width: `${(count / stats.total) * 100}%` }}
                      />
                    </div>
                    <span className="font-medium text-gray-900 w-12 text-right">{count}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Répartition par Division
          </h3>
          <div className="space-y-3">
            {stats?.byDivision &&
              Object.entries(stats.byDivision).map(([division, count]: [string, any]) => (
                <div key={division} className="flex items-center justify-between">
                  <span className="text-gray-700">{division}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${(count / stats.total) * 100}%` }}
                      />
                    </div>
                    <span className="font-medium text-gray-900 w-12 text-right">{count}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPersonnelList = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher par nom, prénom ou matricule..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-80"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="all">Tous</option>
            <option value="active">Actifs</option>
            <option value="pending">En attente</option>
            <option value="validated">Validés</option>
          </select>
        </div>

        <button
          onClick={() => setShowRegistrationForm(true)}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
        >
          <UserPlus className="w-5 h-5" />
          Nouveau Personnel
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Matricule
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nom & Prénoms
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Poste
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Division
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredPersonnel.map((person) => (
              <tr key={person.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {person.matricule || 'En attente'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {person.nom} {person.prenoms}
                    </div>
                    <div className="text-sm text-gray-500">{person.email_personnel}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {person.poste_occupe}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {person.division_affectation}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      person.statut_validation === 'Actif'
                        ? 'bg-green-100 text-green-800'
                        : person.statut_validation === 'Validé DRH'
                        ? 'bg-blue-100 text-blue-800'
                        : person.statut_validation === 'Validé Chef Bureau'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {person.statut_validation}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center gap-2">
                    {person.statut_validation === 'En cours' && (
                      <button
                        onClick={() => handleValidation(person.id, 'chef')}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
                      >
                        Valider
                      </button>
                    )}
                    {person.statut_validation === 'Validé Chef Bureau' && (
                      <button
                        onClick={() => handleValidation(person.id, 'drh')}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs"
                      >
                        Activer
                      </button>
                    )}
                    <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-xs">
                      Détails
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const filteredUsers = systemUsers.filter((u) => {
    const matchesSearch =
      u.full_name?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      u.role_name?.toLowerCase().includes(userSearchTerm.toLowerCase());
    return matchesSearch;
  });

  const renderUsersManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des Utilisateurs Système</h2>
          <p className="text-gray-600 mt-1">
            Vue d'ensemble des utilisateurs enregistrés dans le système
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 opacity-80" />
            <span className="text-3xl font-bold">{systemUsers.length}</span>
          </div>
          <h3 className="text-lg font-semibold">Total Utilisateurs</h3>
          <p className="text-sm opacity-80 mt-1">Tous les utilisateurs</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle className="w-8 h-8 opacity-80" />
            <span className="text-3xl font-bold">
              {systemUsers.filter(u => u.is_active).length}
            </span>
          </div>
          <h3 className="text-lg font-semibold">Utilisateurs Actifs</h3>
          <p className="text-sm opacity-80 mt-1">Comptes actifs</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Shield className="w-8 h-8 opacity-80" />
            <span className="text-3xl font-bold">
              {systemUsers.filter(u => u.access_level === 'Admin' || u.access_level === 'Super Admin').length}
            </span>
          </div>
          <h3 className="text-lg font-semibold">Administrateurs</h3>
          <p className="text-sm opacity-80 mt-1">Accès élevé</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Clock className="w-8 h-8 opacity-80" />
            <span className="text-3xl font-bold">
              {systemUsers.filter(u => u.is_available).length}
            </span>
          </div>
          <h3 className="text-lg font-semibold">Disponibles</h3>
          <p className="text-sm opacity-80 mt-1">Prêts pour attribution</p>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher par nom, email ou rôle..."
            value={userSearchTerm}
            onChange={(e) => setUserSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Utilisateur
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type & Rôle
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Affectation
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Accès & Permissions
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Charge
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredUsers.map((usr) => (
              <tr key={usr.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {usr.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{usr.full_name}</div>
                      <div className="text-sm text-gray-500">{usr.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      usr.user_type === 'System Admin' ? 'bg-purple-100 text-purple-800' :
                      usr.user_type === 'Administrator' ? 'bg-blue-100 text-blue-800' :
                      usr.user_type === 'Manager' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {usr.user_type}
                    </span>
                    <div className="text-xs text-gray-500 mt-1">{usr.role_name}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {usr.division_id && <div>Division: {usr.division_id}</div>}
                    {usr.office_id && <div className="text-xs text-gray-500">Bureau: {usr.office_id}</div>}
                    {!usr.division_id && !usr.office_id && <span className="text-gray-400">Non affecté</span>}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      usr.access_level === 'Super Admin' ? 'bg-red-100 text-red-800' :
                      usr.access_level === 'Admin' ? 'bg-orange-100 text-orange-800' :
                      usr.access_level === 'Manager' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {usr.access_level}
                    </span>
                    <div className="flex gap-1 mt-2">
                      {usr.can_assign_documents && (
                        <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded text-xs">Assign</span>
                      )}
                      {usr.can_approve_documents && (
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">Approve</span>
                      )}
                      {usr.can_manage_users && (
                        <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded text-xs">Manage</span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{usr.current_workload}</span>
                      <span className="text-gray-500">/ {usr.max_assignments}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className={`h-2 rounded-full ${
                          (usr.current_workload / usr.max_assignments) * 100 > 80 ? 'bg-red-500' :
                          (usr.current_workload / usr.max_assignments) * 100 > 60 ? 'bg-orange-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${Math.min((usr.current_workload / usr.max_assignments) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col gap-1">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium text-center ${
                      usr.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {usr.is_active ? 'Actif' : 'Inactif'}
                    </span>
                    {usr.is_active && (
                      <span className={`px-3 py-1 rounded-full text-xs font-medium text-center ${
                        usr.is_available ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {usr.is_available ? 'Disponible' : 'Occupé'}
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredUsers.length === 0 && (
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Aucun utilisateur trouvé
          </h3>
          <p className="text-gray-600">
            {userSearchTerm
              ? 'Essayez de modifier votre recherche'
              : 'Les utilisateurs enregistrés apparaîtront ici'}
          </p>
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard-rh':
      case 'dashboard':
        return renderDashboard();
      case 'enregistrement-collaborateur':
        if (showEnhancedForm) {
          return (
            <EnhancedPersonnelRegistrationForm
              onSubmit={handleAddPersonnelWithAssignments}
              onCancel={() => setShowEnhancedForm(false)}
            />
          );
        }

        if (showAssignmentForm && newPersonnelData) {
          return (
            <AssignmentForm
              personnelName={`${newPersonnelData.nom} ${newPersonnelData.prenoms}`}
              personnelPoste={newPersonnelData.poste_occupe || 'N/A'}
              onSubmit={handleAssignOffices}
              onSkip={handleSkipAssignments}
            />
          );
        }

        if (showRegistrationForm) {
          return (
            <PersonnelRegistrationForm
              onSubmit={handleAddPersonnel}
              onCancel={() => setShowRegistrationForm(false)}
            />
          );
        }

        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Enregistrement des Collaborateurs</h2>
                <p className="text-gray-600 mt-1">
                  Choisissez le mode d'enregistrement approprié
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowRegistrationForm(true)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <UserPlus className="w-5 h-5" />
                  Mode Standard (puis affectations)
                </button>
                <button
                  onClick={() => setShowEnhancedForm(true)}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                >
                  <UserPlus className="w-5 h-5" />
                  Mode Complet (tout en un)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Mode Standard</h3>
                <p className="text-sm text-blue-800 mb-4">
                  Enregistrez d'abord les informations personnelles, professionnelles et salariales (5 étapes),
                  puis assignez les départements, divisions et bureaux dans une étape séparée.
                </p>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>✓ Processus en 2 phases</li>
                  <li>✓ Plus simple et guidé</li>
                  <li>✓ Possibilité de passer les affectations</li>
                </ul>
              </div>

              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-indigo-900 mb-2">Mode Complet</h3>
                <p className="text-sm text-indigo-800 mb-4">
                  Enregistrez toutes les informations en une seule fois, incluant les affectations multiples
                  aux départements, divisions et bureaux (6 étapes).
                </p>
                <ul className="text-sm text-indigo-700 space-y-1">
                  <li>✓ Tout en un formulaire</li>
                  <li>✓ Plus rapide si tout est connu</li>
                  <li>✓ Affectations obligatoires</li>
                </ul>
              </div>
            </div>

            {renderPersonnelList()}
          </div>
        );
      case 'contrats-mouvements':
        return <ContractsManagement />;
      case 'paie-obligations':
        return <PayrollManagement />;
      case 'presences-conges':
        return <AttendanceManagement />;
      case 'evaluations-performance':
        return <EvaluationsManagement />;
      case 'carrieres-promotions':
        return (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Gestion des Carrières et Promotions
            </h3>
            <p className="text-gray-600">
              Suivi de l'évolution professionnelle et planification des parcours
            </p>
          </div>
        );
      case 'discipline-sanctions':
        return (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Discipline et Sanctions
            </h3>
            <p className="text-gray-600">
              Gestion disciplinaire et traçabilité juridique
            </p>
          </div>
        );
      case 'rapports-statistiques-rh':
        return <ReportsAnalytics />;
      case 'communication-rh':
        return <InternalCommunication />;
      default:
        return renderUsersManagement();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {renderContent()}
    </div>
  );
};

export default HRAdministrationDashboard;