import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type Archive = Database['public']['Tables']['archives']['Row'];
type ArchiveInsert = Database['public']['Tables']['archives']['Insert'];
type ArchiveUpdate = Database['public']['Tables']['archives']['Update'];

export const useArchives = () => {
  const [archives, setArchives] = useState<Archive[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger toutes les archives
  const fetchArchives = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('archives')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setArchives(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  // Créer une nouvelle archive
  const createArchive = async (archive: Omit<ArchiveInsert, 'reference' | 'code_indexation'>) => {
    try {
      const reference = `ARC-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
      const code_indexation = `${archive.type_document?.toUpperCase()}-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`;
      
      const { data, error } = await supabase
        .from('archives')
        .insert({ ...archive, reference, code_indexation })
        .select()
        .single();

      if (error) throw error;
      
      setArchives(prev => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création');
      throw err;
    }
  };

  // Mettre à jour une archive
  const updateArchive = async (id: string, updates: ArchiveUpdate) => {
    try {
      const { data, error } = await supabase
        .from('archives')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setArchives(prev => prev.map(a => a.id === id ? data : a));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
      throw err;
    }
  };

  // Supprimer une archive
  const deleteArchive = async (id: string) => {
    try {
      const { error } = await supabase
        .from('archives')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setArchives(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
      throw err;
    }
  };

  // Obtenir les statistiques
  const getStats = () => {
    const stats = {
      total: archives.length,
      types: {
        administratif: archives.filter(a => a.type_document === 'administratif').length,
        rh: archives.filter(a => a.type_document === 'rh').length,
        juridique: archives.filter(a => a.type_document === 'juridique').length,
        finance: archives.filter(a => a.type_document === 'finance').length,
        foncier: archives.filter(a => a.type_document === 'foncier').length,
      },
      confidentialite: {
        public: archives.filter(a => a.niveau_confidentialite === 'public').length,
        restreint: archives.filter(a => a.niveau_confidentialite === 'restreint').length,
        confidentiel: archives.filter(a => a.niveau_confidentialite === 'confidentiel').length,
      }
    };
    return stats;
  };

  useEffect(() => {
    fetchArchives();
  }, []);

  return {
    archives,
    loading,
    error,
    createArchive,
    updateArchive,
    deleteArchive,
    refreshArchives: fetchArchives,
    stats: getStats()
  };
};