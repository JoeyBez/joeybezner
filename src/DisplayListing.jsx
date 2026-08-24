import { useEffect, useState } from "react";
import Loading from "./Loading";
import { supabase } from "./lib/supabaseClient";
import './DisplayListing.css'
import { IoChevronBack } from "react-icons/io5";
import { GoDotFill } from "react-icons/go";

export default function DisplayListing(params){
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
                        <small className="d-title">{listing.title}</small>
                        <small className="d-year">{listing.medium}, {listing.year}</small>
                    </div>
                </div>
            }
        </div>
    );
}