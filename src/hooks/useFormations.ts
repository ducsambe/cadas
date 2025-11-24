import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { HRFormation } from '../types';

export function useFormations() {
  const [formations, setFormations] = useState<HRFormation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFormations();
  }, []);

  const fetchFormations = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('hr_formations')
        .select('*')
        .order('date_debut', { ascending: false });

      if (fetchError) throw fetchError;
      setFormations(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching formations');
    } finally {
      setLoading(false);
    }
  };

  const addFormation = async (formationData: Partial<HRFormation>) => {
    try {
      const { data, error: insertError } = await supabase
        .from('hr_formations')
        .insert([formationData])
        .select()
        .single();

      if (insertError) throw insertError;
      setFormations((prev) => [data, ...prev]);
      return { success: true, data };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error adding formation';
      setError(message);
      return { success: false, error: message };
    }
  };

  const updateFormation = async (id: string, updates: Partial<HRFormation>) => {
    try {
      const { data, error: updateError } = await supabase
        .from('hr_formations')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;
      setFormations((prev) => prev.map((f) => (f.id === id ? { ...f, ...data } : f)));
      return { success: true, data };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error updating formation';
      setError(message);
      return { success: false, error: message };
    }
  };

  const getFormationStats = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('hr_formations')
        .select('statut, type_formation, nombre_participants, cout_total');

      if (fetchError) throw fetchError;

      const stats = {
        total: data?.length || 0,
        planifiees: data?.filter((f) => f.statut === 'Planifiée').length || 0,
        en_cours: data?.filter((f) => f.statut === 'En cours').length || 0,
        terminees: data?.filter((f) => f.statut === 'Terminée').length || 0,
        total_participants: data?.reduce((sum, f) => sum + (f.nombre_participants || 0), 0) || 0,
        cout_total: data?.reduce((sum, f) => sum + (f.cout_total || 0), 0) || 0,
        byType: {} as Record<string, number>,
      };

      data?.forEach((f) => {
        stats.byType[f.type_formation] = (stats.byType[f.type_formation] || 0) + 1;
      });

      return { success: true, data: stats };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error fetching stats';
      return { success: false, error: message };
    }
  };

  return {
    formations,
    loading,
    error,
    fetchFormations,
    addFormation,
    updateFormation,
    getFormationStats,
  };
}
