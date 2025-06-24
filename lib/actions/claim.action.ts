import { createClient } from "@/utils/supabase/server"

export const fetchAllClaims = async () => {
    const supabase = await createClient()
    const { data, error } = await supabase.from('claims').select('*')
    if (error) {
        console.error('Error fetching claims:', error)
        throw new Error('Failed to fetch claims')
    }
    console.log('Claims fetched successfully:', data)
    return data
}