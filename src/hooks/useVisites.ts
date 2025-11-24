import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type Visite = Database['public']['Tables']['visites']['Row'];
type VisiteInsert = Database['public']['Tables']['visites']['Insert'];
type VisiteUpdate = Database['public']['Tables']['visites']['Update'];

export const useVisites = () => {
  const [visites, setVisites] = useState<Visite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger toutes les visites
  const fetchVisites = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('visites')
        .select('*')
        .order('date_debut', { ascending: true });

      if (error) throw error;
      setVisites(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  // Créer une nouvelle visite
  const createVisite = async (visite: Omit<VisiteInsert, 'numero'>) => {
    try {
      const numero = `VIS-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
      
      const { data, error } = await supabase
        .from('visites')
        .insert({ ...visite, numero })
        .select()
        .single();

      if (error) throw error;
      
      // Mettre à jour la liste locale
      setVisites(prev => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création');
      throw err;
    }
  };

  // Mettre à jour une visite
  const updateVisite = async (id: string, updates: VisiteUpdate) => {
    try {
      const { data, error } = await supabase
        .from('visites')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      // Mettre à jour la liste locale
      setVisites(prev => prev.map(v => v.id === id ? data : v));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
      throw err;
    }
  };

  // Supprimer une visite
  const deleteVisite = async (id: string) => {
    try {
      const { error } = await supabase
        .from('visites')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Mettre à jour la liste locale
      setVisites(prev => prev.filter(v => v.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
      throw err;
    }
  };

  // Obtenir les statistiques
  const getStats = () => {
    const now = new Date();
    const stats = {
      total: visites.length,
      planifiee: visites.filter(v => v.statut === 'planifiee').length,
      confirmee: visites.filter(v => v.statut === 'confirmee').length,
      en_cours: visites.filter(v => v.statut === 'en_cours').length,
      realisee: visites.filter(v => v.statut === 'realisee').length,
      urgent: visites.filter(v => v.priorite === 'urgente').length,
      today: visites.filter(v => {
        const visitDate = new Date(v.date_debut);
        return visitDate.toDateString() === now.toDateString();
      }).length
    };
    return stats;
  };

  useEffect(() => {
    fetchVisites();
  }, []);

  return {
    visites,
    loading,
    error,
    createVisite,
    updateVisite,
    deleteVisite,
    refreshVisites: fetchVisites,
    stats: getStats()
  };
};