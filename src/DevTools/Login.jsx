import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import DevPage from "../DevPage";
import Loading from "../Loading";
import { useSearchParams } from "react-router-dom";

export default function Login(params){
    const {session} = params;
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [result, setResult] = useState("");
    const [searchParams, setSearchParams] = useSearchParams();

    async function signInWithEmail() {
        setLoading(true);
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        })
        setLoading(false);

        if(error) {setResult(error.message); return;}
            
        window.location.reload();
    }

    async function signOut(){
        setLoading(true);
        let { error } = await supabase.auth.signOut();
        setLoading(false);
        if(error) {setResult(error.message); return;}
        window.location.reload();
    }

    useEffect(() => {
        console.log(session);
        if(session) {setSearchParams({id: session.id});}
        else {setSearchParams();}
    }, [session]);

    return(
        <div>
            {session ?
                <div>
                    <h2>Hi, Joey</h2>
                    <p style={{color:"red"}}>{result}</p>
                    <button onClick={signOut}>Log Out</button>
                    <div>
                        <DevPage />
                    </div>
                </div>
            :
                (loading ?
                <Loading />
                :
                <div>
                    <p>Sign In</p>
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <br />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <br />
                    <p style={{color:"red"}}>{result}</p>
                    <br />
                    <button onClick={signInWithEmail}>Login</button>
                </div>)
            }
        </div>
    );
}