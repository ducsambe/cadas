import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type Equipment = Database['public']['Tables']['equipments']['Row'];
type EquipmentInsert = Database['public']['Tables']['equipments']['Insert'];
type EquipmentUpdate = Database['public']['Tables']['equipments']['Update'];

export const useEquipments = () => {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger tous les équipements
  const fetchEquipments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('equipments')
        .select('*')
        .order('nom', { ascending: true });

      if (error) throw error;
      setEquipments(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  // Créer un nouvel équipement
  const createEquipment = async (equipment: EquipmentInsert) => {
    try {
      const { data, error } = await supabase
        .from('equipments')
        .insert(equipment)
        .select()
        .single();

      if (error) throw error;
      
      setEquipments(prev => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création');
      throw err;
    }
  };

  // Mettre à jour un équipement
  const updateEquipment = async (id: string, updates: EquipmentUpdate) => {
    try {
      const { data, error } = await supabase
        .from('equipments')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setEquipments(prev => prev.map(eq => eq.id === id ? data : eq));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
      throw err;
    }
  };

  // Supprimer un équipement
  const deleteEquipment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('equipments')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setEquipments(prev => prev.filter(eq => eq.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
      throw err;
    }
  };

  // Obtenir les statistiques
  const getStats = () => {
    const stats = {
      total: equipments.length,
      fonctionnel: equipments.filter(eq => eq.statut === 'fonctionnel').length,
      maintenance: equipments.filter(eq => eq.statut === 'maintenance').length,
      panne: equipments.filter(eq => eq.statut === 'panne').length,
      reforme: equipments.filter(eq => eq.statut === 'reforme').length,
      types: {
        informatique: equipments.filter(eq => eq.type_equipement === 'informatique').length,
        bureautique: equipments.filter(eq => eq.type_equipement === 'bureautique').length,
        topographie: equipments.filter(eq => eq.type_equipement === 'topographie').length,
        transport: equipments.filter(eq => eq.type_equipement === 'transport').length,
      }
    };
    return stats;
  };

  useEffect(() => {
    fetchEquipments();
  }, []);

  return {
    equipments,
    loading,
    error,
    createEquipment,
    updateEquipment,
    deleteEquipment,
    refreshEquipments: fetchEquipments,
    stats: getStats()
  };
};