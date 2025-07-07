import { supabase } from '../supabaseClient'

const handleLogout = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) alert(error.message)
}
