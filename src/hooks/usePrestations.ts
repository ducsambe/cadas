import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type Prestation = Database['public']['Tables']['prestations']['Row'];
type PrestationInsert = Database['public']['Tables']['prestations']['Insert'];
type PrestationUpdate = Database['public']['Tables']['prestations']['Update'];

export type DocumentItem = {
  id: string;
  nom: string;
  types: Array<'physique' | 'numerique'>;
  fichiers: File[];
  url?: string;
};

export type PrestationFormData = {
  client_nom: string;
  client_type: string;
  client_email: string;
  client_phone: string;
  client_adresse: string;
  nom_du_dossier: String;
  procedure_choisie: string;
  offre_choisie?: string;
  description: string;
  region: string;
  departement: string;
  ville: string;
  lieu_dit: string;
  contact_terrain_nom: string;
  contact_terrain_qualite: string;
  contact_terrain_phone: string;
  demande_par: string;
  priorite: string;
  statut: string;
  department_id: string;
  documents: DocumentItem[];
};

export type PrestationUpdateData = Omit<PrestationFormData, 'documents'> & {
  documents_physiques?: string[];
  documents_numeriques?: string[];
};

export const usePrestations = () => {
  const [prestations, setPrestations] = useState<Prestation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger toutes les prestations
  const fetchPrestations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('prestations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPrestations(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  // Get the next available number for prestations
  const getNextPrestationNumber = async (): Promise<string> => {
    try {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      
      // Get all prestation numbers for current month
      const startOfMonth = new Date(year, now.getMonth(), 1).toISOString();
      const endOfMonth = new Date(year, now.getMonth() + 1, 0, 23, 59, 59).toISOString();

      const { data, error } = await supabase
        .from('prestations')
        .select('numero')
        .gte('created_at', startOfMonth)
        .lte('created_at', endOfMonth)
        .order('numero', { ascending: true });

      if (error) throw error;

      // Extract the sequential number part from existing numbers (last 6 digits)
      const existingNumbers = (data || [])
        .map(p => {
          // Match format: GCG-YYYY-MMXXXXXX
          const match = p.numero.match(/GCG-\d{4}-(\d{2})(\d+)/);
          if (match && match[1] === month) { // Only consider numbers from current month
            return parseInt(match[2]);
          }
          return 0;
        })
        .filter(n => n > 0)
        .sort((a, b) => a - b);

      // Find the first available number
      let nextNumber = 1;
      for (const num of existingNumbers) {
        if (num === nextNumber) {
          nextNumber++;
        } else if (num > nextNumber) {
          break;
        }
      }

      return `${month}${String(nextNumber).padStart(4, '0')}`;
    } catch (err) {
      console.error('Error getting next prestation number:', err);
      // Fallback: use count + 1 if there's an error
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      
      const startOfMonth = new Date(year, now.getMonth(), 1).toISOString();
      const endOfMonth = new Date(year, now.getMonth() + 1, 0, 23, 59, 59).toISOString();

      const { count } = await supabase
        .from('prestations')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startOfMonth)
        .lte('created_at', endOfMonth);

      return `${month}${String((count || 0) + 1).padStart(4, '0')}`;
    }
  };

  // Upload un fichier vers Supabase Storage
  const uploadDocument = async (file: File, prestationId: string, documentName: string) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${prestationId}/${documentName.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('documents')
        .upload(fileName, file);

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (err) {
      console.error('Erreur upload document:', err);
      throw err;
    }
  };

  // Créer une nouvelle prestation
  const createPrestation = async (prestationData: PrestationFormData) => {
    try {
      const now = new Date();
      const year = now.getFullYear();

      // Get the next available number (includes month + sequential number)
      const sequentialNumber = await getNextPrestationNumber();
      const code_prestation = `GCG-${year}-${sequentialNumber}`;
      const numero = code_prestation;

      const documentsPhysiques = prestationData.documents
        .filter(doc => doc.types.includes('physique'))
        .map(doc => doc.nom);

      const documentsNumeriques = prestationData.documents
        .filter(doc => doc.types.includes('numerique'))
        .map(doc => doc.nom);

      // Extraire les données pour la base de données
      const { documents, ...dbData } = prestationData;

      const { data, error } = await supabase
        .from('prestations')
        .insert({
          ...dbData,
          numero,
          code_prestation,
          documents_physiques: documentsPhysiques,
          documents_numeriques: documentsNumeriques
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }

      const uploadedUrls: { [key: string]: string[] } = {};

      for (const doc of prestationData.documents) {
        if (doc.types.includes('numerique') && doc.fichiers.length > 0) {
          const urls: string[] = [];
          for (const file of doc.fichiers) {
            const url = await uploadDocument(file, data.id, doc.nom);
            urls.push(url);
          }
          uploadedUrls[doc.nom] = urls;
        }
      }

      if (Object.keys(uploadedUrls).length > 0) {
        await supabase
          .from('prestations')
          .update({ document_urls: uploadedUrls })
          .eq('id', data.id);
      }

      // Mettre à jour la liste locale
      setPrestations(prev => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création');
      throw err;
    }
  };

  const acceptPrestation = async (prestationId: string, userId: string) => {
    try {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const startOfMonth = new Date(year, now.getMonth(), 1).toISOString();

      // Get accepted prestations for current month and find next available number
      const { data: acceptedPrestations, error: fetchError } = await supabase
        .from('prestations')
        .select('code_prestation')
        .not('accepted_at', 'is', null)
        .gte('accepted_at', startOfMonth)
        .order('code_prestation', { ascending: true });

      if (fetchError) throw fetchError;

      // Extract numbers from code_prestation and find the next available one
      const existingNumbers = (acceptedPrestations || [])
        .map(p => {
          // Match format: GCG-YYYY-MMXXXXXX
          const match = p.code_prestation.match(/GCG-\d{4}-(\d{2})(\d+)/);
          if (match && match[1] === month) { // Only consider numbers from current month
            return parseInt(match[2]);
          }
          return 0;
        })
        .filter(n => n > 0)
        .sort((a, b) => a - b);

      let nextNumber = 1;
      for (const num of existingNumbers) {
        if (num === nextNumber) {
          nextNumber++;
        } else if (num > nextNumber) {
          break;
        }
      }

      const code_prestation = `GCG-${year}-${month}${String(nextNumber).padStart(4, '0')}`;

      const { data, error } = await supabase
        .from('prestations')
        .update({
          code_prestation,
          statut: 'validees',
          accepted_by: userId,
          accepted_at: new Date().toISOString()
        })
        .eq('id', prestationId)
        .select()
        .single();

      if (error) throw error;

      setPrestations(prev => prev.map(p => p.id === prestationId ? data : p));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'acceptation');
      throw err;
    }
  };

  const updatePrestation = async (id: string, updates: PrestationFormData | PrestationUpdate) => {
    try {
      let updateData: any;
      let documentsToUpload: DocumentItem[] = [];

      // If it's a PrestationFormData (from form), extract only the database fields
      if ('documents' in updates) {
        const { documents, ...dbData } = updates;
        documentsToUpload = documents;

        // Handle document arrays for database
        const documentsPhysiques = documents
          .filter(doc => doc.types.includes('physique'))
          .map(doc => doc.nom);

        const documentsNumeriques = documents
          .filter(doc => doc.types.includes('numerique'))
          .map(doc => doc.nom);

        updateData = {
          ...dbData,
          documents_physiques: documentsPhysiques,
          documents_numeriques: documentsNumeriques
        };
      } else {
        // This is already PrestationUpdate (database fields only)
        updateData = updates;
      }

      // First update the basic data
      const { data, error } = await supabase
        .from('prestations')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Supabase update error:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }

      // Handle document uploads if there are documents to upload
      if (documentsToUpload.length > 0) {
        const uploadedUrls: { [key: string]: string[] } = {};

        for (const doc of documentsToUpload) {
          if (doc.types.includes('numerique') && doc.fichiers.length > 0) {
            const urls: string[] = [];
            for (const file of doc.fichiers) {
              const url = await uploadDocument(file, id, doc.nom);
              urls.push(url);
            }
            uploadedUrls[doc.nom] = urls;
          }
        }

        if (Object.keys(uploadedUrls).length > 0) {
          await supabase
            .from('prestations')
            .update({ document_urls: uploadedUrls })
            .eq('id', id);
        }
      }

      // Refresh the data to get the latest version
      const { data: updatedData } = await supabase
        .from('prestations')
        .select('*')
        .eq('id', id)
        .single();

      setPrestations(prev => prev.map(p => p.id === id ? (updatedData || data) : p));
      return updatedData || data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
      throw err;
    }
  };

  const deletePrestation = async (id: string) => {
    try {
      const { error } = await supabase
        .from('prestations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setPrestations(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
      throw err;
    }
  };

  const getStats = () => {
    const stats = {
      total: prestations.length,
      nouvelles: prestations.filter(p => p.statut === 'nouvelles').length,
      validees: prestations.filter(p => p.statut === 'validees').length,
      receptionnees: prestations.filter(p => p.statut === 'receptionnees').length,
      renvoyees: prestations.filter(p => p.statut === 'renvoyees').length,
      traitees: prestations.filter(p => p.statut === 'traitees').length,
      refusees: prestations.filter(p => p.statut === 'refusees').length,
      urgent: prestations.filter(p => p.priorite === 'urgente').length,
    };
    return stats;
  };

  useEffect(() => {
    fetchPrestations();
  }, []);

  return {
    prestations,
    loading,
    error,
    createPrestation,
    acceptPrestation,
    updatePrestation,
    deletePrestation,
    refreshPrestations: fetchPrestations,
    stats: getStats()
  };
};