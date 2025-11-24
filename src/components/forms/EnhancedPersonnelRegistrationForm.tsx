import { useState } from 'react';
import {
  User,
  Calendar,
  CreditCard,
  Briefcase,
  DollarSign,
  FileText,
  CheckCircle,
  Building,
  Plus,
  X,
  MapPin,
  Phone,
  Mail,
  Shield,
  Clock,
  Home,
  Download,
  Upload,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { HRPersonnel } from '../../types';
import { DEPARTMENTS, DIVISIONS } from '../../constants';

interface EnhancedPersonnelRegistrationFormProps {
  onSubmit: (data: Partial<HRPersonnel>, assignments: MultiAssignments) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<HRPersonnel>;
}

export interface MultiAssignments {
  departments: Array<{ id: string; name: string; is_primary: boolean }>;
  divisions: Array<{ id: string; name: string; is_primary: boolean }>;
  offices: Array<{ id: string; name: string; division_id?: string; is_primary: boolean }>;
}

export function EnhancedPersonnelRegistrationForm({
  onSubmit,
  onCancel,
  initialData,
}: EnhancedPersonnelRegistrationFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<HRPersonnel>>(
    initialData || {
      sexe: 'Masculin',
      nationalite: 'Camerounaise',
      etat_civil: 'Célibataire',
      nombre_enfants: 0,
      type_contrat: 'CDI',
      periode_essai: false,
      statut_emploi: 'Permanent',
      mode_travail: 'Présentiel',
      mode_paiement: 'Virement',
      periodicite_paie: 'Mensuelle',
      lieu_travail: 'Siège',
      niveau_confidentialite: 'Moyen',
      profil_acces: 'Employé',
      statut_validation: 'En cours',
      is_active: true,
      horaires_travail: '08:00-17:00',
      primes_indemnites: {},
      avantages_nature: {},
      acces_modules: [],
      documents_remis: [],
      equipements_remis: [],
    }
  );

  const [assignments, setAssignments] = useState<MultiAssignments>({
    departments: [],
    divisions: [],
    offices: [],
  });

  const [expandedDepartments, setExpandedDepartments] = useState<Set<string>>(new Set());
  const [expandedDivisions, setExpandedDivisions] = useState<Set<string>>(new Set());
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [selectedDivision, setSelectedDivision] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const steps = [
    { id: 1, name: 'Informations personnelles', icon: User },
    { id: 2, name: 'Identification & Admin', icon: CreditCard },
    { id: 3, name: 'Informations professionnelles', icon: Briefcase },
    { id: 4, name: 'Informations salariales', icon: DollarSign },
    { id: 5, name: 'Affectations multiples', icon: Building },
    { id: 6, name: 'Documents & Finalisation', icon: FileText },
  ];

  const toggleDepartment = (deptId: string) => {
    setExpandedDepartments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(deptId)) {
        newSet.delete(deptId);
        setSelectedDepartment(null);
      } else {
        newSet.add(deptId);
        setSelectedDepartment(deptId);
        setSelectedDivision(null);
      }
      return newSet;
    });
  };

  const toggleDivision = (divId: string) => {
    setExpandedDivisions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(divId)) {
        newSet.delete(divId);
        setSelectedDivision(null);
      } else {
        newSet.add(divId);
        setSelectedDivision(divId);
        setSelectedDepartment(null);
      }
      return newSet;
    });
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.nom) newErrors.nom = 'Nom requis';
        if (!formData.prenoms) newErrors.prenoms = 'Prénoms requis';
        if (!formData.date_naissance) newErrors.date_naissance = 'Date de naissance requise';
        if (!formData.lieu_naissance) newErrors.lieu_naissance = 'Lieu de naissance requis';
        if (!formData.adresse_complete) newErrors.adresse_complete = 'Adresse requise';
        if (!formData.telephone_personnel) newErrors.telephone_personnel = 'Téléphone requis';
        if (!formData.email_personnel) newErrors.email_personnel = 'Email requis';
        if (!formData.urgence_nom) newErrors.urgence_nom = 'Contact d\'urgence requis';
        if (!formData.urgence_telephone) newErrors.urgence_telephone = 'Téléphone d\'urgence requis';
        break;
      case 2:
        if (!formData.cni_numero) newErrors.cni_numero = 'Numéro CNI requis';
        if (!formData.cni_date_delivrance) newErrors.cni_date_delivrance = 'Date de délivrance requise';
        if (!formData.cni_lieu_delivrance) newErrors.cni_lieu_delivrance = 'Lieu de délivrance requis';
        break;
      case 3:
        if (!formData.poste_occupe) newErrors.poste_occupe = 'Poste requis';
        if (!formData.categorie_niveau) newErrors.categorie_niveau = 'Catégorie requise';
        if (!formData.fonction_exacte) newErrors.fonction_exacte = 'Fonction requise';
        break;
      case 4:
        if (!formData.salaire_base || formData.salaire_base <= 0)
          newErrors.salaire_base = 'Salaire de base requis';
        break;
      case 5:
        if (assignments.divisions.length === 0 && assignments.offices.length === 0) {
          newErrors.assignments = 'Au moins une affectation (division ou bureau) est requise';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(currentStep)) {
      await onSubmit(formData, assignments);
    }
  };

  const updateField = (field: keyof HRPersonnel, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const addDepartmentAssignment = (deptId: string, deptName: string) => {
    if (!assignments.departments.find((d) => d.id === deptId)) {
      setAssignments((prev) => ({
        ...prev,
        departments: [
          ...prev.departments,
          { id: deptId, name: deptName, is_primary: prev.departments.length === 0 },
        ],
      }));
    }
  };

  const removeDepartmentAssignment = (deptId: string) => {
    setAssignments((prev) => ({
      ...prev,
      departments: prev.departments.filter((d) => d.id !== deptId),
    }));
  };

  const addDivisionAssignment = (divId: string, divName: string) => {
    if (!assignments.divisions.find((d) => d.id === divId)) {
      setAssignments((prev) => ({
        ...prev,
        divisions: [
          ...prev.divisions,
          { id: divId, name: divName, is_primary: prev.divisions.length === 0 },
        ],
      }));
    }
  };

  const removeDivisionAssignment = (divId: string) => {
    setAssignments((prev) => ({
      ...prev,
      divisions: prev.divisions.filter((d) => d.id !== divId),
    }));
  };

  const addOfficeAssignment = (officeId: string, officeName: string, divisionId?: string) => {
    if (!assignments.offices.find((o) => o.id === officeId)) {
      setAssignments((prev) => ({
        ...prev,
        offices: [
          ...prev.offices,
          { id: officeId, name: officeName, division_id: divisionId, is_primary: prev.offices.length === 0 },
        ],
      }));
    }
  };

  const removeOfficeAssignment = (officeId: string) => {
    setAssignments((prev) => ({
      ...prev,
      offices: prev.offices.filter((o) => o.id !== officeId),
    }));
  };

  const setPrimaryDepartment = (deptId: string) => {
    setAssignments((prev) => ({
      ...prev,
      departments: prev.departments.map((d) => ({
        ...d,
        is_primary: d.id === deptId,
      })),
    }));
  };

  const setPrimaryDivision = (divId: string) => {
    setAssignments((prev) => ({
      ...prev,
      divisions: prev.divisions.map((d) => ({
        ...d,
        is_primary: d.id === divId,
      })),
    }));
  };

  const setPrimaryOffice = (officeId: string) => {
    setAssignments((prev) => ({
      ...prev,
      offices: prev.offices.map((o) => ({
        ...o,
        is_primary: o.id === officeId,
      })),
    }));
  };

  // Fonction pour obtenir les bureaux d'un département
  const getDepartmentOffices = (deptId: string) => {
    const department = DEPARTMENTS.find(dept => dept.id === deptId);
    if (!department) return [];

    // Récupérer toutes les divisions qui appartiennent à ce département
    const departmentDivisions = DIVISIONS.filter(div => 
      div.department_id === deptId
    );

    // Récupérer tous les bureaux de ces divisions
    const offices = departmentDivisions.flatMap(div => 
      div.offices.map(office => ({
        ...office,
        division_name: div.nameFr,
        division_id: div.id
      }))
    );

    return offices;
  };

  // Fonction pour obtenir les bureaux d'une division
  const getDivisionOffices = (divId: string) => {
    const division = DIVISIONS.find(div => div.id === divId);
    return division ? division.offices.map(office => ({
      ...office,
      division_name: division.nameFr,
      division_id: division.id
    })) : [];
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <User className="w-5 h-5" />
        Informations Personnelles
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
          <input
            type="text"
            value={formData.nom || ''}
            onChange={(e) => updateField('nom', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.nom && <p className="text-red-500 text-sm mt-1">{errors.nom}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Prénoms *</label>
          <input
            type="text"
            value={formData.prenoms || ''}
            onChange={(e) => updateField('prenoms', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.prenoms && <p className="text-red-500 text-sm mt-1">{errors.prenoms}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date de naissance *</label>
          <input
            type="date"
            value={formData.date_naissance || ''}
            onChange={(e) => updateField('date_naissance', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.date_naissance && <p className="text-red-500 text-sm mt-1">{errors.date_naissance}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Lieu de naissance *</label>
          <input
            type="text"
            value={formData.lieu_naissance || ''}
            onChange={(e) => updateField('lieu_naissance', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.lieu_naissance && <p className="text-red-500 text-sm mt-1">{errors.lieu_naissance}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sexe</label>
          <select
            value={formData.sexe || 'Masculin'}
            onChange={(e) => updateField('sexe', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="Masculin">Masculin</option>
            <option value="Féminin">Féminin</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nationalité</label>
          <input
            type="text"
            value={formData.nationalite || 'Camerounaise'}
            onChange={(e) => updateField('nationalite', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Adresse complète *</label>
          <textarea
            value={formData.adresse_complete || ''}
            onChange={(e) => updateField('adresse_complete', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.adresse_complete && <p className="text-red-500 text-sm mt-1">{errors.adresse_complete}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone personnel *</label>
          <input
            type="tel"
            value={formData.telephone_personnel || ''}
            onChange={(e) => updateField('telephone_personnel', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.telephone_personnel && <p className="text-red-500 text-sm mt-1">{errors.telephone_personnel}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email personnel *</label>
          <input
            type="email"
            value={formData.email_personnel || ''}
            onChange={(e) => updateField('email_personnel', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.email_personnel && <p className="text-red-500 text-sm mt-1">{errors.email_personnel}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">État civil</label>
          <select
            value={formData.etat_civil || 'Célibataire'}
            onChange={(e) => updateField('etat_civil', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="Célibataire">Célibataire</option>
            <option value="Marié(e)">Marié(e)</option>
            <option value="Divorcé(e)">Divorcé(e)</option>
            <option value="Veuf(ve)">Veuf(ve)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nombre d'enfants</label>
          <input
            type="number"
            value={formData.nombre_enfants || 0}
            onChange={(e) => updateField('nombre_enfants', parseInt(e.target.value))}
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="border-t pt-6">
        <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Phone className="w-4 h-4" />
          Contact d'urgence
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nom du contact *</label>
            <input
              type="text"
              value={formData.urgence_nom || ''}
              onChange={(e) => updateField('urgence_nom', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.urgence_nom && <p className="text-red-500 text-sm mt-1">{errors.urgence_nom}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone du contact *</label>
            <input
              type="tel"
              value={formData.urgence_telephone || ''}
              onChange={(e) => updateField('urgence_telephone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.urgence_telephone && <p className="text-red-500 text-sm mt-1">{errors.urgence_telephone}</p>}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <CreditCard className="w-5 h-5" />
        Identification & Documents Administratifs
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Numéro CNI *</label>
          <input
            type="text"
            value={formData.cni_numero || ''}
            onChange={(e) => updateField('cni_numero', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.cni_numero && <p className="text-red-500 text-sm mt-1">{errors.cni_numero}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date de délivrance *</label>
          <input
            type="date"
            value={formData.cni_date_delivrance || ''}
            onChange={(e) => updateField('cni_date_delivrance', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.cni_date_delivrance && <p className="text-red-500 text-sm mt-1">{errors.cni_date_delivrance}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Lieu de délivrance *</label>
          <input
            type="text"
            value={formData.cni_lieu_delivrance || ''}
            onChange={(e) => updateField('cni_lieu_delivrance', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.cni_lieu_delivrance && <p className="text-red-500 text-sm mt-1">{errors.cni_lieu_delivrance}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Numéro de passeport</label>
          <input
            type="text"
            value={formData.passeport_numero || ''}
            onChange={(e) => updateField('passeport_numero', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date validité passeport</label>
          <input
            type="date"
            value={formData.passeport_validite || ''}
            onChange={(e) => updateField('passeport_validite', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Numéro permis</label>
          <input
            type="text"
            value={formData.permis_numero || ''}
            onChange={(e) => updateField('permis_numero', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie permis</label>
          <input
            type="text"
            value={formData.permis_categorie || ''}
            onChange={(e) => updateField('permis_categorie', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <Briefcase className="w-5 h-5" />
        Informations Professionnelles
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Poste occupé *</label>
          <input
            type="text"
            value={formData.poste_occupe || ''}
            onChange={(e) => updateField('poste_occupe', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.poste_occupe && <p className="text-red-500 text-sm mt-1">{errors.poste_occupe}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie/Niveau *</label>
          <select
            value={formData.categorie_niveau || ''}
            onChange={(e) => updateField('categorie_niveau', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Sélectionner...</option>
            <option value="Cadre Dirigeant">Cadre Dirigeant</option>
            <option value="Cadre Supérieur">Cadre Supérieur</option>
            <option value="Cadre">Cadre</option>
            <option value="Agent de Maîtrise">Agent de Maîtrise</option>
            <option value="Employé Qualifié">Employé Qualifié</option>
            <option value="Employé">Employé</option>
            <option value="Ouvrier Qualifié">Ouvrier Qualifié</option>
            <option value="Ouvrier">Ouvrier</option>
          </select>
          {errors.categorie_niveau && <p className="text-red-500 text-sm mt-1">{errors.categorie_niveau}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Fonction exacte *</label>
          <textarea
            value={formData.fonction_exacte || ''}
            onChange={(e) => updateField('fonction_exacte', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.fonction_exacte && <p className="text-red-500 text-sm mt-1">{errors.fonction_exacte}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Type de contrat</label>
          <select
            value={formData.type_contrat || 'CDI'}
            onChange={(e) => updateField('type_contrat', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="CDI">CDI</option>
            <option value="CDD">CDD</option>
            <option value="Stage">Stage</option>
            <option value="Consultant">Consultant</option>
            <option value="Prestataire">Prestataire</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Statut emploi</label>
          <select
            value={formData.statut_emploi || 'Permanent'}
            onChange={(e) => updateField('statut_emploi', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="Permanent">Permanent</option>
            <option value="Temporaire">Temporaire</option>
            <option value="Saisonnier">Saisonnier</option>
            <option value="Intérimaire">Intérimaire</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date d'embauche</label>
          <input
            type="date"
            value={formData.date_embauche || ''}
            onChange={(e) => updateField('date_embauche', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Mode de travail</label>
          <select
            value={formData.mode_travail || 'Présentiel'}
            onChange={(e) => updateField('mode_travail', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="Présentiel">Présentiel</option>
            <option value="Télétravail">Télétravail</option>
            <option value="Hybride">Hybride</option>
          </select>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="periode_essai"
            checked={formData.periode_essai || false}
            onChange={(e) => updateField('periode_essai', e.target.checked)}
            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          <label htmlFor="periode_essai" className="ml-2 text-sm text-gray-700">
            Période d'essai
          </label>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <DollarSign className="w-5 h-5" />
        Informations Salariales
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Salaire de base (FCFA) *</label>
          <input
            type="number"
            value={formData.salaire_base || ''}
            onChange={(e) => updateField('salaire_base', parseFloat(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.salaire_base && <p className="text-red-500 text-sm mt-1">{errors.salaire_base}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Mode de paiement</label>
          <select
            value={formData.mode_paiement || 'Virement'}
            onChange={(e) => updateField('mode_paiement', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="Virement">Virement</option>
            <option value="Chèque">Chèque</option>
            <option value="Espèces">Espèces</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Périodicité de paie</label>
          <select
            value={formData.periodicite_paie || 'Mensuelle'}
            onChange={(e) => updateField('periodicite_paie', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="Mensuelle">Mensuelle</option>
            <option value="Quinzaine">Quinzaine</option>
            <option value="Hebdomadaire">Hebdomadaire</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Lieu de travail</label>
          <input
            type="text"
            value={formData.lieu_travail || 'Siège'}
            onChange={(e) => updateField('lieu_travail', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Horaires de travail</label>
          <input
            type="text"
            value={formData.horaires_travail || '08:00-17:00'}
            onChange={(e) => updateField('horaires_travail', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Niveau de confidentialité</label>
          <select
            value={formData.niveau_confidentialite || 'Moyen'}
            onChange={(e) => updateField('niveau_confidentialite', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="Standard">Standard</option>
            <option value="Moyen">Moyen</option>
            <option value="Élevé">Élevé</option>
            <option value="Confidentiel">Confidentiel</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <Building className="w-5 h-5" />
        Affectations multiples (Départements, Divisions, Bureaux)
      </h3>

      {errors.assignments && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {errors.assignments}
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Comment utiliser :</strong> Cliquez sur un département ou une division pour voir ses bureaux. 
          Vous pourrez ensuite sélectionner les bureaux que vous souhaitez assigner.
          Sélectionnez au moins une division ou un bureau. Cochez "Principal" pour définir l'affectation principale.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Colonne de gauche - Départements et Divisions */}
        <div className="space-y-6">
          {/* Départements */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Départements
            </label>
            <div className="space-y-2">
              {DEPARTMENTS.map((dept) => {
                const isExpanded = expandedDepartments.has(dept.id);
                const isAssigned = assignments.departments.find((d) => d.id === dept.id);

                return (
                  <div key={dept.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="flex items-center justify-between p-3 bg-gray-50">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => toggleDepartment(dept.id)}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </button>
                        {isAssigned ? (
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium">{dept.nameFr}</span>
                            {isAssigned.is_primary && (
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                Principal
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm">{dept.nameFr}</span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {isAssigned ? (
                          <>
                            {!isAssigned.is_primary && (
                              <button
                                type="button"
                                onClick={() => setPrimaryDepartment(dept.id)}
                                className="text-xs text-blue-600 hover:text-blue-700"
                              >
                                Définir principal
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => removeDepartmentAssignment(dept.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => addDepartmentAssignment(dept.id, dept.nameFr)}
                            className="text-green-600 hover:text-green-700"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Divisions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Divisions
            </label>
            <div className="space-y-2">
              {DIVISIONS.map((div) => {
                const isExpanded = expandedDivisions.has(div.id);
                const isAssigned = assignments.divisions.find((d) => d.id === div.id);

                return (
                  <div key={div.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="flex items-center justify-between p-3 bg-gray-50">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => toggleDivision(div.id)}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </button>
                        {isAssigned ? (
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium">{div.nameFr}</span>
                            {isAssigned.is_primary && (
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                Principal
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm">{div.nameFr}</span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {isAssigned ? (
                          <>
                            {!isAssigned.is_primary && (
                              <button
                                type="button"
                                onClick={() => setPrimaryDivision(div.id)}
                                className="text-xs text-blue-600 hover:text-blue-700"
                              >
                                Définir principal
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => removeDivisionAssignment(div.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => addDivisionAssignment(div.id, div.nameFr)}
                            className="text-green-600 hover:text-green-700"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Colonne de droite - Bureaux */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bureaux disponibles
          </label>
          
          {selectedDepartment && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Bureaux du département: {DEPARTMENTS.find(d => d.id === selectedDepartment)?.nameFr}
              </h4>
              <div className="space-y-2">
                {getDepartmentOffices(selectedDepartment).map((office) => {
                  const isAssigned = assignments.offices.find((o) => o.id === office.id);
                  return (
                    <div key={office.id} className="flex items-center justify-between border border-gray-300 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        {isAssigned ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : null}
                        <span className="text-sm">
                          {office.nameFr}
                          <span className="text-xs text-gray-500 ml-2">({office.division_name})</span>
                        </span>
                        {isAssigned?.is_primary && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            Principal
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {isAssigned ? (
                          <>
                            {!isAssigned.is_primary && (
                              <button
                                type="button"
                                onClick={() => setPrimaryOffice(office.id)}
                                className="text-xs text-blue-600 hover:text-blue-700"
                              >
                                Principal
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => removeOfficeAssignment(office.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => addOfficeAssignment(office.id, office.nameFr, office.division_id)}
                            className="text-green-600 hover:text-green-700"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {selectedDivision && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Bureaux de la division: {DIVISIONS.find(d => d.id === selectedDivision)?.nameFr}
              </h4>
              <div className="space-y-2">
                {getDivisionOffices(selectedDivision).map((office) => {
                  const isAssigned = assignments.offices.find((o) => o.id === office.id);
                  return (
                    <div key={office.id} className="flex items-center justify-between border border-gray-300 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        {isAssigned ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : null}
                        <span className="text-sm">{office.nameFr}</span>
                        {isAssigned?.is_primary && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            Principal
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {isAssigned ? (
                          <>
                            {!isAssigned.is_primary && (
                              <button
                                type="button"
                                onClick={() => setPrimaryOffice(office.id)}
                                className="text-xs text-blue-600 hover:text-blue-700"
                              >
                                Principal
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => removeOfficeAssignment(office.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => addOfficeAssignment(office.id, office.nameFr, selectedDivision)}
                            className="text-green-600 hover:text-green-700"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {!selectedDepartment && !selectedDivision && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
              <Building className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-600">
                Cliquez sur un département ou une division à gauche pour voir ses bureaux
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Résumé des affectations</h4>
        <div className="space-y-1 text-sm text-gray-700">
          <p>Départements: {assignments.departments.length}</p>
          <p>Divisions: {assignments.divisions.length}</p>
          <p>Bureaux: {assignments.offices.length}</p>
        </div>
      </div>
    </div>
  );

  const renderStep6 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <FileText className="w-5 h-5" />
        Documents & Finalisation
      </h3>

      <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
        <p className="text-sm text-green-800">
          <strong>Félicitations !</strong> Vous avez presque terminé l'enregistrement du personnel.
          Vérifiez les informations ci-dessous avant de finaliser.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">Récapitulatif Personnel</h4>
          <div className="space-y-2 text-sm">
            <p><strong>Nom:</strong> {formData.nom} {formData.prenoms}</p>
            <p><strong>Email:</strong> {formData.email_personnel}</p>
            <p><strong>Téléphone:</strong> {formData.telephone_personnel}</p>
            <p><strong>Poste:</strong> {formData.poste_occupe}</p>
            <p><strong>Type contrat:</strong> {formData.type_contrat}</p>
            <p><strong>Salaire base:</strong> {formData.salaire_base?.toLocaleString()} FCFA</p>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">Récapitulatif Affectations</h4>
          <div className="space-y-2 text-sm">
            <p><strong>Départements:</strong> {assignments.departments.length}</p>
            <p><strong>Divisions:</strong> {assignments.divisions.length}</p>
            <p><strong>Bureaux:</strong> {assignments.offices.length}</p>
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h4 className="text-md font-semibold text-gray-900 mb-4">Documents à fournir</h4>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <input type="checkbox" id="doc_cni" className="w-4 h-4 text-indigo-600" />
            <label htmlFor="doc_cni" className="text-sm text-gray-700">Copie CNI</label>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="doc_cv" className="w-4 h-4 text-indigo-600" />
            <label htmlFor="doc_cv" className="text-sm text-gray-700">Curriculum Vitae</label>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="doc_photos" className="w-4 h-4 text-indigo-600" />
            <label htmlFor="doc_photos" className="text-sm text-gray-700">Photos d'identité</label>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="doc_attestation" className="w-4 h-4 text-indigo-600" />
            <label htmlFor="doc_attestation" className="text-sm text-gray-700">Attestation de travail</label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      case 5:
        return renderStep5();
      case 6:
        return renderStep6();
      default:
        return renderStep1();
    }
  };

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Enregistrement du Personnel - GeoCasa Group
        </h2>
        <p className="text-gray-600">
          Saisie initiale avec affectations multiples
        </p>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    currentStep === step.id
                      ? 'bg-indigo-600 text-white'
                      : currentStep > step.id
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {currentStep > step.id ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                <p className="text-xs mt-2 text-center max-w-20">{step.name}</p>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {renderCurrentStep()}

        <div className="mt-8 flex items-center justify-between">
          <button
            type="button"
            onClick={currentStep === 1 ? onCancel : handleBack}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            {currentStep === 1 ? 'Annuler' : 'Précédent'}
          </button>

          {currentStep < steps.length ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Suivant
            </button>
          ) : (
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              Enregistrer
            </button>
          )}
        </div>
      </form>
    </div>
  );
}