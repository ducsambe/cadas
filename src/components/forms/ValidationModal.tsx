import React, { useState, useEffect, useRef } from 'react';
import { X, Send, CheckCircle, Building2 } from 'lucide-react';
import { usePrestations } from '../../hooks/usePrestations';

interface ValidationModalProps {
  prestation: any;
  onClose: () => void;
  onSuccess: () => void;
}

const ValidationModal: React.FC<ValidationModalProps> = ({ 
  prestation, 
  onClose, 
  onSuccess 
}) => {
  const { updatePrestation } = usePrestations();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    assigned_department: '',
    priorite: prestation.priorite || 'normale',
    validation_notes: ''
  });

  const modalRef = useRef<HTMLDivElement>(null);

  // Départements disponibles
  const departments = [
    { 
      id: 'land-cadastral', 
      name: 'Gestion Foncière et Cadastrale',
      description: 'Gestion des dossiers fonciers, études cadastrales et conseil juridique'
    },
    { 
      id: 'financing', 
      name: 'Financement Foncier et Immobilier',
      description: 'Montage financier, ingénierie de projet et partenariats investisseurs'
    },
    { 
      id: 'sales-management', 
      name: 'Vente et Gestion Immobilière',
      description: 'Commercialisation, gestion locative et régularisation foncière'
    }
  ];

  const priorityOptions = [
    { 
      value: 'normale', 
      label: 'Normale', 
      description: 'Traitement standard',
      color: 'green',
      icon: '🟢'
    },
    { 
      value: 'urgente', 
      label: 'Urgente', 
      description: 'Traitement accéléré',
      color: 'orange',
      icon: '🟠'
    },
    { 
      value: 'tres urgente', 
      label: 'Très Urgente', 
      description: 'Traitement immédiat',
      color: 'red',
      icon: '🔴'
    }
  ];

  // Handle click outside to close modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    // Handle Escape key to close modal
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);

    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  const handleValidate = async () => {
    if (!formData.assigned_department) {
      alert('Veuillez sélectionner un département');
      return;
    }

    setLoading(true);
    try {
      await updatePrestation(prestation.id, {
        statut: 'receptionnees',
        assigned_department: formData.assigned_department,
        priorite: formData.priorite,
        validation_notes: formData.validation_notes,
        validated_at: new Date().toISOString()
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erreur lors de la validation:', error);
      alert('Erreur lors de la validation');
    } finally {
      setLoading(false);
    }
  };

  const updateFormField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getDepartmentInfo = (departmentId: string) => {
    return departments.find(dept => dept.id === departmentId);
  };

  const getPriorityColorClass = (priorityValue: string, selectedValue: string) => {
    const priority = priorityOptions.find(p => p.value === priorityValue);
    if (!priority) return '';
    
    return selectedValue === priorityValue 
      ? `border-${priority.color}-500 bg-${priority.color}-50 text-${priority.color}-900 shadow-sm`
      : 'border-gray-300 hover:border-gray-400 bg-white';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div 
        ref={modalRef}
        className="bg-white rounded-3xl w-full max-w-4xl max-h-[95vh] overflow-hidden shadow-2xl flex flex-col animate-in fade-in-90 zoom-in-90 duration-300"
      >
        
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-t-3xl p-6 text-white flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Valider la Prestation</h2>
                <p className="text-green-100">Assigner à un département pour traitement</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 p-2 rounded-xl hover:bg-white/10 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content - Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          
          {/* Prestation Information Card */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
            <h3 className="font-bold text-blue-900 mb-4 text-lg">
              Informations de la Prestation
            </h3>
            <div>
                <span className="text-gray-600">Nom Du Dossier:</span>
                <span className="ml-2 font-semibold text-gray-900">
                  {prestation.nom_du_dossier}
                </span>
              </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Numéro:</span>
                <span className="ml-2 font-semibold text-gray-900">
                  {prestation.numero}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Client:</span>
                <span className="ml-2 font-semibold text-gray-900">
                  {prestation.client_nom}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-600">Procédure:</span>
                <span className="ml-2 font-semibold text-gray-900">
                  {prestation.procedure_choisie}
                </span>
              </div>
              {prestation.description && (
                <div className="col-span-2">
                  <span className="text-gray-600">Description:</span>
                  <p className="mt-1 text-gray-900">{prestation.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Validation Form */}
          <div className="space-y-6">
            
            {/* Department Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <Building2 className="w-5 h-5 mr-2" />
                Département assigné <span className="text-red-500 ml-1">*</span>
              </label>

              <div className="mt-4">
                <select
                  value={formData.assigned_department}
                  onChange={(e) => updateFormField('assigned_department', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-base transition-colors"
                >
                  <option value="">Sélectionner un département dans la liste</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Selected Department Info */}
            {formData.assigned_department && (
              <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-4 border border-green-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-green-900">
                      {getDepartmentInfo(formData.assigned_department)?.name}
                    </h4>
                    <p className="text-sm text-green-700">
                      {getDepartmentInfo(formData.assigned_department)?.description}
                    </p>
                  </div>
                </div>
                <div className="mt-3 text-xs text-green-600 bg-green-100 px-3 py-2 rounded-lg">
                  💡 Ce département sera responsable du traitement complet de cette prestation
                </div>
              </div>
            )}

            {/* Priority Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Niveau de priorité
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {priorityOptions.map((prio) => (
                  <button
                    key={prio.value}
                    type="button"
                    onClick={() => updateFormField('priorite', prio.value)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${getPriorityColorClass(prio.value, formData.priorite)}`}
                  >
                    <div className="font-semibold text-lg mb-1">
                      {prio.icon} {prio.label}
                    </div>
                    <div className={`text-sm ${
                      formData.priorite === prio.value ? `text-${prio.color}-700` : 'text-gray-600'
                    }`}>
                      {prio.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Validation Notes */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Notes de validation (optionnel)
              </label>
              <textarea
                rows={4}
                value={formData.validation_notes}
                onChange={(e) => updateFormField('validation_notes', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none transition-colors"
                placeholder="Ajouter des notes ou instructions spécifiques pour le département..."
              />
              <p className="text-sm text-gray-500 mt-2">
                Ces notes seront visibles par le département assigné
              </p>
            </div>
          </div>
        </div>

        {/* Footer - Fixed at Bottom */}
        <div className="bg-gray-50 px-8 py-6 flex items-center justify-between border-t border-gray-200 flex-shrink-0">
          <div className="text-sm text-gray-600">
            {formData.assigned_department ? (
              <span className="text-green-600 font-semibold">
                ✅ Prêt à assigner au département {getDepartmentInfo(formData.assigned_department)?.name}
              </span>
            ) : (
              <span className="text-orange-600">
                ⚠️ Sélectionnez un département pour continuer
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 font-semibold transition-colors min-w-[100px]"
            >
              Annuler
            </button>
            <button
              onClick={handleValidate}
              disabled={loading || !formData.assigned_department}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl hover:from-green-700 hover:to-teal-700 font-semibold flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl min-w-[180px] justify-center"
            >
              <Send className="w-5 h-5" />
              <span>{loading ? 'Validation...' : 'Valider et Assigner'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValidationModal;