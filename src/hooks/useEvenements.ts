import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type Evenement = Database['public']['Tables']['evenements']['Row'];
type EvenementInsert = Database['public']['Tables']['evenements']['Insert'];
type EvenementUpdate = Database['public']['Tables']['evenements']['Update'];

export const useEvenements = () => {
  const [evenements, setEvenements] = useState<Evenement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger tous les événements
  const fetchEvenements = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('evenements')
        .select('*')
        .order('date_debut', { ascending: true });

      if (error) throw error;
      setEvenements(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  // Créer un nouvel événement
  const createEvenement = async (evenement: EvenementInsert) => {
    try {
      const { data, error } = await supabase
        .from('evenements')
        .insert(evenement)
        .select()
        .single();

      if (error) throw error;
      
      setEvenements(prev => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création');
      throw err;
    }
  };

  // Mettre à jour un événement
  const updateEvenement = async (id: string, updates: EvenementUpdate) => {
    try {
      const { data, error } = await supabase
        .from('evenements')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setEvenements(prev => prev.map(e => e.id === id ? data : e));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
      throw err;
    }
  };

  // Supprimer un événement
  const deleteEvenement = async (id: string) => {
    try {
      const { error } = await supabase
        .from('evenements')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setEvenements(prev => prev.filter(e => e.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
      throw err;
    }
  };

  // Obtenir les statistiques
  const getStats = () => {
    const now = new Date();
    const thisWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const thisMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const stats = {
      total: evenements.length,
      planifie: evenements.filter(e => e.statut === 'planifie').length,
      confirme: evenements.filter(e => e.statut === 'confirme').length,
      en_cours: evenements.filter(e => e.statut === 'en_cours').length,
      termine: evenements.filter(e => e.statut === 'termine').length,
      annule: evenements.filter(e => e.statut === 'annule').length,
      semaine: evenements.filter(e => {
        const eventDate = new Date(e.date_debut);
        return eventDate >= now && eventDate <= thisWeek;
      }).length,
      mois: evenements.filter(e => {
        const eventDate = new Date(e.date_debut);
        return eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear();
      }).length,
      types: {
        reunion: evenements.filter(e => e.type_evenement === 'reunion').length,
        formation: evenements.filter(e => e.type_evenement === 'formation').length,
        audit: evenements.filter(e => e.type_evenement === 'audit').length,
        conference: evenements.filter(e => e.type_evenement === 'conference').length,
      }
    };
    return stats;
  };

  useEffect(() => {
    fetchEvenements();
  }, []);

  return {
    evenements,
    loading,
    error,
    createEvenement,
    updateEvenement,
    deleteEvenement,
    refreshEvenements: fetchEvenements,
    stats: getStats()
  };
};