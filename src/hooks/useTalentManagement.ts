import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { HRTalentManagement } from '../types';

export function useTalentManagement() {
  const [talents, setTalents] = useState<HRTalentManagement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTalents();
  }, []);

  const fetchTalents = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('hr_talent_management')
        .select('*')
        .order('date_evaluation', { ascending: false });

      if (fetchError) throw fetchError;
      setTalents(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching talents');
    } finally {
      setLoading(false);
    }
  };

  const addTalent = async (talentData: Partial<HRTalentManagement>) => {
    try {
      const { data, error: insertError } = await supabase
        .from('hr_talent_management')
        .insert([talentData])
        .select()
        .single();

      if (insertError) throw insertError;
      setTalents((prev) => [data, ...prev]);
      return { success: true, data };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error adding talent';
      setError(message);
      return { success: false, error: message };
    }
  };

  const updateTalent = async (id: string, updates: Partial<HRTalentManagement>) => {
    try {
      const { data, error: updateError } = await supabase
        .from('hr_talent_management')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;
      setTalents((prev) => prev.map((t) => (t.id === id ? { ...t, ...data } : t)));
      return { success: true, data };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error updating talent';
      setError(message);
      return { success: false, error: message };
    }
  };

  return {
    talents,
    loading,
    error,
    fetchTalents,
    addTalent,
    updateTalent,
  };
}
