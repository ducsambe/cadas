import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { HRSocialClimate } from '../types';

export function useSocialClimate() {
  const [surveys, setSurveys] = useState<HRSocialClimate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSurveys();
  }, []);

  const fetchSurveys = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('hr_social_climate')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setSurveys(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching surveys');
    } finally {
      setLoading(false);
    }
  };

  const addSurvey = async (surveyData: Partial<HRSocialClimate>) => {
    try {
      const { data, error: insertError } = await supabase
        .from('hr_social_climate')
        .insert([surveyData])
        .select()
        .single();

      if (insertError) throw insertError;
      setSurveys((prev) => [data, ...prev]);
      return { success: true, data };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error adding survey';
      setError(message);
      return { success: false, error: message };
    }
  };

  const updateSurvey = async (id: string, updates: Partial<HRSocialClimate>) => {
    try {
      const { data, error: updateError } = await supabase
        .from('hr_social_climate')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;
      setSurveys((prev) => prev.map((s) => (s.id === id ? { ...s, ...data } : s)));
      return { success: true, data };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error updating survey';
      setError(message);
      return { success: false, error: message };
    }
  };

  return {
    surveys,
    loading,
    error,
    fetchSurveys,
    addSurvey,
    updateSurvey,
  };
}
