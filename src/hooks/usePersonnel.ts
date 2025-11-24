import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { HRPersonnel, HRDocument, HRAlert } from '../types';

export interface MultiAssignments {
  departments: Array<{ id: string; name: string; is_primary: boolean }>;
  divisions: Array<{ id: string; name: string; is_primary: boolean }>;
  offices: Array<{ id: string; name: string; is_primary: boolean }>;
}

export function usePersonnel() {
  const [personnel, setPersonnel] = useState<HRPersonnel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPersonnel();
  }, []);

  const fetchPersonnel = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('hr_personnel')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setPersonnel(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching personnel');
    } finally {
      setLoading(false);
    }
  };

  const addPersonnel = async (personnelData: Partial<HRPersonnel>) => {
    try {
      const cleanedData = { ...personnelData };

      if (cleanedData.primes_indemnites && Object.keys(cleanedData.primes_indemnites).length === 0) {
        cleanedData.primes_indemnites = {};
      }
      if (cleanedData.avantages_nature && Object.keys(cleanedData.avantages_nature).length === 0) {
        cleanedData.avantages_nature = {};
      }

      const { data, error: insertError } = await supabase
        .from('hr_personnel')
        .insert(cleanedData)
        .select()
        .single();

      if (insertError) {
        console.error('Insert error details:', insertError);
        throw insertError;
      }

      setPersonnel((prev) => [data, ...prev]);
      return { success: true, data };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error adding personnel';
      setError(message);
      return { success: false, error: message };
    }
  };

  const addPersonnelWithAssignments = async (
    personnelData: Partial<HRPersonnel>,
    assignments: MultiAssignments
  ) => {
    try {
      const result = await addPersonnel(personnelData);

      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to create personnel');
      }

      const personnelId = result.data.id;

      const { data: systemUser, error: userError } = await supabase
        .from('system_users')
        .select('id')
        .eq('personnel_id', personnelId)
        .single();

      if (userError || !systemUser) {
        console.error('System user not created automatically:', userError);
        return result;
      }

      const userId = systemUser.id;

      if (assignments.departments.length > 0) {
        const deptAssignments = assignments.departments.map((dept) => ({
          user_id: userId,
          department_id: dept.id,
          department_name: dept.name,
          is_primary: dept.is_primary,
          role_in_department: personnelData.poste_occupe,
          access_level: 'Editor',
          can_create_documents: true,
          can_view_documents: true,
        }));

        await supabase.from('user_departments').insert(deptAssignments);
      }

      if (assignments.divisions.length > 0) {
        const divAssignments = assignments.divisions.map((div) => ({
          user_id: userId,
          division_id: div.id,
          division_name: div.name,
          is_primary: div.is_primary,
          role_in_division: personnelData.poste_occupe,
          access_level: 'Editor',
          can_create_documents: true,
          can_view_documents: true,
        }));

        await supabase.from('user_divisions').insert(divAssignments);
      }

      if (assignments.offices.length > 0) {
        const officeAssignments = assignments.offices.map((office) => ({
          user_id: userId,
          office_id: office.id,
          office_name: office.name,
          is_primary: office.is_primary,
          role_in_office: personnelData.poste_occupe,
          access_level: 'Editor',
          can_create_documents: true,
          can_view_documents: true,
        }));

        await supabase.from('user_offices').insert(officeAssignments);
      }

      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error adding personnel with assignments';
      setError(message);
      return { success: false, error: message };
    }
  };

  const updatePersonnel = async (id: string, updates: Partial<HRPersonnel>) => {
    try {
      const { data, error: updateError } = await supabase
        .from('hr_personnel')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      setPersonnel((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...data } : p))
      );
      return { success: true, data };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error updating personnel';
      setError(message);
      return { success: false, error: message };
    }
  };

  const deletePersonnel = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('hr_personnel')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      setPersonnel((prev) => prev.filter((p) => p.id !== id));
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error deleting personnel';
      setError(message);
      return { success: false, error: message };
    }
  };

  const validatePersonnel = async (
    id: string,
    validationType: 'chef' | 'drh',
    validatorId: string
  ) => {
    try {
      const updates: Partial<HRPersonnel> = {};

      if (validationType === 'chef') {
        updates.statut_validation = 'Validé Chef Bureau';
        updates.valide_par_chef_bureau = validatorId;
        updates.date_validation_chef = new Date().toISOString();
      } else {
        updates.statut_validation = 'Actif';
        updates.valide_par_drh = validatorId;
        updates.date_validation_drh = new Date().toISOString();
      }

      return await updatePersonnel(id, updates);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error validating personnel';
      setError(message);
      return { success: false, error: message };
    }
  };

  const uploadDocument = async (
    personnelId: string,
    documentData: Partial<HRDocument>
  ) => {
    try {
      const { data, error: uploadError } = await supabase
        .from('hr_documents')
        .insert([{ ...documentData, personnel_id: personnelId }])
        .select()
        .single();

      if (uploadError) throw uploadError;
      return { success: true, data };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error uploading document';
      return { success: false, error: message };
    }
  };

  const getPersonnelDocuments = async (personnelId: string) => {
    try {
      const { data, error: fetchError } = await supabase
        .from('hr_documents')
        .select('*')
        .eq('personnel_id', personnelId)
        .eq('is_current', true)
        .order('uploaded_at', { ascending: false });

      if (fetchError) throw fetchError;
      return { success: true, data };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error fetching documents';
      return { success: false, error: message };
    }
  };

  const createAlert = async (alertData: Partial<HRAlert>) => {
    try {
      const { data, error: insertError } = await supabase
        .from('hr_alerts')
        .insert([alertData])
        .select()
        .single();

      if (insertError) throw insertError;
      return { success: true, data };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error creating alert';
      return { success: false, error: message };
    }
  };

  const getActiveAlerts = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('hr_alerts')
        .select('*')
        .eq('statut', 'Active')
        .order('priorite', { ascending: false })
        .order('date_echeance', { ascending: true });

      if (fetchError) throw fetchError;
      return { success: true, data };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error fetching alerts';
      return { success: false, error: message };
    }
  };

  const getPersonnelStats = async () => {
    try {
      const { data: allPersonnel, error: fetchError } = await supabase
        .from('hr_personnel')
        .select('statut_validation, type_contrat, division_affectation, is_active');

      if (fetchError) throw fetchError;

      const stats = {
        total: allPersonnel?.length || 0,
        active: allPersonnel?.filter((p) => p.is_active).length || 0,
        pending: allPersonnel?.filter((p) => p.statut_validation === 'En cours').length || 0,
        validated: allPersonnel?.filter((p) => p.statut_validation === 'Actif').length || 0,
        byContract: {} as Record<string, number>,
        byDivision: {} as Record<string, number>,
      };

      allPersonnel?.forEach((p) => {
        stats.byContract[p.type_contrat] = (stats.byContract[p.type_contrat] || 0) + 1;
        stats.byDivision[p.division_affectation] =
          (stats.byDivision[p.division_affectation] || 0) + 1;
      });

      return { success: true, data: stats };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error fetching stats';
      return { success: false, error: message };
    }
  };

  return {
    personnel,
    loading,
    error,
    fetchPersonnel,
    addPersonnel,
    addPersonnelWithAssignments,
    updatePersonnel,
    deletePersonnel,
    validatePersonnel,
    uploadDocument,
    getPersonnelDocuments,
    createAlert,
    getActiveAlerts,
    getPersonnelStats,
  };
}
