import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://pusccqpvyqpdoiqotrrz.supabase.co";
const SUPABASE_KEY = "sb_publishable_Z05g9UDpdsEi74F02Z23FA_0YLzhfHQ";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
