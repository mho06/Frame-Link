// src/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://selcrixlvuszmwvixhlt.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNlbGNyaXhsdnVzem13dml4aGx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3OTU4NjUsImV4cCI6MjA2NjM3MTg2NX0.eajJg-TJs6dRfG_Dh784r7vTtekmCZ1rwUIwTpAWnBg';

export const supabase = createClient(supabaseUrl, supabaseKey);
