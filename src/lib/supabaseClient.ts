import { createClient } from '@supabase/supabase-js'

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
export const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const defaultPublishableKey = 'sb_publishable_rHWLfLFjs-7knqrlchi2eg_xJtdl5Yp'
const supabaseKey = supabasePublishableKey || defaultPublishableKey || supabaseAnonKey
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey)

const createNoopResult = (errorMessage: string) => Promise.resolve({ data: null, error: { message: errorMessage } })

const noopAuth = {
  signOut: () => createNoopResult('Supabase is not configured.'),
  getSession: async () => ({ data: { session: null }, error: null }),
  onAuthStateChange: () => ({
    data: { subscription: { unsubscribe: () => {} } },
  }),
  signInWithPassword: () => createNoopResult('Supabase is not configured.'),
}

const noopStorageBucket = {
  upload: async () => ({ data: null, error: { message: 'Supabase is not configured.' } }),
  remove: async () => ({ data: null, error: { message: 'Supabase is not configured.' } }),
  getPublicUrl: () => ({ data: { publicUrl: '' } }),
}

const noopStorage = {
  from: () => noopStorageBucket,
}

const noopFrom = () => ({
  insert: async () => ({ data: null, error: { message: 'Supabase is not configured.' } }),
})

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseKey!)
  : {
      auth: noopAuth,
      storage: noopStorage,
      from: noopFrom,
    } as any
