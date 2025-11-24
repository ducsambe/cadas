import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type Courrier = Database['public']['Tables']['courriers']['Row'];
type CourrierInsert = Database['public']['Tables']['courriers']['Insert'];
type CourrierUpdate = Database['public']['Tables']['courriers']['Update'];

export const useCourriers = () => {
  const [courriers, setCourriers] = useState<Courrier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger tous les courriers
  const fetchCourriers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('courriers')
        .select('*')
        .order('date_courrier', { ascending: false });

      if (error) throw error;
      setCourriers(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  // Créer un nouveau courrier
  const createCourrier = async (courrier: Omit<CourrierInsert, 'numero'>) => {
    try {
      const numero = `COUR-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
      
      const { data, error } = await supabase
        .from('courriers')
        .insert({ ...courrier, numero })
        .select()
        .single();

      if (error) throw error;
      
      setCourriers(prev => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création');
      throw err;
    }
  };

  // Mettre à jour un courrier
  const updateCourrier = async (id: string, updates: CourrierUpdate) => {
    try {
      const { data, error } = await supabase
        .from('courriers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setCourriers(prev => prev.map(c => c.id === id ? data : c));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
      throw err;
    }
  };

  // Supprimer un courrier
  const deleteCourrier = async (id: string) => {
    try {
      const { error } = await supabase
        .from('courriers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setCourriers(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
      throw err;
    }
  };

  // Obtenir les statistiques
  const getStats = () => {
    const stats = {
      total: courriers.length,
      entrants: courriers.filter(c => c.type_courrier === 'entrant').length,
      sortants: courriers.filter(c => c.type_courrier === 'sortant').length,
      nouveau: courriers.filter(c => c.statut === 'nouveau').length,
      traite: courriers.filter(c => c.statut === 'traite').length,
      urgent: courriers.filter(c => c.statut === 'urgent').length,
    };
    return stats;
  };

  useEffect(() => {
    fetchCourriers();
  }, []);

  return {
    courriers,
    loading,
    error,
    createCourrier,
    updateCourrier,
    deleteCourrier,
    refreshCourriers: fetchCourriers,
    stats: getStats()
  };
};