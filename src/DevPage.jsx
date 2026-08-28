import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "./lib/supabaseClient";
import Loading from "./Loading";
import './DevPage.css';

export default function DevPage(){
    const [loading, setLoading] = useState(false);
    const [commissions, setCommissions] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const password = import.meta.env.VITE_PASSWORD;
    
    useEffect(() => {
        async function getCommissions(){
            if(searchParams.get('password') != password) return;
            
            setLoading(true);
            const {data, error} = await supabase
                .from('commissions')
                .select('*')
                .order('date', { ascending: false })

            if(error){
                console.error(error);
                return;
            }
            
            console.log(data);
            setCommissions(data);
            setLoading(false);
        }
        getCommissions();
    }, []);

    return(
        <div>
            {searchParams.get('password') == password ? 
            <div>
                <h3>Commisions</h3>
                {loading ?
                <Loading />
                :
                <table style={{textAlign:"left"}}>
                    <thead>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Date</th>
                        <th>Status</th>
                    </thead>
                    <tbody>
                    {
                        commissions.map((c) => (
                            <tr key={c.id}>
                                <td>{c.name}</td>
                                <td>{c.email}</td>
                                <td>{c.date.toString().slice(0, 10)}</td>
                                <td><div className={`status ${c.status.toString().replace(' ', '')}`}>{c.status.toString()}</div></td>
                            </tr>
                        ))
                    }
                    </tbody>
                </table>
                }
            </div>
            :
            <div>
                Page not found.
            </div>
            }
        </div>
    );
}