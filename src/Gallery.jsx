import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";
import './Gallery.css'
import './App.css'
import CategoryHeader from "./CategoryHeader";
import Loading from "./Loading";
import Filter from "./Filter";
import { useSearchParams } from 'react-router-dom';

export default function Gallery(params){
    const [loading, setLoading] = useState(false);
    const {category} = params;
    const [listings, setListings] = useState([]);

    const [filters, setFilters] = useState({cleared:true});
    const [searchParams, setSearchParams] = useSearchParams();

    // get listings from supabase table
    async function getListings(){
        setLoading(true);
        let query = supabase
            .from("listings")
            .select("id,img");
        
        if(category != null) { query.eq("category", category); }

        if (!filters.cleared) {
            const mediums = Object.keys(filters).filter(
                key => key !== "cleared" && filters[key]
            );

            if (mediums.length > 0) {
                query = query.in("medium", mediums);
            }
        }

        const { data, error } = await query
            .order("year", { ascending: false });
        
        if(error){
            console.error(error);
            return;
        }else{
            setLoading(false);
            setListings(data);
        }
    }

    useEffect(() => {
        // console.log(filters)
        getListings();
    }, [params, filters]);

    // get mediums from database enum
    const [mediums, setMediums] = useState([]);
    const getMediums = async () => {
        const { data, error } = await supabase
        .rpc('get_mediums')

        if (error) {
        console.error('Error running SQL:', error.message)
        return
        }

        setMediums(data);
    }

    useEffect(() => {
        getMediums();
    }, [])

    return (
        <div style={{marginTop:"5rem"}}>
            <CategoryHeader category={category}/>
            <Filter filters={filters} setFilters={setFilters} mediums={mediums} />
            {loading ? 
            <Loading />
            : 
            listings.length > 0 ?
            (<div className="container">
                {listings.map((listing, key) => (
                    <div className="listing" key={listing.id} onClick={() => setSearchParams({"listing": listing.id})}>
                        <img src={listing.img[0]} alt="Artwork Image" className="listing-image" />
                        {/* <br /> */}
                        {/* <small>{listing.title}</small> */}
                        {/* <small>{listing.category} - {listing.medium}</small>
                        <br />
                        <small>{listing.year}</small> */}
                    </div>
                ))}
            </div>)
            :
            <div style={{textAlign:"center"}}>
                No artworks found.
            </div>
            }
        </div>
    );
}