import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Profile {
  id: string;
  name: string;
  date_of_birth?: string;
  created_at: string;
  updated_at: string;
}

export interface CharacterProgress {
  id: string;
  user_id: string;
  character_id: string;
  questions_completed: number;
  reward_unlocked: boolean;
  last_accessed: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  user_id: string;
  character_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}
