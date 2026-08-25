import { supabase } from "./lib/supabaseClient";

/**
 * Retrieves the shop data, and gets only a specific listing if needed.
 * 
 * @param {function} setLoading - the setLoading useState function
 * @param {string?} id - (optional) id of the listing
 * @returns the data from supabase
 */
export default async function GetShop(setLoading, id = null){
    setLoading(true);
    
    let query = supabase
    .from('shop')
    .select('*');
    
    if(id){
        query = query.eq('listing', id);
    }

    const {data, error} = await query
    .order('date_posted', {ascending: false});

    if(error){
        console.error(error);
        return null;
    }

    // console.log(data);
    setLoading(false);
    return data || null;
}