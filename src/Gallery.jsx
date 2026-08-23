import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";
import './Gallery.css'
import './App.css'
import CategoryHeader from "./CategoryHeader";

export default function Gallery(params){
    const {category} = params;
    const [listings, setListings] = useState([]);

    // get listings from supabase table
    async function getListings(){
        const {data, error} = await supabase
            .from("listings")
            .select("title,image")
            .eq('category', category)
            .order('year', {ascending: false});
        
        if(error){
            console.error(error);
            return;
        }else{
            setListings(data);
        }
    }

    useEffect(() => {
        getListings();
    }, [params]);

    return (
        <div>
            <CategoryHeader category={category}/>
            <div className="container">
                {listings.map((listing, key) => (
                    <div className="listing" key={key}>
                        <img src={listing.image} alt="Artwork Image" className="listing-image" />
                        <br />
                        <small>{listing.title}</small>
                        {/* <small>{listing.category} - {listing.medium}</small>
                        <br />
                        <small>{listing.year}</small> */}
                    </div>
                ))}
            </div>
        </div>
    );
}