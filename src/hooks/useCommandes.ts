import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type Commande = Database['public']['Tables']['commandes']['Row'];
type CommandeInsert = Database['public']['Tables']['commandes']['Insert'];
type CommandeUpdate = Database['public']['Tables']['commandes']['Update'];

export const useCommandes = () => {
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger toutes les commandes
  const fetchCommandes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('commandes')
        .select('*')
        .order('date_commande', { ascending: false });

      if (error) throw error;
      setCommandes(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  // Créer une nouvelle commande
  const createCommande = async (commande: Omit<CommandeInsert, 'numero'>) => {
    try {
      const numero = `CMD-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
      
      const { data, error } = await supabase
        .from('commandes')
        .insert({ ...commande, numero })
        .select()
        .single();

      if (error) throw error;
      
      setCommandes(prev => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création');
      throw err;
    }
  };

  // Mettre à jour une commande
  const updateCommande = async (id: string, updates: CommandeUpdate) => {
    try {
      const { data, error } = await supabase
        .from('commandes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setCommandes(prev => prev.map(c => c.id === id ? data : c));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
      throw err;
    }
  };

  // Supprimer une commande
  const deleteCommande = async (id: string) => {
    try {
      const { error } = await supabase
        .from('commandes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setCommandes(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
      throw err;
    }
  };

  // Obtenir les statistiques
  const getStats = () => {
    const stats = {
      total: commandes.length,
      validee: commandes.filter(c => c.statut === 'validee').length,
      en_cours: commandes.filter(c => c.statut === 'en_cours').length,
      livree: commandes.filter(c => c.statut === 'livree').length,
      annulee: commandes.filter(c => c.statut === 'annulee').length,
      montant_total: commandes.reduce((sum, c) => sum + c.montant_total, 0),
      montant_mois: commandes.filter(c => {
        const commandeDate = new Date(c.date_commande);
        const now = new Date();
        return commandeDate.getMonth() === now.getMonth() && commandeDate.getFullYear() === now.getFullYear();
      }).reduce((sum, c) => sum + c.montant_total, 0)
    };
    return stats;
  };

  useEffect(() => {
    fetchCommandes();
  }, []);

  return {
    commandes,
    loading,
    error,
    createCommande,
    updateCommande,
    deleteCommande,
    refreshCommandes: fetchCommandes,
    stats: getStats()
  };
};