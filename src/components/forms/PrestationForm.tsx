import React, { useState, useEffect } from 'react';
import { X, Save, User, MapPin, FileText, Phone, Building2, CreditCard as Edit3, Copy, Upload, File, Trash2, Paperclip, Plus } from 'lucide-react';
import { usePrestations } from '../../hooks/usePrestations';
import type { PrestationFormData, DocumentItem } from '../../hooks/usePrestations';

interface PrestationFormProps {
  onClose: () => void;
  onSuccess?: (prestationData: any) => void;
  editData?: any; // Add this prop for edit mode
}

const PrestationForm: React.FC<PrestationFormProps> = ({ onClose, onSuccess, editData }) => {
  const { createPrestation, updatePrestation } = usePrestations();
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  
  const [formData, setFormData] = useState<PrestationFormData>({
    client_nom: '',
    client_type: '',
    client_email: '',
    client_phone: '',
    client_adresse: '',
    nom_du_dossier: '',
    procedure_choisie: '',
    offre_choisie: '',
    description: '',
    region: '',
    departement: '',
    ville: '',
    lieu_dit: '',
    contact_terrain_nom: '',
    contact_terrain_qualite: '',
    contact_terrain_phone: '',
    demande_par: 'courriel',
    priorite: 'normale',
    statut: 'nouvelles',
    department_id: '',
    documents: []
  });

  const [showAddDepartment, setShowAddDepartment] = useState(false);
  const [newDepartmentName, setNewDepartmentName] = useState('');
  const [showAddProcedure, setShowAddProcedure] = useState(false);
  const [newProcedureName, setNewProcedureName] = useState('');
  const [showAddClientType, setShowAddClientType] = useState(false);
  const [newClientType, setNewClientType] = useState('');
  const [newDocumentName, setNewDocumentName] = useState('');

  // Documents types communs - sorted alphabetically
  const [commonDocuments, setCommonDocuments] = useState([
    'Acte de Mariage',
    'Acte de Naissance',
    'Attestation de Propriété',
    'Autorisation Urbanisme',
    'Certificat Foncier',
    'CNI / Passeport',
    'Contrat de Vente',
    'Factures (Eau, Électricité)',
    'Permis de Construire',
    'Photocopie Livret Foncier',
    'Plan Cadastral',
    'Plan de Masse et de Situation',
    'Plan de Situation',
    'Procès-Verbal de Bornage',
    'Titre Foncier'
  ].sort((a, b) => a.localeCompare(b, 'fr')));

  // Departments avec leurs procédures - sorted alphabetically by name
  const [departments, setDepartments] = useState([
    {
      id: 'financing',
      name: 'Financement Foncier et Immobilier',
      code: 'FFI',
      procedures: [
        'Offre 1 : Partenariat de Développement Foncier ou Immobilier',
        'Offre 2 : Assistance Technique & Juridique Personnalisée',
        'Offre 3 : Accompagnement Complet sur Projet Clé-en-main'
      ].sort((a, b) => a.localeCompare(b, 'fr'))
    },
    {
      id: 'land-cadastral',
      name: 'Gestion Foncière et Cadastrale',
      code: 'GFC',
      procedures: [
        'Offres Foncières',
        'Offres Cadastrales',
        'Offres Administratives',
        'Offres Techniques'
      ].sort((a, b) => a.localeCompare(b, 'fr')) 
    },
    {
      id: 'sales-management',
      name: 'Vente et Gestion Immobilière',
      code: 'VGI',
      procedures: [
        'Offre 1 : Vente de Biens Immobiliers',
        'Offre 2 : Acquisition de Biens Immobiliers',
        'Offre 3 : Achat de Biens Immobiliers via la Plateforme',
        'Offre 4 : Promotion & Marketing Immobilier'
      ].sort((a, b) => a.localeCompare(b, 'fr'))
    }
  ].sort((a, b) => a.name.localeCompare(b.name, 'fr')));

  // Client types - sorted alphabetically
  const [clientTypes, setClientTypes] = useState([
    'Avocat',
    'Collectivité locale / Communauté',
    'Entreprise privée',
    'Géomètre Expert',
    'Héritier / Succession',
    'Investisseur',
    'Notaire',
    'Promoteur immobilier',
    'Propriétaire'
  ].sort((a, b) => a.localeCompare(b, 'fr')));

  // Offres par procédure
  const proceduresOffres: {[key: string]: string[]} = {
    'Offres Foncières': [
      'Concession Définitive',
      'Concession Provisoire',
      'Gré à gré',
      'Immatriculation Directe'
    ].sort((a, b) => a.localeCompare(b, 'fr')),
    'Offres Administratives': [
      'Duplication',
      'Morcellement Judiciaire',
      'Mutation Judiciaire',
      'Mutation par Décès',
      'Rectification'
    ].sort((a, b) => a.localeCompare(b, 'fr')),
    'Offres Cadastrales': [
      'Découpage et partage',
      'Lotissement',
      'Morcellement notarié',
      'Mutation notariée'
    ].sort((a, b) => a.localeCompare(b, 'fr')),
    'Offres Techniques': [
      'Bornage',
      'État des lieux',
      'Expertise Foncière',
      'Plans Cadastraux',
      'Plans de Masse'
    ].sort((a, b) => a.localeCompare(b, 'fr'))
  };

  // Empêcher le défilement de l'arrière-plan quand le formulaire est ouvert
  useEffect(() => {
    // Sauvegarder la position de défilement actuelle
    const scrollY = window.scrollY;
    
    // Empêcher le défilement
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';

    // Nettoyer lors du démontage du composant
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollY);
    };
  }, []);

  // Initialize form with edit data if provided
  useEffect(() => {
    if (editData) {
      setIsEditMode(true);
      setFormData(prev => ({
        ...prev,
        client_nom: editData.client_nom || '',
        client_type: editData.client_type || '',
        client_email: editData.client_email || '',
        client_phone: editData.client_phone || '',
        client_adresse: editData.client_adresse || '',
        nom_du_dossier: editData.nom_du_dossier || '',
        procedure_choisie: editData.procedure_choisie || '',
        offre_choisie: editData.offre_choisie || '',
        description: editData.description || '',
        region: editData.region || '',
        departement: editData.departement || '',
        ville: editData.ville || '',
        lieu_dit: editData.lieu_dit || '',
        contact_terrain_nom: editData.contact_terrain_nom || '',
        contact_terrain_qualite: editData.contact_terrain_qualite || '',
        contact_terrain_phone: editData.contact_terrain_phone || '',
        demande_par: editData.demande_par || 'courriel',
        priorite: editData.priorite || 'normale',
        statut: editData.statut || 'nouvelles',
        department_id: editData.department_id || '',
        documents: editData.documents || []
      }));

      // Handle documents from editData
      if (editData.documents_physiques && editData.documents_physiques.length > 0) {
        const physicalDocs = editData.documents_physiques.map((docName: string) => ({
          id: `physique-${Date.now()}-${Math.random()}`,
          nom: docName,
          types: ['physique'],
          fichiers: []
        }));

        setFormData(prev => ({
          ...prev,
          documents: [...prev.documents, ...physicalDocs]
        }));
      }

      if (editData.documents_numeriques && editData.documents_numeriques.length > 0) {
        const digitalDocs = editData.documents_numeriques.map((docName: string) => ({
          id: `numerique-${Date.now()}-${Math.random()}`,
          nom: docName,
          types: ['numerique'],
          fichiers: []
        }));

        setFormData(prev => ({
          ...prev,
          documents: [...prev.documents, ...digitalDocs]
        }));
      }
    }
  }, [editData]);

  // // Gérer le clic sur l'arrière-plan
  // const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
  //   if (e.target === e.currentTarget) {
  //     onClose();
  //   }
  // };

  // Check if all required fields are filled
  const isFormValid = () => {
    return (
      formData.client_nom?.trim() &&
      formData.client_type?.trim() &&
      formData.department_id?.trim() &&
      formData.procedure_choisie?.trim() &&
      formData.region?.trim() &&
      formData.ville?.trim()
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      alert('Veuillez remplir tous les champs obligatoires (*)');
      return;
    }

    setLoading(true);

    try {
      let prestationData;
      
      if (isEditMode && editData) {
        // Update existing prestation
        prestationData = await updatePrestation(editData.id, formData);
      } else {
        // Create new prestation
        prestationData = await createPrestation(formData);
      }
      
      onSuccess?.(prestationData);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la création/modification:', error);
      alert(`Erreur lors de ${isEditMode ? 'la modification' : 'la création'} de la prestation`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof PrestationFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDepartmentChange = (departmentId: string) => {
    setFormData(prev => ({
      ...prev,
      department_id: departmentId,
      procedure_choisie: '', // Reset procedure when department changes
      offre_choisie: '' // Reset offer when procedure changes
    }));
  };

  const handleProcedureChange = (procedure: string) => {
    setFormData(prev => ({
      ...prev,
      procedure_choisie: procedure,
      offre_choisie: '' // Reset offer when procedure changes
    }));
  };

  // Get available offers based on selected procedure
  const availableOffres = formData.procedure_choisie && proceduresOffres[formData.procedure_choisie]
    ? proceduresOffres[formData.procedure_choisie]
    : [];

  // Ajouter un nouveau département
  const addNewDepartment = () => {
    if (!newDepartmentName.trim()) return;

    const newDepartment = {
      id: `custom-${Date.now()}`,
      name: newDepartmentName.trim(),
      code: 'CUST',
      procedures: []
    };

    const updatedDepartments = [...departments, newDepartment]
      .sort((a, b) => a.name.localeCompare(b.name, 'fr'));
    
    setDepartments(updatedDepartments);
    setFormData(prev => ({ ...prev, department_id: newDepartment.id }));
    setNewDepartmentName('');
    setShowAddDepartment(false);
  };

  // Ajouter une nouvelle procédure
  const addNewProcedure = () => {
    if (!newProcedureName.trim()) return;

    const selectedDept = departments.find(dept => dept.id === formData.department_id);
    if (selectedDept) {
      const updatedDepartments = departments.map(dept => {
        if (dept.id === selectedDept.id) {
          const updatedProcedures = [...dept.procedures, newProcedureName.trim()]
            .sort((a, b) => a.localeCompare(b, 'fr'));
          return { ...dept, procedures: updatedProcedures };
        }
        return dept;
      });

      setDepartments(updatedDepartments);
      setFormData(prev => ({ ...prev, procedure_choisie: newProcedureName.trim() }));
      setNewProcedureName('');
      setShowAddProcedure(false);
    }
  };

  // Ajouter un nouveau type de client
  const addNewClientType = () => {
    if (!newClientType.trim()) return;

    const updatedClientTypes = [...clientTypes, newClientType.trim()]
      .sort((a, b) => a.localeCompare(b, 'fr'));
    
    setClientTypes(updatedClientTypes);
    setFormData(prev => ({ ...prev, client_type: newClientType.trim() }));
    setNewClientType('');
    setShowAddClientType(false);
  };

  // Gérer l'ajout de document
  const addDocument = (documentName: string) => {
    if (!documentName.trim()) return;

    const newDocument: DocumentItem = {
      id: Date.now().toString(),
      nom: documentName.trim(),
      types: ['physique'], // Default to physical only
      fichiers: []
    };

    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, newDocument]
    }));
  };

  // Supprimer un document
  const removeDocument = (documentId: string) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter(doc => doc.id !== documentId)
    }));
  };

  // Ajouter ou retirer un type de document
  const toggleDocumentType = (documentId: string, type: 'physique' | 'numerique') => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.map(doc => {
        if (doc.id === documentId) {
          const currentTypes = doc.types || [];
          const newTypes = currentTypes.includes(type)
            ? currentTypes.filter(t => t !== type)
            : [...currentTypes, type];
          
          return { 
            ...doc, 
            types: newTypes,
            // Remove file if removing numérique type
            fichiers: type === 'numerique' && !newTypes.includes('numerique') 
              ? [] 
              : doc.fichiers
          };
        }
        return doc;
      })
    }));
  };

  // Gérer l'upload de fichier
  const handleFileUpload = (documentId: string, file: File) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.map(doc => 
        doc.id === documentId ? { 
          ...doc, 
          fichiers: [file] // Replace existing file
        } : doc
      )
    }));
  };

  // Supprimer le fichier uploadé
  const removeFile = (documentId: string) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.map(doc => 
        doc.id === documentId ? { 
          ...doc, 
          fichiers: [] 
        } : doc
      )
    }));
  };

  // Ajouter un nouveau document à la liste commune
  const addNewCommonDocument = () => {
    if (!newDocumentName.trim()) return;

    const updatedDocuments = [...commonDocuments, newDocumentName.trim()]
      .sort((a, b) => a.localeCompare(b, 'fr'));
    
    setCommonDocuments(updatedDocuments);
    addDocument(newDocumentName.trim());
    setNewDocumentName('');
  };

  const selectedDepartment = departments.find(d => d.id === formData.department_id);
  const availableProcedures = selectedDepartment ? selectedDepartment.procedures : [];

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      // onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-3xl max-w-6xl w-full max-h-[95vh] overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()} // Empêcher la fermeture quand on clique sur le formulaire
      >
        {/* Fixed Header */}
        <div className="flex-shrink-0">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-3xl p-8 text-white sticky top-0 z-10 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                  <FileText className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold">
                    {isEditMode ? 'Modifier la Prestation' : 'Nouvelle Demande de Prestation'}
                  </h2>
                  <p className="text-blue-100 text-lg">
                    {isEditMode ? 'Modification de la prestation GeoCasa Group' : 'Formulaire de création de prestation GeoCasa Group'}
                  </p>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 p-3 rounded-2xl hover:bg-white/10 transition-all duration-200"
              >
                <X className="w-7 h-7" />
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Section 1: Informations Client */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200 shadow-lg">
              <h3 className="text-2xl font-bold text-blue-900 mb-6 flex items-center">
                <User className="w-6 h-6 mr-3" />
                1. Informations Client
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Nom complet du client <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.client_nom || ''}
                    onChange={(e) => handleChange('client_nom', e.target.value)}
                    className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg"
                    placeholder="Nom complet du client"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Type de client <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-3">
                    <select
                      required
                      value={formData.client_type || ''}
                      onChange={(e) => {
                        if (e.target.value === 'custom') {
                          setShowAddClientType(true);
                        } else {
                          handleChange('client_type', e.target.value);
                        }
                      }}
                      className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg"
                    >
                      <option value="">Sélectionner le type de client</option>
                      {clientTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                      <option value="custom">➕ Ajouter un nouveau type</option>
                    </select>
                    
                    {showAddClientType && (
                      <div className="flex items-center space-x-2 p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
                        <Plus className="w-5 h-5 text-blue-600" />
                        <input
                          type="text"
                          placeholder="Saisir le nouveau type de client"
                          value={newClientType}
                          onChange={(e) => setNewClientType(e.target.value)}
                          className="flex-1 px-4 py-3 border-2 border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button
                          type="button"
                          onClick={addNewClientType}
                          className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold"
                        >
                          Ajouter
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowAddClientType(false)}
                          className="px-4 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 font-semibold"
                        >
                          Annuler
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Email</label>
                  <input
                    type="email"
                    value={formData.client_email || ''}
                    onChange={(e) => handleChange('client_email', e.target.value)}
                    className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg"
                    placeholder="email@exemple.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Téléphone</label>
                  <input
                    type="tel"
                    value={formData.client_phone || ''}
                    onChange={(e) => handleChange('client_phone', e.target.value)}
                    className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg"
                    placeholder="+237 6XX XXX XXX"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Adresse complète</label>
                  <input
                    type="text"
                    value={formData.client_adresse || ''}
                    onChange={(e) => handleChange('client_adresse', e.target.value)}
                    className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg"
                    placeholder="Adresse complète du client"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200 shadow-lg">
              <h3 className="text-2xl font-bold text-green-900 mb-6 flex items-center">
                <Building2 className="w-6 h-6 mr-3" />
                2. Activité et Procédure
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Nom du dossier - Nouvel input ajouté */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Nom du dossier <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nom_du_dossier || ''}
                    onChange={(e) => handleChange('nom_du_dossier', e.target.value)}
                    className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-lg"
                    placeholder="Entrez le nom du dossier..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Département d'activité <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-3">
                    <select
                      required
                      value={formData.department_id || ''}
                      onChange={(e) => {
                        if (e.target.value === 'custom') {
                          setShowAddDepartment(true);
                        } else {
                          handleDepartmentChange(e.target.value);
                        }
                      }}
                      className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-lg"
                    >
                      <option value="">Sélectionner le département</option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                      ))}
                      <option value="custom">➕ Ajouter un nouveau département</option>
                    </select>
                    
                    {showAddDepartment && (
                      <div className="flex items-center space-x-2 p-4 bg-green-50 rounded-xl border-2 border-green-200">
                        <Plus className="w-5 h-5 text-green-600" />
                        <input
                          type="text"
                          placeholder="Saisir le nom du nouveau département"
                          value={newDepartmentName}
                          onChange={(e) => setNewDepartmentName(e.target.value)}
                          className="flex-1 px-4 py-3 border-2 border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                        <button
                          type="button"
                          onClick={addNewDepartment}
                          className="px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 font-semibold"
                        >
                          Ajouter
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowAddDepartment(false)}
                          className="px-4 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 font-semibold"
                        >
                          Annuler
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Offre choisie <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-3">
                    <select
                      required
                      value={formData.procedure_choisie || ''}
                      onChange={(e) => {
                        if (e.target.value === 'custom') {
                          setShowAddProcedure(true);
                        } else {
                          handleProcedureChange(e.target.value);
                        }
                      }}
                      className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-lg"
                      disabled={!formData.department_id}
                    >
                      <option value="">
                        {formData.department_id ? 'Sélectionner la Offre' : 'Sélectionner d\'abord un département'}
                      </option>
                      {availableProcedures.map((procedure) => (
                        <option key={procedure} value={procedure}>{procedure}</option>
                      ))}
                      {formData.department_id && (
                        <option value="custom">➕ Ajouter une nouvelle Offre</option>
                      )}
                    </select>
                    
                    {showAddProcedure && (
                      <div className="flex items-center space-x-2 p-4 bg-green-50 rounded-xl border-2 border-green-200">
                        <Plus className="w-5 h-5 text-green-600" />
                        <input
                          type="text"
                          placeholder="Saisir le nom de la nouvelle Offre"
                          value={newProcedureName}
                          onChange={(e) => setNewProcedureName(e.target.value)}
                          className="flex-1 px-4 py-3 border-2 border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                        <button
                          type="button"
                          onClick={addNewProcedure}
                          className="px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 font-semibold"
                        >
                          Ajouter
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowAddProcedure(false)}
                          className="px-4 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 font-semibold"
                        >
                          Annuler
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Offres disponibles - appears only if procedure has offers */}
                {availableOffres.length > 0 && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Procédure choisie <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={formData.offre_choisie || ''}
                      onChange={(e) => handleChange('offre_choisie', e.target.value)}
                      className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-lg"
                    >
                      <option value="">Sélectionner la Procédure</option>
                      {availableOffres.map((offre) => (
                        <option key={offre} value={offre}>{offre}</option>
                      ))}
                    </select>
                    <p className="text-sm text-gray-500 mt-2">
                      💡 Choisissez l'offre qui correspond le mieux à vos besoins
                    </p>
                  </div>
                )}

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Description détaillée</label>
                  <textarea
                    rows={4}
                    value={formData.description || ''}
                    onChange={(e) => handleChange('description', e.target.value)}
                    className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-lg"
                    placeholder="Description détaillée de la prestation demandée..."
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Localisation */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-8 border border-yellow-200 shadow-lg">
              <h3 className="text-2xl font-bold text-yellow-900 mb-6 flex items-center">
                <MapPin className="w-6 h-6 mr-3" />
                3. Localisation du Projet
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Région <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.region || ''}
                    onChange={(e) => handleChange('region', e.target.value)}
                    className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200 text-lg"
                    placeholder="Centre, Littoral, etc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Département</label>
                  <input
                    type="text"
                    value={formData.departement || ''}
                    onChange={(e) => handleChange('departement', e.target.value)}
                    className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200 text-lg"
                    placeholder="Mfoundi, Wouri, etc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Ville <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.ville || ''}
                    onChange={(e) => handleChange('ville', e.target.value)}
                    className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200 text-lg"
                    placeholder="Yaoundé, Douala, etc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Lieu-dit</label>
                  <input
                    type="text"
                    value={formData.lieu_dit || ''}
                    onChange={(e) => handleChange('lieu_dit', e.target.value)}
                    className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200 text-lg"
                    placeholder="Bastos, Bonanjo, etc."
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Contact Terrain */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-200 shadow-lg">
              <h3 className="text-2xl font-bold text-purple-900 mb-6 flex items-center">
                <Phone className="w-6 h-6 mr-3" />
                4. Contact Terrain
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Nom du contact</label>
                  <input
                    type="text"
                    value={formData.contact_terrain_nom || ''}
                    onChange={(e) => handleChange('contact_terrain_nom', e.target.value)}
                    className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-lg"
                    placeholder="Nom du contact sur le terrain"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Qualité</label>
                  <input
                    type="text"
                    value={formData.contact_terrain_qualite || ''}
                    onChange={(e) => handleChange('contact_terrain_qualite', e.target.value)}
                    className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-lg"
                    placeholder="Géomètre, Mandataire, etc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Téléphone</label>
                  <input
                    type="tel"
                    value={formData.contact_terrain_phone || ''}
                    onChange={(e) => handleChange('contact_terrain_phone', e.target.value)}
                    className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-lg"
                    placeholder="+237 6XX XXX XXX"
                  />
                </div>
              </div>
            </div>

            {/* Section 5: Documents Fournis par le Client */}
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-8 border border-teal-200 shadow-lg">
              <h3 className="text-2xl font-bold text-teal-900 mb-6 flex items-center">
                <FileText className="w-6 h-6 mr-3" />
                5. Documents Fournis par le Client
              </h3>

              <div className="space-y-6">
                {/* Documents communs rapides */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Documents courants (cliquez pour ajouter)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {commonDocuments.map((docName) => (
                      <button
                        key={docName}
                        type="button"
                        onClick={() => addDocument(docName)}
                        className="p-3 text-left bg-white border-2 border-gray-300 rounded-xl hover:border-teal-500 hover:bg-teal-50 transition-all duration-200 text-sm"
                      >
                        <FileText className="w-4 h-4 inline mr-2 text-teal-600" />
                        {docName}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ajout manuel de document */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Ajouter un document personnalisé
                  </label>
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      placeholder="Nom du document personnalisé..."
                      value={newDocumentName}
                      onChange={(e) => setNewDocumentName(e.target.value)}
                      className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                    <button
                      type="button"
                      onClick={addNewCommonDocument}
                      className="px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 flex items-center space-x-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Ajouter</span>
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    💡 Le document sera ajouté à la fois à votre liste et à la liste commune
                  </p>
                </div>

                {/* Liste des documents ajoutés */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Documents du dossier ({formData.documents.length})
                  </label>

                  <div className="space-y-4">
                    {formData.documents.map((doc) => (
                      <div key={doc.id} className="bg-white rounded-xl border-2 border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 flex-1">
                            <FileText className="w-5 h-5 text-teal-600" />
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900">{doc.nom}</div>
                              <div className="text-sm text-gray-600 mt-3">
                                {/* Boutons pour choisir les types */}
                                <div className="flex space-x-3">
                                  <button
                                    type="button"
                                    onClick={() => toggleDocumentType(doc.id, 'physique')}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
                                      doc.types?.includes('physique')
                                        ? 'bg-orange-100 text-orange-800 border-2 border-orange-300'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-2 border-gray-200'
                                    }`}
                                  >
                                    <span>📄</span>
                                    <span>Physique</span>
                                    {doc.types?.includes('physique') && (
                                      <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                                    )}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => toggleDocumentType(doc.id, 'numerique')}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
                                      doc.types?.includes('numerique')
                                        ? 'bg-blue-100 text-blue-800 border-2 border-blue-300'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-2 border-gray-200'
                                    }`}
                                  >
                                    <span>📎</span>
                                    <span>Numérique</span>
                                    {doc.types?.includes('numerique') && (
                                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                    )}
                                  </button>
                                </div>
                                
                                {/* Section upload pour documents numériques */}
                                {doc.types?.includes('numerique') && (
                                  <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center space-x-3">
                                        <label className="cursor-pointer">
                                          <input
                                            type="file"
                                            className="hidden"
                                            onChange={(e) => {
                                              if (e.target.files && e.target.files[0]) {
                                                handleFileUpload(doc.id, e.target.files[0]);
                                              }
                                            }}
                                          />
                                          <div className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 text-sm">
                                            <Paperclip className="w-4 h-4" />
                                            <span>{doc.fichiers && doc.fichiers.length > 0 ? 'Changer le fichier' : 'Ajouter un fichier'}</span>
                                          </div>
                                        </label>
                                        {doc.fichiers && doc.fichiers.length > 0 && (
                                          <div className="flex items-center space-x-2">
                                            <div className="text-sm text-green-600 flex items-center space-x-1">
                                              <File className="w-4 h-4" />
                                              <span>{doc.fichiers[0].name}</span>
                                            </div>
                                            <button
                                              type="button"
                                              onClick={() => removeFile(doc.id)}
                                              className="p-1 text-red-600 hover:bg-red-100 rounded"
                                            >
                                              <Trash2 className="w-3 h-3" />
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    <p className="text-xs text-blue-600 mt-2">
                                      ✓ Ce document existe en version numérique ET physique
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Bouton supprimer */}
                          <button
                            type="button"
                            onClick={() => removeDocument(doc.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg ml-4"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {formData.documents.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>Aucun document ajouté pour le moment</p>
                        <p className="text-sm">Utilisez les boutons ci-dessus pour ajouter des documents</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-6 pt-8 border-t-2 border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-all duration-200 text-lg font-semibold"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading || !isFormValid()}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold shadow-xl"
              >
                <Save className="w-6 h-6" />
                <span>{loading ? (isEditMode ? 'Modification en cours...' : 'Création en cours...') : (isEditMode ? 'Modifier la Prestation' : 'Créer la Prestation')}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PrestationForm;