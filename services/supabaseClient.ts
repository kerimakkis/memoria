import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

const { supabaseUrl, supabaseAnonKey } = (Constants.expoConfig?.extra ?? {}) as {
  supabaseUrl?: string;
  supabaseAnonKey?: string;
};

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase ortam değişkenleri tanımlı değil. Lütfen .env dosyasını kontrol edin.');
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '', {
  auth: {
    persistSession: true,
    storage: AsyncStorage
  }
});
