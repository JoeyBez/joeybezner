import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "./lib/supabaseClient";
import Loading from "./Loading";
import './DevPage.css';
import { IoCheckmark, IoTrashOutline } from "react-icons/io5";

export default function DevPage(){
    const [loading, setLoading] = useState(false);
    const [commissions, setCommissions] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const password = import.meta.env.VITE_PASSWORD;

    const [editPrice, setEditPrice] = useState("");
    const [newPrice, setNewPrice] = useState(0);

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

    const getDate = (date) => {
        const full = date.toString().slice(0, 10);
        const month = date.slice(5, 7);
        const day = date.slice(8, 10);
        const year = date.slice(0, 4);

        return `${month}/${day}/${year}`;
    }

    return(
        <div>
            {searchParams.get('password') == password ? 
            <div>
                <h2>Commisions</h2>
                {loading ?
                <Loading />
                :
                <div class="table-container">
                    <table style={{textAlign:"left"}}>
                        <thead>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Date</th>
                            <th>Price</th>
                            <th>Status</th>
                        </thead>
                        <tbody>
                        {
                            commissions.map((c) => (
                                <tr key={c.id}>
                                    <td>{c.name}</td>
                                    <td>{c.email}</td>
                                    <td>{getDate(c.date)}</td>
                                    <td onClick={() => {setNewPrice(c.price); setEditPrice(c.id);}}>{editPrice == c.id ? 
                                        <div style={{display:"flex", gap:"0.5rem"}}><input type="number" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} style={{width:"50px", fontSize:"1rem"}}/><IoCheckmark style={{cursor:"pointer"}} onClick={() => {setEditPrice("")}}/></div>
                                        : 
                                        `$${c.price}`
                                    }</td>
                                    <td><div className={`status ${c.status.toString().replace(' ', '')}`}>{c.status.toString()}</div></td>
                                    <td><IoTrashOutline className="trash"/></td>
                                </tr>
                            ))
                        }
                        </tbody>
                    </table>
                </div>
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