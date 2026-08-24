import { useState, useEffect } from "react";
import { supabase } from "./lib/supabaseClient";
import './Home.css'
import { IoLocationOutline } from "react-icons/io5";
import { useSearchParams } from "react-router-dom";

export default function Home(){
    const [loading, setLoading] = useState(false);
    const [listings, setListings] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();

    async function getListings(){
        setLoading(true);
        const { data, error } = await supabase
            .from("featured")
            .select('listings (id, img)');
        
        if(error){
            console.error(error);
            return;
        }else{
            const newData = data
                .map((d) => (
                    {id: d.listings.id, img: d.listings.img }
                ))
            // console.log(newData);
            setLoading(false);
            setListings(newData);
        }
    }

    useEffect(() => {
        getListings();
    }, []);

    return (
        <div className="home">
            <div className="home-info">
                <h1>Joey Bezner</h1>
                <p>Multimedia Artist</p>
                <p><IoLocationOutline /> Brooklyn, NY</p>
            </div>
            <div style={{textAlign:"center"}}>
                <h3 style={{marginBottom:"1rem"}}>Featured Works</h3>
                <div className="featured">
                    {listings.map((listing, key) => (
                        <div className="listing" key={listing.id} onClick={() => setSearchParams({"listing": listing.id})}>
                            <img src={listing.img[0]} alt="Artwork Image" className="listing-image" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}