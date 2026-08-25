import { useEffect, useState } from "react";
import Loading from "./Loading";
import { supabase } from "./lib/supabaseClient";
import './DisplayListing.css'
import { IoChevronBack, IoLogoInstagram } from "react-icons/io5";
import { IoIosLink } from "react-icons/io";
import { GoDotFill } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import GetShop from "./GetShop";
import ShopInfo from "./ShopInfo";

export default function DisplayListing(params){
    const navigate = useNavigate();
    const {id} = params;
    const [loading, setLoading] = useState(false);
    const [listing, setListing] = useState({});
    const [image, setImage] = useState(0);
    const [shop, setShop] = useState();

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

        // console.log(data[0].img);
        setListing(data[0]);

        const s_data = await GetShop(setLoading, data[0].id);
        // console.log(s_data);
        setShop(s_data);

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
                        {listing.subtitle && <small className="d-subtitle">{listing.subtitle}</small>}
                        <small className="d-year">{listing.medium}, {listing.year}</small>
                        <small>{listing.description || ""}</small>
                        {shop ? shop.length > 0 ? 
                            <ShopInfo shop={shop} listing={listing} />
                        : null : null}
                        <div style={{marginTop:"1rem"}}>
                            {listing.external_link &&
                                <div className="social listing-link" onClick={() => {window.open(listing.external_link.link, '_blank', 'noopener,noreferrer');}}>
                                    <IoIosLink />
                                    <small>View on {listing.external_link.site}</small>
                                </div>
                            }
                            {listing.instagram && 
                                <div className="social listing-link" onClick={() => {window.open(listing.instagram, '_blank', 'noopener,noreferrer');}}>
                                    <IoLogoInstagram />
                                    <small>View on Instagram</small>
                                </div>
                            }
                            {listing.spotify && 
                                <div dangerouslySetInnerHTML={{__html: listing.spotify}}/>
                            }
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}