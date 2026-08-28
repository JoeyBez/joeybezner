import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";
import './Gallery.css'
import './App.css'
import CategoryHeader from "./CategoryHeader";
import Loading from "./Loading";
import Filter from "./Filter";
import { Link, useSearchParams } from 'react-router-dom';

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
    async function getListings(isShop, n_order){
        setLoading(true);
        let query = 
        isShop ? 
        supabase
            .from("shop")
            .select("*, listing!inner (*) ")
        :
        supabase
            .from("listings")
            .select("id,img");
        
        if(category != null && !isShop) { query.eq("category", category); }

        if (!filters.cleared) {
            const mediums = Object.keys(filters).filter(
                key => key !== "cleared" && filters[key]
            );

            if (mediums.length > 0) {
                query = query.in(isShop ? "listing.medium" : "medium", mediums);
            }
        }
        
        if(!isShop) {query.order(n_order, { ascending: asc });}
        const { data, error } = await query;
        
        if(error){
            console.error(error);
            return;
        }else{
            setLoading(false);
            if(isShop){
                if(n_order == "price"){
                    data.sort((a, b) => {
                        return asc ? a.price - b.price : b.price - a.price;
                    });
                }else{
                    data.sort((a, b) => {
                        return asc ? a.listing[n_order] - b.listing[n_order] : b.listing[n_order] - a.listing[n_order];
                    });
                }
            }
            console.log(data, isShop);
            setListings(data);
        }
    }

    useEffect(() => {
        // console.log(filters)
        let s = category == "Shop";
        let o = s ? order : order == "price" ? "year" : order;
        setOrder(o);
        setShop(s);
        getListings(s, o);
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
            {/* {shop && 
                <div style={{marginBottom:"2rem"}}>
                    <p>Scroll down to see listings or fill out a commision form</p>
                    <Link to="/" className="link-button">Commision Form</Link>
                </div>
            } */}
            <Filter filters={filters} setFilters={setFilters} mediums={mediums} asc={{value: asc, set: setAsc}} order={{value: order, set: setOrder}} shop={category == "Shop"} />
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