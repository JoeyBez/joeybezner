import { useState, useEffect } from "react";
import { supabase } from "./lib/supabaseClient";
import './Home.css'
import { IoChevronBack, IoLocationOutline, IoLogoInstagram, IoLogoLinkedin, IoLogoTiktok } from "react-icons/io5";
import { useSearchParams } from "react-router-dom";
import { GoDotFill } from "react-icons/go";
import Loading from "./Loading";

export default function Home(){
    const [loading, setLoading] = useState(false);
    const [listings, setListings] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();

    const [image, setImage] = useState(0);

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
            {/* style={{backgroundImage: listings.length > 0 ? `url("${listings[0].img[0]}")` : ""}} */}
            <div className="home-info">
                <h1>Joey Bezner</h1>
                <p>University of Oregon Alum, Bachelor of Arts in Art with a minor in Computer Information Technology.</p>
                <p>Multimedia Artist with professional experience in <i>Illustration, Graphic Design, and Web/Game Development</i>.</p>
                <br />
                <p><IoLocationOutline /> Brooklyn, NY</p>
            </div>
            <div className="featured-container" style={{textAlign:"center"}}>
                <h3 style={{marginBottom:"1rem"}}>Featured</h3>
                {loading ? 
                <Loading />
                :
                <div className="featured">
                    <button className="d-button left" onClick={() => setImage(image - 1 < 0 ? listings.length - 1 : image - 1)}>{<IoChevronBack />}</button>
                    <button className="d-button right" onClick={() => setImage((image + 1) % listings.length)}>{<IoChevronBack />}</button>
                    <div className="d-dots">
                        {
                            listings.map((element, index, key) => (
                                <GoDotFill className={`d-dot ${index == image ? "selected" : ""}`} key={element.id} />
                            ))
                        }
                    </div>
                    {listings.length > 0 && 
                        <div className="listing" key={listings[image].id} onClick={() => setSearchParams({"listing": listings[image].id})}>
                            <img src={listings[image].img[0]} alt="Artwork Image" className="listing-image" />
                        </div>
                    }
                </div>}
            </div>
        </div>
    );
}