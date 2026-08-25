import { useEffect, useState } from "react";
import CategoryHeader from "./CategoryHeader";
import Loading from "./Loading";
import { supabase } from "./lib/supabaseClient";
import './Videos.css'

export default function Videos(){
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(false);

    async function getVideos(){
        setLoading(true);
        const { data, error } = await supabase
            .from('videos')
            .select('*');
        
        if(error){
            console.error(error);
            return;
        }else{
            setLoading(false);
            setVideos(data);
        }
    }

    useEffect(() => {
        getVideos();
    }, []);

    return(
        <div>
            <CategoryHeader category='Videos' />
            {loading 
            ?
                <Loading />
            :
                <div>
                    {videos.length > 0 &&
                        videos.map((video, key) => (
                            <div className="v-container" key={key}>
                                <div>
                                    <h2 className="v-title">{video.title}</h2>
                                    <h3 className="v-year">{video.year}</h3>
                                    <p className="v-desc">{video.description}</p>
                                </div>
                                <div className="v-embed">
                                    <div dangerouslySetInnerHTML={{__html: video.embed}}/>
                                </div>
                            </div>
                        ))
                    }
                </div>
            }
        </div>
    );
}