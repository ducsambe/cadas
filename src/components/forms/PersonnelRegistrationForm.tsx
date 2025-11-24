import { useState, useEffect } from 'react';
import {
  User,
  Calendar,
  MapPin,
  Phone,
  Mail,
  FileText,
  CreditCard,
  Briefcase,
  DollarSign,
  Shield,
  CheckCircle,
  AlertCircle,
  Upload,
  X,
} from 'lucide-react';
import { HRPersonnel } from '../../types';

interface PersonnelRegistrationFormProps {
  onSubmit: (data: Partial<HRPersonnel>) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<HRPersonnel>;
}

interface Division {
  id: string;
  name: string;
  offices: Office[];
}

interface Office {
  id: string;
  name: string;
  divisionId: string;
}

interface Department {
  id: string;
  nameEn: string;
  nameFr: string;
}

export const DIVISIONS: Division[] = [
  {
    id: 'general-administration',
    name: 'Division des Affaires Générales',
    offices: [
      {
        id: 'general-admin-logistics',
        name: 'Bureau 1 : Administration Générale & Logistique',
        divisionId: 'general-administration'
      },
      {
        id: 'reception-documentation-archiving',
        name: 'Bureau 2 : Accueil, Documentation & Archivage',
        divisionId: 'general-administration'
      }
    ]
  },
  {
    id: 'accounting-finance',
    name: 'Division Comptabilité et Finance',
    offices: [
      {
        id: 'general-accounting',
        name: 'Bureau Comptabilité Générale et Fiscale',
        divisionId: 'accounting-finance'
      },
      {
        id: 'treasury-commitments',
        name: 'Bureau Trésorerie Engagements',
        divisionId: 'accounting-finance'
      },
      {
        id: 'project-finance',
        name: 'Bureau Finances Projets et Contrôle Budgétaire',
        divisionId: 'accounting-finance'
      }
    ]
  },
  {
    id: 'human-resources',
    name: 'Division Ressources Humaines',
    offices: [
      {
        id: 'personnel-career-admin',
        name: 'Administration du Personnel & Gestion des Carrières',
        divisionId: 'human-resources'
      }
    ]
  },
  {
    id: 'marketing-communication',
    name: 'Division Marketing et Communication',
    offices: [
      {
        id: 'marketing-strategy',
        name: 'Bureau Stratégie Marketing et Communication',
        divisionId: 'marketing-communication'
      },
      {
        id: 'public-relations',
        name: 'Bureau Relations Publiques et Médias',
        divisionId: 'marketing-communication'
      },
      {
        id: 'brand-digital',
        name: 'Bureau Développement de Marque et Digital',
        divisionId: 'marketing-communication'
      }
    ]
  }
];

export const DEPARTMENTS: Department[] = [
  {
    id: 'land-cadastral',
    nameEn: 'Land and Cadastral Management (GFC)',
    nameFr: 'Gestion Foncier et Cadastrale (GFC)'
  },
  {
    id: 'financing',
    nameEn: 'Real Estate and Land Financing (FFI)',
    nameFr: 'Financement Foncier et Immobilier (FFI)'
  },
  {
    id: 'sales-management',
    nameEn: 'Real Estate Sales and Management (VGI)',
    nameFr: 'Vente et Gestion Immobilière (VGI)'
  },
  {
    id: 'real-estate-construction',
    nameEn: 'Real Estate Projects and Construction (PIC)',
    nameFr: 'Projets Immobilier et Construction (PIC)'
  },
  {
    id: 'woodworking',
    nameEn: 'Woodworking and Wood Manufacturing (MFB)',
    nameFr: 'Menuiserie et Fabrication Bois (MFB)'
  },
  {
    id: 'agro-environment',
    nameEn: 'Agro-Pastoral and Environment (APE)',
    nameFr: 'Agro-Pastoral et Environnement (APE)'
  },
  {
    id: 'tech-solutions',
    nameEn: 'Technological Solutions and Digital (STN)',
    nameFr: 'Solutions Technologiques et Numérique (STN)'
  },
  {
    id: 'commerce-import',
    nameEn: 'General Trade & Import-Export (CIE)',
    nameFr: 'Commerce Général & Import-Export (CIE)'
  }
];

