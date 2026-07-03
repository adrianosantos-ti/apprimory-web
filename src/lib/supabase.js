// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = https://dqxurbhffgcjdbouaccb.supabase.co
const supabaseKey = sb_publishable_I4eljsSA50_VgM3vP-Kr4w_gkgX5Svc

export const supabase = createClient(supabaseUrl, supabaseKey)