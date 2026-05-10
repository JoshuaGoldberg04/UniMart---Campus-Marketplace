/**
 * UniMart — Auth module (Supabase)
 * Modular authentication utilities
 */

// Configuration
export const SUPABASE_URL = 'https://xdxnzkowvmphveiwzufm.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_WqqtaVhge6rIPosltnGktw_xVHBE5L_';
export const LISTING_IMAGE_BUCKET = 'listing-images';
export const LISTING_IMAGE_MAX_BYTES = 5 * 1024 * 1024;

// Supabase client initialization
let _sb;
export function initializeSupabase(supabaseLib) {
  _sb = supabaseLib.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return _sb;
}

// Get Supabase client
export function getSupabaseClient() {
  return _sb;
}

// Helper functions
function _normalizeUsername(username) {
  if (!username) return null;
  return username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
}

function _buildUser(authUser) {
  const meta = authUser.user_metadata || {};
  return {
    id: authUser.id,
    email: authUser.email,
    fullName: meta.full_name || authUser.email.split('@')[0],
    accountType: meta.account_type || 'buyer',
    userRole: meta.user_role || 'student',
    username: meta.username || null,
    university: meta.university || null,
    campus: meta.campus || null,
    studentNumber: meta.student_number || null,
  };
}

async function _ensureProfile(authUser) {
  if (!authUser) return null;
  const { data, error } = await _sb.from('users').select('*').eq('id', authUser.id).maybeSingle();
  if (error) {
    console.warn('Failed to load profile:', error.message);
    return _buildUser(authUser);
  }
  if (!data) {
    const meta = authUser.user_metadata || {};
    const newProfile = {
      id: authUser.id,
      email: authUser.email,
      full_name: meta.full_name || authUser.email.split('@')[0],
      account_type: meta.account_type || 'buyer',
      user_role: meta.user_role || 'student',
      username: meta.username || null,
      university: meta.university || null,
      uni_campus: meta.campus || null,
      student_number: meta.student_number || null,
    };
    await _sb.from('users').insert(newProfile);
    return {
      id: newProfile.id,
      email: newProfile.email,
      fullName: newProfile.full_name,
      accountType: newProfile.account_type,
      userRole: newProfile.user_role,
      username: newProfile.username,
      university: newProfile.university,
      campus: newProfile.uni_campus,
      studentNumber: newProfile.student_number,
    };
  }
  return {
    id: data.id,
    email: data.email,
    fullName: data.full_name,
    accountType: data.account_type,
    userRole: data.user_role,
    username: data.username,
    university: data.university,
    campus: data.uni_campus,
    studentNumber: data.student_number,
  };
}

function getOAuthRedirectUrl() {
  const base = window.location.origin;
  return `${base}/frontend/pages/auth-callback.html`;
}

// Sign-up
export async function signUp({ fullName, email, password, accountType, userRole = 'student', university, campus, studentNumber }) {
  const cleanRole = ['student', 'staff'].includes(userRole) ? userRole : 'student';
  const cleanAccountType = cleanRole === 'student' && ['buyer', 'seller', 'seller_buyer'].includes(accountType)
    ? accountType
    : 'buyer';
  const { error } = await _sb.auth.signUp({
    email,
    password,
    options: {
      data: { 
        full_name: fullName, 
        account_type: cleanAccountType, 
        user_role: cleanRole, 
        university: university || null, 
        campus: campus || null, 
        student_number: studentNumber || null 
      }
    }
  });
  if (error) return { error: error.message };
  return { success: true };
}

// Sign-in
export async function signIn({ email, password }) {
  const { data, error } = await _sb.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };
  const profile = await _ensureProfile(data.user);
  return { success: true, user: profile || _buildUser(data.user) };
}

export async function signInWithGoogle({ redirectTo } = {}) {
  const { error } = await _sb.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectTo || getOAuthRedirectUrl(),
    },
  });
  if (error) return { error: error.message };
  return { success: true };
}