export function PersonnelRegistrationForm({
  onSubmit,
  onCancel,
  initialData,
}: PersonnelRegistrationFormProps) {
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
      divisions: [],
      offices: [],
      departments: [],
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedDivisionIds, setSelectedDivisionIds] = useState<string[]>([]);
  const [selectedOfficeIds, setSelectedOfficeIds] = useState<string[]>([]);
  const [selectedDepartmentIds, setSelectedDepartmentIds] = useState<string[]>([]);

  // Initialize selections from formData
  useEffect(() => {
    if (formData.divisions) {
      setSelectedDivisionIds(formData.divisions);
    }
    if (formData.offices) {
      setSelectedOfficeIds(formData.offices);
    }
    if (formData.departments) {
      setSelectedDepartmentIds(formData.departments);
    }
  }, [formData.divisions, formData.offices, formData.departments]);

  const steps = [
    { id: 1, name: 'Informations personnelles', icon: User },
    { id: 2, name: 'Identification & Admin', icon: CreditCard },
    { id: 3, name: 'Informations professionnelles', icon: Briefcase },
    { id: 4, name: 'Informations salariales', icon: DollarSign },
    { id: 5, name: 'Documents & Affectation', icon: FileText },
  ];

  const handleDivisionToggle = (divisionId: string) => {
    setSelectedDivisionIds(prev => {
      const newSelection = prev.includes(divisionId)
        ? prev.filter(id => id !== divisionId)
        : [...prev, divisionId];
      
      // Update form data
      updateField('divisions', newSelection);
      
      // Remove offices from deselected divisions
      if (!newSelection.includes(divisionId)) {
        const division = DIVISIONS.find(d => d.id === divisionId);
        if (division) {
          const officeIdsToRemove = division.offices.map(office => office.id);
          const newOfficeSelection = selectedOfficeIds.filter(id => !officeIdsToRemove.includes(id));
          setSelectedOfficeIds(newOfficeSelection);
          updateField('offices', newOfficeSelection);
        }
      }
      
      return newSelection;
    });
  };

  const handleOfficeToggle = (officeId: string) => {
    setSelectedOfficeIds(prev => {
      const newSelection = prev.includes(officeId)
        ? prev.filter(id => id !== officeId)
        : [...prev, officeId];
      
      // Update form data
      updateField('offices', newSelection);
      return newSelection;
    });
  };

  const handleDepartmentToggle = (departmentId: string) => {
    setSelectedDepartmentIds(prev => {
      const newSelection = prev.includes(departmentId)
        ? prev.filter(id => id !== departmentId)
        : [...prev, departmentId];
      
      // Update form data
      updateField('departments', newSelection);
      return newSelection;
    });
  };

  const handleSelectAllDivisions = () => {
    const allDivisionIds = DIVISIONS.map(division => division.id);
    setSelectedDivisionIds(allDivisionIds);
    updateField('divisions', allDivisionIds);
    
    // Select all offices when selecting all divisions
    const allOfficeIds = DIVISIONS.flatMap(division => division.offices.map(office => office.id));
    setSelectedOfficeIds(allOfficeIds);
    updateField('offices', allOfficeIds);
  };

  const handleClearAllDivisions = () => {
    setSelectedDivisionIds([]);
    setSelectedOfficeIds([]);
    updateField('divisions', []);
    updateField('offices', []);
  };

  const handleSelectAllDepartments = () => {
    const allDepartmentIds = DEPARTMENTS.map(department => department.id);
    setSelectedDepartmentIds(allDepartmentIds);
    updateField('departments', allDepartmentIds);
  };

  const handleClearAllDepartments = () => {
    setSelectedDepartmentIds([]);
    updateField('departments', []);
  };

  const getOfficesForSelectedDivisions = () => {
    return DIVISIONS
      .filter(division => selectedDivisionIds.includes(division.id))
      .flatMap(division => division.offices);
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
        if (selectedDivisionIds.length === 0) newErrors.divisions = 'Au moins une division requise';
        if (selectedOfficeIds.length === 0) newErrors.offices = 'Au moins un bureau requis';
        if (selectedDepartmentIds.length === 0) newErrors.departments = 'Au moins un département requis';
        if (!formData.fonction_exacte) newErrors.fonction_exacte = 'Fonction requise';
        break;
      case 4:
        if (!formData.salaire_base || formData.salaire_base <= 0)
          newErrors.salaire_base = 'Salaire de base requis';
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
      await onSubmit(formData);
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

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <User className="w-5 h-5" />
        Informations personnelles
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nom <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.nom || ''}
            onChange={(e) => updateField('nom', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg ${
              errors.nom ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.nom && <p className="text-red-500 text-sm mt-1">{errors.nom}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Prénoms <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.prenoms || ''}
            onChange={(e) => updateField('prenoms', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg ${
              errors.prenoms ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.prenoms && <p className="text-red-500 text-sm mt-1">{errors.prenoms}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sexe</label>
          <select
            value={formData.sexe}
            onChange={(e) => updateField('sexe', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="Masculin">Masculin</option>
            <option value="Féminin">Féminin</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date de naissance <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={formData.date_naissance || ''}
            onChange={(e) => updateField('date_naissance', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg ${
              errors.date_naissance ? 'border-red-500' : 'border-gray-300'
            }`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Lieu de naissance <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.lieu_naissance || ''}
            onChange={(e) => updateField('lieu_naissance', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg ${
              errors.lieu_naissance ? 'border-red-500' : 'border-gray-300'
            }`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nationalité</label>
          <input
            type="text"
            value={formData.nationalite || ''}
            onChange={(e) => updateField('nationalite', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">État civil</label>
          <select
            value={formData.etat_civil}
            onChange={(e) => updateField('etat_civil', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="Célibataire">Célibataire</option>
            <option value="Marié(e)">Marié(e)</option>
            <option value="Veuf(ve)">Veuf(ve)</option>
            <option value="Divorcé(e)">Divorcé(e)</option>
          </select>
        </div>

        {formData.etat_civil === 'Marié(e)' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom du conjoint</label>
            <input
              type="text"
              value={formData.nom_conjoint || ''}
              onChange={(e) => updateField('nom_conjoint', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre d'enfants</label>
          <input
            type="number"
            min="0"
            value={formData.nombre_enfants || 0}
            onChange={(e) => updateField('nombre_enfants', parseInt(e.target.value) || 0)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Adresse complète <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formData.adresse_complete || ''}
          onChange={(e) => updateField('adresse_complete', e.target.value)}
          rows={2}
          className={`w-full px-4 py-2 border rounded-lg ${
            errors.adresse_complete ? 'border-red-500' : 'border-gray-300'
          }`}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Téléphone <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={formData.telephone_personnel || ''}
            onChange={(e) => updateField('telephone_personnel', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg ${
              errors.telephone_personnel ? 'border-red-500' : 'border-gray-300'
            }`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={formData.email_personnel || ''}
            onChange={(e) => updateField('email_personnel', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg ${
              errors.email_personnel ? 'border-red-500' : 'border-gray-300'
            }`}
          />
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-3">Contact d'urgence</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom & Prénom <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.urgence_nom || ''}
              onChange={(e) => updateField('urgence_nom', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lien</label>
            <input
              type="text"
              placeholder="Ex: Époux/se, Parent..."
              value={formData.urgence_lien || ''}
              onChange={(e) => updateField('urgence_lien', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Téléphone <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={formData.urgence_telephone || ''}
              onChange={(e) => updateField('urgence_telephone', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <CreditCard className="w-5 h-5" />
        Identification et administratif
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Numéro CNI <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.cni_numero || ''}
            onChange={(e) => updateField('cni_numero', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg ${
              errors.cni_numero ? 'border-red-500' : 'border-gray-300'
            }`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date de délivrance <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={formData.cni_date_delivrance || ''}
            onChange={(e) => updateField('cni_date_delivrance', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg ${
              errors.cni_date_delivrance ? 'border-red-500' : 'border-gray-300'
            }`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Lieu de délivrance <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.cni_lieu_delivrance || ''}
            onChange={(e) => updateField('cni_lieu_delivrance', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg ${
              errors.cni_lieu_delivrance ? 'border-red-500' : 'border-gray-300'
            }`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Numéro CNPS</label>
          <input
            type="text"
            value={formData.numero_cnps || ''}
            onChange={(e) => updateField('numero_cnps', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Numéro fiscal</label>
          <input
            type="text"
            value={formData.numero_fiscal || ''}
            onChange={(e) => updateField('numero_fiscal', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Groupe sanguin</label>
          <select
            value={formData.groupe_sanguin || ''}
            onChange={(e) => updateField('groupe_sanguin', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">Sélectionner...</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Numéro de compte bancaire
          </label>
          <input
            type="text"
            value={formData.compte_bancaire || ''}
            onChange={(e) => updateField('compte_bancaire', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Banque / Agence</label>
          <input
            type="text"
            value={formData.banque_agence || ''}
            onChange={(e) => updateField('banque_agence', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <Briefcase className="w-5 h-5" />
        Informations professionnelles
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Poste occupé <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.poste_occupe || ''}
            onChange={(e) => updateField('poste_occupe', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg ${
              errors.poste_occupe ? 'border-red-500' : 'border-gray-300'
            }`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Catégorie / Niveau <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.categorie_niveau || ''}
            onChange={(e) => updateField('categorie_niveau', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg ${
              errors.categorie_niveau ? 'border-red-500' : 'border-gray-300'
            }`}
          />
        </div>

        {/* Departments Section */}
        <div className="md:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Départements d'affectation <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSelectAllDepartments}
                className="text-xs px-3 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
              >
                Tout sélectionner
              </button>
              <button
                type="button"
                onClick={handleClearAllDepartments}
                className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                Tout effacer
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {DEPARTMENTS.map((department) => (
              <div
                key={department.id}
                className={`border rounded-lg p-3 cursor-pointer transition-all ${
                  selectedDepartmentIds.includes(department.id)
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleDepartmentToggle(department.id)}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedDepartmentIds.includes(department.id)}
                    onChange={() => handleDepartmentToggle(department.id)}
                    className="w-4 h-4 text-purple-600"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{department.nameFr}</h4>
                    <p className="text-sm text-gray-500">{department.nameEn}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {errors.departments && (
            <p className="text-red-500 text-sm mt-1">{errors.departments}</p>
          )}
        </div>

        {/* Divisions Section */}
        <div className="md:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Divisions d'affectation <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSelectAllDivisions}
                className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
              >
                Tout sélectionner
              </button>
              <button
                type="button"
                onClick={handleClearAllDivisions}
                className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                Tout effacer
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {DIVISIONS.map((division) => (
              <div
                key={division.id}
                className={`border rounded-lg p-3 cursor-pointer transition-all ${
                  selectedDivisionIds.includes(division.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleDivisionToggle(division.id)}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedDivisionIds.includes(division.id)}
                    onChange={() => handleDivisionToggle(division.id)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{division.name}</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      {division.offices.length} bureau(s) disponible(s)
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {errors.divisions && (
            <p className="text-red-500 text-sm mt-1">{errors.divisions}</p>
          )}
        </div>

        {/* Offices Section */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Bureaux / Services <span className="text-red-500">*</span>
            <span className="text-xs text-gray-500 ml-2">
              (Sélectionnez les bureaux dans les divisions choisies)
            </span>
          </label>
          
          {selectedDivisionIds.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
              <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">Veuillez d'abord sélectionner au moins une division</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-60 overflow-y-auto p-2">
              {getOfficesForSelectedDivisions().map((office) => (
                <div
                  key={office.id}
                  className={`border rounded-lg p-3 cursor-pointer transition-all ${
                    selectedOfficeIds.includes(office.id)
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleOfficeToggle(office.id)}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedOfficeIds.includes(office.id)}
                      onChange={() => handleOfficeToggle(office.id)}
                      className="w-4 h-4 text-green-600"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">{office.name}</h4>
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                          {DIVISIONS.find(d => d.id === office.divisionId)?.name}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {errors.offices && (
            <p className="text-red-500 text-sm mt-1">{errors.offices}</p>
          )}
        </div>

        {/* Selected items summary */}
        {(selectedDepartmentIds.length > 0 || selectedDivisionIds.length > 0 || selectedOfficeIds.length > 0) && (
          <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">Résumé des affectations</h4>
            
            {selectedDepartmentIds.length > 0 && (
              <div className="mb-3">
                <h5 className="text-sm font-medium text-gray-700 mb-2">Départements sélectionnés:</h5>
                <div className="flex flex-wrap gap-2">
                  {selectedDepartmentIds.map(departmentId => {
                    const department = DEPARTMENTS.find(d => d.id === departmentId);
                    return department ? (
                      <span key={department.id} className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                        {department.nameFr}
                        <button
                          type="button"
                          onClick={() => handleDepartmentToggle(department.id)}
                          className="hover:text-purple-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            {selectedDivisionIds.length > 0 && (
              <div className="mb-3">
                <h5 className="text-sm font-medium text-gray-700 mb-2">Divisions sélectionnées:</h5>
                <div className="flex flex-wrap gap-2">
                  {selectedDivisionIds.map(divisionId => {
                    const division = DIVISIONS.find(d => d.id === divisionId);
                    return division ? (
                      <span key={division.id} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {division.name}
                        <button
                          type="button"
                          onClick={() => handleDivisionToggle(division.id)}
                          className="hover:text-blue-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            {selectedOfficeIds.length > 0 && (
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Bureaux sélectionnés:</h5>
                <div className="flex flex-wrap gap-2">
                  {selectedOfficeIds.map(officeId => {
                    const office = getOfficesForSelectedDivisions().find(o => o.id === officeId);
                    return office ? (
                      <span key={office.id} className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        {office.name}
                        <button
                          type="button"
                          onClick={() => handleOfficeToggle(office.id)}
                          className="hover:text-green-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fonction exacte <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.fonction_exacte || ''}
            onChange={(e) => updateField('fonction_exacte', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg ${
              errors.fonction_exacte ? 'border-red-500' : 'border-gray-300'
            }`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rattachement hiérarchique
          </label>
          <input
            type="text"
            placeholder="Nom du supérieur"
            value={formData.rattachement_hierarchique || ''}
            onChange={(e) => updateField('rattachement_hierarchique', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date d'entrée</label>
          <input
            type="date"
            value={formData.date_entree || new Date().toISOString().split('T')[0]}
            onChange={(e) => updateField('date_entree', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type de contrat</label>
          <select
            value={formData.type_contrat}
            onChange={(e) => updateField('type_contrat', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="CDI">CDI</option>
            <option value="CDD">CDD</option>
            <option value="Stage">Stage</option>
            <option value="Temporaire">Temporaire</option>
            <option value="Consultance">Consultance</option>
          </select>
        </div>

        {(formData.type_contrat === 'CDD' || formData.type_contrat === 'Stage') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Durée du contrat</label>
            <input
              type="text"
              placeholder="Ex: 6 mois"
              value={formData.duree_contrat || ''}
              onChange={(e) => updateField('duree_contrat', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
          <select
            value={formData.statut_emploi}
            onChange={(e) => updateField('statut_emploi', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="Permanent">Permanent</option>
            <option value="Temporaire">Temporaire</option>
            <option value="Stagiaire">Stagiaire</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mode de travail</label>
          <select
            value={formData.mode_travail}
            onChange={(e) => updateField('mode_travail', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="Présentiel">Présentiel</option>
            <option value="Hybride">Hybride</option>
            <option value="Télétravail">Télétravail</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Horaires de travail</label>
          <input
            type="text"
            value={formData.horaires_travail || ''}
            onChange={(e) => updateField('horaires_travail', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={formData.periode_essai}
            onChange={(e) => updateField('periode_essai', e.target.checked)}
            className="w-4 h-4"
          />
          <label className="text-sm font-medium text-gray-700">Période d'essai</label>
        </div>

        {formData.periode_essai && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Durée essai</label>
            <input
              type="text"
              placeholder="Ex: 3 mois"
              value={formData.duree_essai || ''}
              onChange={(e) => updateField('duree_essai', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Lieu de travail</label>
          <select
            value={formData.lieu_travail}
            onChange={(e) => updateField('lieu_travail', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="Siège">Siège</option>
            <option value="Antenne">Antenne</option>
            <option value="Terrain">Terrain</option>
            <option value="Autre">Autre</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <DollarSign className="w-5 h-5" />
        Informations salariales
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Salaire de base (FCFA) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min="0"
            value={formData.salaire_base || ''}
            onChange={(e) => updateField('salaire_base', parseFloat(e.target.value) || 0)}
            className={`w-full px-4 py-2 border rounded-lg ${
              errors.salaire_base ? 'border-red-500' : 'border-gray-300'
            }`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mode de paiement</label>
          <select
            value={formData.mode_paiement}
            onChange={(e) => updateField('mode_paiement', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="Virement">Virement</option>
            <option value="Espèces">Espèces</option>
            <option value="Autre">Autre</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Périodicité de la paie
          </label>
          <input
            type="text"
            value={formData.periodicite_paie || ''}
            onChange={(e) => updateField('periodicite_paie', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-3">
          Primes et indemnités (optionnel)
        </h4>
        <p className="text-sm text-gray-600 mb-3">
          Les montants seront configurés après validation de l'enregistrement
        </p>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-3">
          Avantages en nature (optionnel)
        </h4>
        <p className="text-sm text-gray-600 mb-3">
          Les avantages seront configurés après validation de l'enregistrement
        </p>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <FileText className="w-5 h-5" />
        Documents et affectation
      </h3>

      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
        <p className="text-sm text-yellow-800">
          Les documents seront téléchargés après la création du profil. Vous recevrez un lien pour
          compléter le dossier.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Chef de bureau</label>
          <input
            type="text"
            value={formData.chef_bureau || ''}
            onChange={(e) => updateField('chef_bureau', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Niveau de confidentialité
          </label>
          <select
            value={formData.niveau_confidentialite}
            onChange={(e) => updateField('niveau_confidentialite', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="Bas">Bas</option>
            <option value="Moyen">Moyen</option>
            <option value="Élevé">Élevé</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Profil d'accès</label>
          <select
            value={formData.profil_acces}
            onChange={(e) => updateField('profil_acces', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="Employé">Employé</option>
            <option value="Chef de Bureau">Chef de Bureau</option>
            <option value="DRH">DRH</option>
            <option value="DG">DG</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date formation intégration
          </label>
          <input
            type="date"
            value={formData.formation_integration_date || ''}
            onChange={(e) => updateField('formation_integration_date', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Observations RH</label>
        <textarea
          value={formData.observation_rh || ''}
          onChange={(e) => updateField('observation_rh', e.target.value)}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Enregistrement du Personnel - GeoCasa Group
        </h2>
        <p className="text-gray-600">
          Saisie initiale dans le SIRH avant génération du matricule
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
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
        {currentStep === 5 && renderStep5()}

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