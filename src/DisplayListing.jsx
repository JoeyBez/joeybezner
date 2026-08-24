import { useEffect, useState } from "react";
import Loading from "./Loading";
import { supabase } from "./lib/supabaseClient";
import './DisplayListing.css'
import { IoChevronBack, IoLogoInstagram } from "react-icons/io5";
import { FaSpotify } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";
import { useNavigate } from "react-router-dom";

export default function DisplayListing(params){
    const navigate = useNavigate();
    const {id} = params;
    const [loading, setLoading] = useState(false);
    const [listing, setListing] = useState({});
    const [image, setImage] = useState(0);

    async function getListing(){
        setLoading(true);
        const {data, error} = await supabase
        .from('listings')
        .select('*')
        .eq('id', id);

        if(error){
            console.error(error);
            return;
        }

        console.log(data[0].img);
        setListing(data[0]);
        setLoading(false);
    }

    useEffect(() => {
        getListing();
    }, []);

    const formatCategory = (c) => {
        return c.replace(' ', '_');
    }

    return (
        <div>
            {
                loading ? <Loading /> :
                <div className="d-container">
                    <div className="d-images">
                        {(listing.img ? listing.img.length > 1 : false) && <button className="d-button left" onClick={() => setImage(image - 1 < 0 ? listing.img.length - 1 : image - 1)}>{<IoChevronBack />}</button>}
                        {(listing.img ? listing.img.length > 1 : false) && <button className="d-button right" onClick={() => setImage((image + 1) % listing.img.length)}>{<IoChevronBack />}</button>}
                        {(listing.img ? listing.img.length > 1 : false) && 
                            <div className="d-dots">
                                {
                                    listing.img.map((element, index, key) => (
                                        <GoDotFill className={`d-dot ${index == image ? "selected" : ""}`} key={key} />
                                    ))
                                }
                            </div>
                        }
                        <img src={listing.img ? listing.img[image] : listing.img} alt="" />
                    </div>
                    <div className="d-info">
                        <small className="d-category" onClick={() => navigate(`/${formatCategory(listing.category)}`)}>{listing.category}</small>
                        <small className="d-title">{listing.title}</small>
                        <small className="d-year">{listing.medium}, {listing.year}</small>
                        <small>{listing.description || "No description provided."}</small>
                        <div style={{marginTop:"1rem"}}>
                            {listing.instagram && 
                                <div className="social listing-link" onClick={() => {window.open(listing.instagram, '_blank', 'noopener,noreferrer');}}>
                                    <IoLogoInstagram />
                                    <small>View on Instagram</small>
                                </div>
                            }
                            {listing.spotify && 
                                <div className="social listing-link" onClick={() => {window.open(listing.spotify, '_blank', 'noopener,noreferrer');}}>
                                    <FaSpotify />
                                    <small>View on Spotify</small>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}