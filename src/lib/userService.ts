import { supabase, isSupabaseConfigured } from './supabase';
import { UserAccount } from '../types';

export const USER_TABLE = 'user_accounts';

/**
 * Fetch all users from Supabase database table `user_accounts`.
 */
export async function fetchUsersFromSupabase(): Promise<UserAccount[] | null> {
  if (!isSupabaseConfigured || !supabase) return null;

  try {
    const { data, error } = await supabase
      .from(USER_TABLE)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('⚠️ Could not fetch user_accounts from Supabase:', error.message);
      return null;
    }

    if (data && Array.isArray(data)) {
      return data.map((u: any) => ({
        id: u.id,
        fullName: u.full_name || '',
        email: u.email || '',
        phone: u.phone || '',
        password: u.password || '123456',
        role: u.role || 'EDITOR',
        assignedLevel: u.assigned_level || 'ALL',
        status: u.status || 'APPROVED',
        createdAt: u.created_at || new Date().toISOString(),
        approvedAt: u.approved_at,
        approvedBy: u.approved_by,
      }));
    }
    return [];
  } catch (err) {
    console.error('❌ Supabase fetch users error:', err);
    return null;
  }
}

/**
 * Insert or update a user record in Supabase database.
 */
export async function saveUserToSupabase(user: UserAccount): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;

  try {
    const dbPayload = {
      id: user.id,
      full_name: user.fullName,
      email: user.email.toLowerCase(),
      phone: user.phone,
      password: user.password || '123456',
      role: user.role,
      assigned_level: user.assignedLevel || 'ALL',
      status: user.status,
      created_at: user.createdAt || new Date().toISOString(),
      approved_at: user.approvedAt || null,
      approved_by: user.approvedBy || null,
    };

    const { error } = await supabase
      .from(USER_TABLE)
      .upsert(dbPayload, { onConflict: 'id' });

    if (error) {
      console.error('❌ Supabase save user error:', error.message);
      return false;
    }
    console.log(`✅ Supabase user ${user.email} saved successfully.`);
    return true;
  } catch (err) {
    console.error('❌ Supabase save user exception:', err);
    return false;
  }
}

/**
 * Permanently delete a user record from Supabase database by ID.
 */
export async function deleteUserFromSupabase(userId: string): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;

  try {
    const { error } = await supabase
      .from(USER_TABLE)
      .delete()
      .eq('id', userId);

    if (error) {
      console.error('❌ Supabase delete user error:', error.message);
      return false;
    }
    console.log(`✅ Supabase user ${userId} deleted successfully.`);
    return true;
  } catch (err) {
    console.error('❌ Supabase delete user exception:', err);
    return false;
  }
}
