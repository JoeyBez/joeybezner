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
    const [asc, setAsc] = useState(false);
    const [order, setOrder] = useState("year");
    const [searchParams, setSearchParams] = useSearchParams();

    const [shop, setShop] = useState(false);
    // get listings from supabase table
    async function getListings(isShop){
        setLoading(true);
        let query = 
        isShop ? 
        supabase
            .from("shop")
            .select("*, listing (*) ")
        :
        supabase
            .from("listings")
            .select("id,img");
        
        if(category != null && !isShop) { query.eq("category", category); }

        if (!filters.cleared && !isShop) {
            const mediums = Object.keys(filters).filter(
                key => key !== "cleared" && filters[key]
            );

            if (mediums.length > 0) {
                query = query.in("medium", mediums);
            }
        }
        
        if(!isShop) {query.order(order, { ascending: asc });}
        const { data, error } = await query;
        
        if(error){
            console.error(error);
            return;
        }else{
            setLoading(false);
            // console.log(data, isShop);
            setListings(data);
        }
    }

    useEffect(() => {
        // console.log(filters)
        let s = category == "Shop";
        setShop(s);
        getListings(s);
    }, [category, filters, asc, order]);

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
        <div>
            <CategoryHeader category={category}/>
            {/* <Filter filters={filters} setFilters={setFilters} mediums={mediums} asc={{value: asc, set: setAsc}} order={{value: order, set: setOrder}} /> */}
            {loading ? 
            <Loading />
            : 
            listings.length > 0 ?
            (<div className="container">
                {listings.map((listing, key) => (
                    <div className="listing" key={shop ? listing.listing.id : listing.id} onClick={() => setSearchParams({"listing": shop ? listing.listing.id : listing.id})}>
                        <img src={shop ? listing.listing.img[0] : listing.img[0]} alt="Artwork Image" className="listing-image" />
                        {shop && <div className="listing-shop-info">
                            <p className="left">${listing.price}</p>
                            {/* <p className="title">{listing.listing.title}</p> */}
                            <p className="right">{listing.type}</p>
                        </div>}
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