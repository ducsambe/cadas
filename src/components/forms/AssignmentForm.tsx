import { useState } from 'react';
import {
  Building,
  Plus,
  X,
  CheckCircle,
} from 'lucide-react';
import { DEPARTMENTS, DIVISIONS } from '../../constants';

export interface MultiAssignments {
  departments: Array<{ id: string; name: string; is_primary: boolean }>;
  divisions: Array<{ id: string; name: string; is_primary: boolean }>;
  offices: Array<{ id: string; name: string; division_id?: string; is_primary: boolean }>;
}

interface AssignmentFormProps {
  personnelName: string;
  personnelPoste: string;
  onSubmit: (assignments: MultiAssignments) => Promise<void>;
  onSkip: () => void;
}

export function AssignmentForm({
  personnelName,
  personnelPoste,
  onSubmit,
  onSkip,
}: AssignmentFormProps) {
  const [assignments, setAssignments] = useState<MultiAssignments>({
    departments: [],
    divisions: [],
    offices: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (assignments.divisions.length === 0 && assignments.offices.length === 0) {
      setErrors({ assignments: 'Au moins une division ou un bureau doit être sélectionné' });
      return;
    }

    await onSubmit(assignments);
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
      setErrors({});
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
      setErrors({});
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
      setErrors({});
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

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Affectations Multiples - {personnelName}
        </h2>
        <p className="text-gray-600">
          Poste: <span className="font-semibold">{personnelPoste}</span>
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Le personnel a été enregistré avec succès. Vous pouvez maintenant lui assigner des départements, divisions et bureaux.
        </p>
      </div>

      {errors.assignments && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {errors.assignments}
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> L'utilisateur peut être affecté à plusieurs départements, divisions et bureaux.
          Sélectionnez au moins une division ou un bureau. Cochez "Principal" pour définir
          l'affectation principale.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Départements (optionnel)
            </label>
            <div className="space-y-2">
              {DEPARTMENTS.map((dept) => (
                <div key={dept.id} className="flex items-center gap-2">
                  {assignments.departments.find((d) => d.id === dept.id) ? (
                    <div className="flex-1 flex items-center justify-between bg-green-50 border border-green-300 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium">{dept.nameFr}</span>
                        {assignments.departments.find((d) => d.id === dept.id)?.is_primary && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            Principal
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {!assignments.departments.find((d) => d.id === dept.id)?.is_primary && (
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
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => addDepartmentAssignment(dept.id, dept.nameFr)}
                      className="flex-1 flex items-center justify-between border border-gray-300 rounded-lg p-3 hover:bg-gray-50"
                    >
                      <span className="text-sm">{dept.nameFr}</span>
                      <Plus className="w-4 h-4 text-gray-400" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Divisions
            </label>
            <div className="space-y-2">
              {DIVISIONS.map((div) => (
                <div key={div.id} className="flex items-center gap-2">
                  {assignments.divisions.find((d) => d.id === div.id) ? (
                    <div className="flex-1 flex items-center justify-between bg-green-50 border border-green-300 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium">{div.nameFr}</span>
                        {assignments.divisions.find((d) => d.id === div.id)?.is_primary && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            Principal
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {!assignments.divisions.find((d) => d.id === div.id)?.is_primary && (
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
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => addDivisionAssignment(div.id, div.nameFr)}
                      className="flex-1 flex items-center justify-between border border-gray-300 rounded-lg p-3 hover:bg-gray-50"
                    >
                      <span className="text-sm">{div.nameFr}</span>
                      <Plus className="w-4 h-4 text-gray-400" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bureaux
            </label>
            <div className="space-y-2">
              {DIVISIONS.flatMap((div) =>
                div.offices.map((office) => (
                  <div key={office.id} className="flex items-center gap-2">
                    {assignments.offices.find((o) => o.id === office.id) ? (
                      <div className="flex-1 flex items-center justify-between bg-green-50 border border-green-300 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium">{office.nameFr}</span>
                          <span className="text-xs text-gray-500">({div.nameFr})</span>
                          {assignments.offices.find((o) => o.id === office.id)?.is_primary && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                              Principal
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {!assignments.offices.find((o) => o.id === office.id)?.is_primary && (
                            <button
                              type="button"
                              onClick={() => setPrimaryOffice(office.id)}
                              className="text-xs text-blue-600 hover:text-blue-700"
                            >
                              Définir principal
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => removeOfficeAssignment(office.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => addOfficeAssignment(office.id, office.nameFr, div.id)}
                        className="flex-1 flex items-center justify-between border border-gray-300 rounded-lg p-3 hover:bg-gray-50"
                      >
                        <span className="text-sm">
                          {office.nameFr} <span className="text-xs text-gray-500">({div.nameFr})</span>
                        </span>
                        <Plus className="w-4 h-4 text-gray-400" />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg mt-6">
          <h4 className="font-medium text-gray-900 mb-2">Résumé des affectations</h4>
          <div className="space-y-1 text-sm text-gray-700">
            <p>Départements: {assignments.departments.length}</p>
            <p>Divisions: {assignments.divisions.length}</p>
            <p>Bureaux: {assignments.offices.length}</p>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <button
            type="button"
            onClick={onSkip}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Passer cette étape
          </button>

          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            Enregistrer les affectations
          </button>
        </div>
      </form>
    </div>
  );
}