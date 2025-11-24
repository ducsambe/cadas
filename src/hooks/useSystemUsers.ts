import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface SystemUser {
  id: string;
  personnel_id?: string;
  full_name: string;
  email: string;
  phone?: string;
  user_type: string;
  department_id?: string;
  division_id?: string;
  office_id?: string;
  role_name: string;
  access_level: string;
  can_assign_documents: boolean;
  can_approve_documents: boolean;
  can_manage_users: boolean;
  accessible_modules: string[];
  accessible_offices: string[];
  accessible_departments: string[];
  is_active: boolean;
  is_available: boolean;
  current_workload: number;
  max_assignments: number;
  photo_url?: string;
  signature_url?: string;
  bio?: string;
  specializations: string[];
  notification_preferences: any;
  last_login?: string;
  last_activity?: string;
  created_at: string;
  updated_at: string;
}

export interface DocumentAssignment {
  id: string;
  assigned_to_user_id: string;
  assigned_by_user_id?: string;
  document_type: string;
  document_id: string;
  document_reference?: string;
  document_title: string;
  assignment_type: string;
  priority: string;
  assigned_date: string;
  due_date?: string;
  started_date?: string;
  completed_date?: string;
  status: string;
  progress_percentage: number;
  estimated_hours?: number;
  actual_hours?: number;
  department_id?: string;
  division_id?: string;
  office_id?: string;
  assignment_notes?: string;
  completion_notes?: string;
  internal_comments: any[];
  collaborators: any[];
  watchers: any[];
  reminder_sent: boolean;
  reminder_count: number;
  last_reminder_date?: string;
  requires_approval: boolean;
  approved_by?: string;
  approved_date?: string;
  approval_notes?: string;
  attachments: any[];
  related_documents: any[];
  created_at: string;
  updated_at: string;
}

export const useSystemUsers = () => {
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [assignments, setAssignments] = useState<DocumentAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
    fetchAssignments();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('system_users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignments = async () => {
    try {
      const { data, error } = await supabase
        .from('document_assignments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAssignments(data || []);
    } catch (err: any) {
      console.error('Error fetching assignments:', err.message);
    }
  };

  const getUsersByOffice = async (officeId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_offices')
        .select(`
          *,
          system_users (*)
        `)
        .eq('office_id', officeId)
        .eq('is_active', true);

      if (error) throw error;

      const users = data?.map(item => item.system_users).filter(Boolean) || [];
      return { success: true, data: users };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const getUsersByDepartment = async (departmentId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_departments')
        .select(`
          *,
          system_users (*)
        `)
        .eq('department_id', departmentId)
        .eq('is_active', true);

      if (error) throw error;

      const users = data?.map(item => item.system_users).filter(Boolean) || [];
      return { success: true, data: users };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const getUsersByDivision = async (divisionId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_divisions')
        .select(`
          *,
          system_users (*)
        `)
        .eq('division_id', divisionId)
        .eq('is_active', true);

      if (error) throw error;

      const users = data?.map(item => item.system_users).filter(Boolean) || [];
      return { success: true, data: users };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const getAvailableUsers = async (officeId?: string) => {
    try {
      let query = supabase
        .from('system_users')
        .select('*')
        .eq('is_active', true)
        .eq('is_available', true);

      if (officeId) {
        query = query.eq('office_id', officeId);
      }

      const { data, error } = await query.order('full_name');

      if (error) throw error;
      return { success: true, data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const createUser = async (userData: Partial<SystemUser>) => {
    try {
      const { data, error } = await supabase
        .from('system_users')
        .insert([userData])
        .select()
        .single();

      if (error) throw error;
      await fetchUsers();
      return { success: true, data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const updateUser = async (userId: string, updates: Partial<SystemUser>) => {
    try {
      const { data, error } = await supabase
        .from('system_users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      await fetchUsers();
      return { success: true, data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const deactivateUser = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('system_users')
        .update({ is_active: false })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      await fetchUsers();
      return { success: true, data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const assignDocument = async (assignmentData: Partial<DocumentAssignment>) => {
    try {
      const { data, error } = await supabase
        .from('document_assignments')
        .insert([assignmentData])
        .select()
        .single();

      if (error) throw error;
      await fetchAssignments();
      return { success: true, data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const updateAssignment = async (assignmentId: string, updates: Partial<DocumentAssignment>) => {
    try {
      const { data, error } = await supabase
        .from('document_assignments')
        .update(updates)
        .eq('id', assignmentId)
        .select()
        .single();

      if (error) throw error;
      await fetchAssignments();
      return { success: true, data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const getAssignmentsByUser = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('document_assignments')
        .select('*')
        .eq('assigned_to_user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const getAssignmentsByOffice = async (officeId: string) => {
    try {
      const { data, error } = await supabase
        .from('document_assignments')
        .select('*')
        .eq('office_id', officeId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const getUserStats = async (userId: string) => {
    try {
      const { data: assignmentData, error } = await supabase
        .from('document_assignments')
        .select('status')
        .eq('assigned_to_user_id', userId);

      if (error) throw error;

      const stats = {
        total: assignmentData?.length || 0,
        assigned: assignmentData?.filter(a => a.status === 'Assigned').length || 0,
        in_progress: assignmentData?.filter(a => a.status === 'In Progress').length || 0,
        completed: assignmentData?.filter(a => a.status === 'Completed').length || 0,
        overdue: assignmentData?.filter(a => a.status === 'Overdue').length || 0,
      };

      return { success: true, data: stats };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  return {
    users,
    assignments,
    loading,
    error,
    fetchUsers,
    fetchAssignments,
    getUsersByOffice,
    getUsersByDepartment,
    getUsersByDivision,
    getAvailableUsers,
    createUser,
    updateUser,
    deactivateUser,
    assignDocument,
    updateAssignment,
    getAssignmentsByUser,
    getAssignmentsByOffice,
    getUserStats,
  };
};
