import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type Document = Database['public']['Tables']['bibliotheque']['Row'];
type DocumentInsert = Database['public']['Tables']['bibliotheque']['Insert'];
type DocumentUpdate = Database['public']['Tables']['bibliotheque']['Update'];

export const useBibliotheque = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger tous les documents
  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bibliotheque')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  // Créer un nouveau document
  const createDocument = async (document: Omit<DocumentInsert, 'reference'>) => {
    try {
      const reference = `BIB-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
      
      const { data, error } = await supabase
        .from('bibliotheque')
        .insert({ ...document, reference })
        .select()
        .single();

      if (error) throw error;
      
      setDocuments(prev => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création');
      throw err;
    }
  };

  // Mettre à jour un document
  const updateDocument = async (id: string, updates: DocumentUpdate) => {
    try {
      const { data, error } = await supabase
        .from('bibliotheque')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setDocuments(prev => prev.map(d => d.id === id ? data : d));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
      throw err;
    }
  };

  // Supprimer un document
  const deleteDocument = async (id: string) => {
    try {
      const { error } = await supabase
        .from('bibliotheque')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setDocuments(prev => prev.filter(d => d.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
      throw err;
    }
  };

  // Obtenir les statistiques
  const getStats = () => {
    const stats = {
      total: documents.length,
      disponible: documents.filter(d => d.statut === 'disponible').length,
      emprunte: documents.filter(d => d.statut === 'emprunte').length,
      reserve: documents.filter(d => d.statut === 'reserve').length,
      maintenance: documents.filter(d => d.statut === 'maintenance').length,
      categories: {
        interne: documents.filter(d => d.categorie === 'interne').length,
        modele_geocasa: documents.filter(d => d.categorie === 'modele_geocasa').length,
        institutionnel: documents.filter(d => d.categorie === 'institutionnel').length,
        publication: documents.filter(d => d.categorie === 'publication').length,
      },
      types: {
        rapport: documents.filter(d => d.type_document === 'rapport').length,
        manuel: documents.filter(d => d.type_document === 'manuel').length,
        guide: documents.filter(d => d.type_document === 'guide').length,
        modele: documents.filter(d => d.type_document === 'modele').length,
      }
    };
    return stats;
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return {
    documents,
    loading,
    error,
    createDocument,
    updateDocument,
    deleteDocument,
    refreshDocuments: fetchDocuments,
    stats: getStats()
  };
};