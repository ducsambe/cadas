import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface UserDepartmentAssignment {
  id: string;
  user_id: string;
  department_id: string;
  department_name: string;
  is_primary: boolean;
  role_in_department?: string;
  access_level: string;
  can_view_documents: boolean;
  can_create_documents: boolean;
  can_validate_documents: boolean;
  can_assign_tasks: boolean;
  assigned_date: string;
  assigned_by?: string;
  is_active: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface UserDivisionAssignment {
  id: string;
  user_id: string;
  division_id: string;
  division_name: string;
  is_primary: boolean;
  role_in_division?: string;
  access_level: string;
  can_view_documents: boolean;
  can_create_documents: boolean;
  can_validate_documents: boolean;
  can_assign_tasks: boolean;
  assigned_date: string;
  assigned_by?: string;
  is_active: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface UserOfficeAssignment {
  id: string;
  user_id: string;
  office_id: string;
  office_name: string;
  is_primary: boolean;
  role_in_office?: string;
  access_level: string;
  can_view_documents: boolean;
  can_create_documents: boolean;
  can_validate_documents: boolean;
  can_assign_tasks: boolean;
  assigned_date: string;
  assigned_by?: string;
  is_active: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export const useUserAssignments = () => {
  const [departmentAssignments, setDepartmentAssignments] = useState<UserDepartmentAssignment[]>([]);
  const [divisionAssignments, setDivisionAssignments] = useState<UserDivisionAssignment[]>([]);
  const [officeAssignments, setOfficeAssignments] = useState<UserOfficeAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserAssignments = async (userId: string) => {
    try {
      setLoading(true);

      const [deptResult, divResult, officeResult] = await Promise.all([
        supabase
          .from('user_departments')
          .select('*')
          .eq('user_id', userId)
          .eq('is_active', true),
        supabase
          .from('user_divisions')
          .select('*')
          .eq('user_id', userId)
          .eq('is_active', true),
        supabase
          .from('user_offices')
          .select('*')
          .eq('user_id', userId)
          .eq('is_active', true),
      ]);

      if (deptResult.error) throw deptResult.error;
      if (divResult.error) throw divResult.error;
      if (officeResult.error) throw officeResult.error;

      setDepartmentAssignments(deptResult.data || []);
      setDivisionAssignments(divResult.data || []);
      setOfficeAssignments(officeResult.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addDepartmentAssignment = async (assignment: Partial<UserDepartmentAssignment>) => {
    try {
      const { data, error } = await supabase
        .from('user_departments')
        .insert([assignment])
        .select()
        .single();

      if (error) throw error;
      setDepartmentAssignments((prev) => [...prev, data]);
      return { success: true, data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const addDivisionAssignment = async (assignment: Partial<UserDivisionAssignment>) => {
    try {
      const { data, error } = await supabase
        .from('user_divisions')
        .insert([assignment])
        .select()
        .single();

      if (error) throw error;
      setDivisionAssignments((prev) => [...prev, data]);
      return { success: true, data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const addOfficeAssignment = async (assignment: Partial<UserOfficeAssignment>) => {
    try {
      const { data, error } = await supabase
        .from('user_offices')
        .insert([assignment])
        .select()
        .single();

      if (error) throw error;
      setOfficeAssignments((prev) => [...prev, data]);
      return { success: true, data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const removeDepartmentAssignment = async (assignmentId: string) => {
    try {
      const { error } = await supabase
        .from('user_departments')
        .update({ is_active: false })
        .eq('id', assignmentId);

      if (error) throw error;
      setDepartmentAssignments((prev) => prev.filter((a) => a.id !== assignmentId));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const removeDivisionAssignment = async (assignmentId: string) => {
    try {
      const { error } = await supabase
        .from('user_divisions')
        .update({ is_active: false })
        .eq('id', assignmentId);

      if (error) throw error;
      setDivisionAssignments((prev) => prev.filter((a) => a.id !== assignmentId));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const removeOfficeAssignment = async (assignmentId: string) => {
    try {
      const { error } = await supabase
        .from('user_offices')
        .update({ is_active: false })
        .eq('id', assignmentId);

      if (error) throw error;
      setOfficeAssignments((prev) => prev.filter((a) => a.id !== assignmentId));
      return { success: true };
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
      return { success: true, data };
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
      return { success: true, data };
    } catch (err: any) {
      return { success: false, error: err.message };
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
      return { success: true, data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const setPrimaryDepartment = async (userId: string, departmentId: string) => {
    try {
      await supabase
        .from('user_departments')
        .update({ is_primary: false })
        .eq('user_id', userId);

      const { data, error } = await supabase
        .from('user_departments')
        .update({ is_primary: true })
        .eq('user_id', userId)
        .eq('department_id', departmentId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const setPrimaryDivision = async (userId: string, divisionId: string) => {
    try {
      await supabase
        .from('user_divisions')
        .update({ is_primary: false })
        .eq('user_id', userId);

      const { data, error } = await supabase
        .from('user_divisions')
        .update({ is_primary: true })
        .eq('user_id', userId)
        .eq('division_id', divisionId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const setPrimaryOffice = async (userId: string, officeId: string) => {
    try {
      await supabase
        .from('user_offices')
        .update({ is_primary: false })
        .eq('user_id', userId);

      const { data, error } = await supabase
        .from('user_offices')
        .update({ is_primary: true })
        .eq('user_id', userId)
        .eq('office_id', officeId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  return {
    departmentAssignments,
    divisionAssignments,
    officeAssignments,
    loading,
    error,
    fetchUserAssignments,
    addDepartmentAssignment,
    addDivisionAssignment,
    addOfficeAssignment,
    removeDepartmentAssignment,
    removeDivisionAssignment,
    removeOfficeAssignment,
    getUsersByDepartment,
    getUsersByDivision,
    getUsersByOffice,
    setPrimaryDepartment,
    setPrimaryDivision,
    setPrimaryOffice,
  };
};