export async function handleOAuthCallback() {
  const { data: { session }, error } = await _sb.auth.getSession();
  if (error) return { error: error.message };
  if (!session?.user) return { error: 'We could not complete Google sign-in. Please try again.' };

  const profile = await _ensureProfile(session.user);
  if (!profile) return { error: 'We could not load your UniMart profile. Please try again.' };
  return { success: true, user: profile };
}

// OTP verification
export async function verifyOTP(email, token) {
  const { data, error } = await _sb.auth.verifyOtp({ email, token, type: 'signup' });
  if (error) return { error: error.message };
  if (data.user) {
    const meta = data.user.user_metadata || {};
    await _sb.from('users').upsert({
      id: data.user.id,
      full_name: meta.full_name,
      email: data.user.email,
      account_type: meta.account_type || 'buyer',
      user_role: meta.user_role || 'student',
      university: meta.university || null,
      uni_campus: meta.campus || null,
      student_number: meta.student_number || null,
    });
  }
  return { success: true };
}

// Sign-out
export async function signOut() {
  await _sb.auth.signOut();
  window.location.href = '/frontend/pages/login.html';
}

// Session / auth guard
export async function requireAuth() {
  const { data: { session } } = await _sb.auth.getSession();
  if (!session) {
    window.location.href = '/frontend/pages/login.html';
    return null;
  }
  return _ensureProfile(session.user);
}

export async function getUser() {
  const { data: { session } } = await _sb.auth.getSession();
  if (!session) return null;
  return _ensureProfile(session.user);
}

// Profile updates
export async function updateProfile({ id, fullName, email, accountType, username }) {
  const cleanUsername = _normalizeUsername(username);
  const cleanAccountType = ['buyer', 'seller', 'seller_buyer'].includes(accountType) ? accountType : 'buyer';
  const [{ error: dbErr }, { error: authErr }] = await Promise.all([
    _sb.from('users').update({
      full_name: fullName,
      email: email.toLowerCase(),
      account_type: cleanAccountType,
      username: cleanUsername || null,
    }).eq('id', id),
    _sb.auth.updateUser({ data: { full_name: fullName, account_type: cleanAccountType, username: cleanUsername || null } }),
  ]);
  if (dbErr || authErr) return { error: (dbErr || authErr).message };
  return { success: true };
}

export async function updateCampusInfo({ id, university, campus, studentNumber }) {
  const { error } = await _sb.from('users').update({
    university: university || null,
    uni_campus: campus || null,
    student_number: studentNumber || null,
  }).eq('id', id);
  if (error) return { error: error.message };
  return { success: true };
}

// Password management
export async function updatePassword({ currentPassword, newPassword, email }) {
  const { error: reAuthErr } = await _sb.auth.signInWithPassword({ email, password: currentPassword });
  if (reAuthErr) return { error: 'Incorrect current password.' };
  const { error: updateErr } = await _sb.auth.updateUser({ password: newPassword });
  if (updateErr) return { error: updateErr.message };
  return { success: true };
}

export async function requestPasswordReset({ email, redirectTo }) {
  const { error } = await _sb.auth.resetPasswordForEmail(email, { redirectTo });
  if (error) return { error: error.message };
  return { success: true };
}

export async function completePasswordRecovery({ newPassword }) {
  const { error } = await _sb.auth.updateUser({ password: newPassword });
  if (error) return { error: error.message };
  return { success: true };
}

// Export as default Auth object for backwards compatibility
export const Auth = {
  signUp,
  signIn,
  signInWithGoogle,
  handleOAuthCallback,
  verifyOTP,
  signOut,
  requireAuth,
  getUser,
  updateProfile,
  updateCampusInfo,
  updatePassword,
  requestPasswordReset,
  completePasswordRecovery,
  initializeSupabase,
  getSupabaseClient
};

export default Auth;
