import { useState } from 'react';
import './CommissionForm.css'
import { supabase } from './lib/supabaseClient';
import Loading from './Loading';
import GetPrice from './GetPrice';

export default function CommissionForm(){
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [photo, setPhoto] = useState();
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [message, setMessage] = useState("");

    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const submit = async (e) => {
        e.preventDefault();
        
        setLoading(true);
        const formData = new FormData();

        formData.append("firstName", firstName);
        formData.append("lastName", lastName);
        formData.append("email", email);
        formData.append("width", width);
        formData.append("height", height);
        formData.append("message", message);

        if (photo) {
            formData.append("photo", photo);
        }

        // console.log("PHOTO:", {
        //     exists: photo instanceof File,
        //     name: photo instanceof File ? photo.name : null,
        //     type: photo instanceof File ? photo.type : null,
        //     size: photo instanceof File ? photo.size : null,
        // });

        const { data, error } = await supabase.functions.invoke(
            "resend",
            {
                body: formData,
            }
        );

        if (error) {
            setLoading(false);
            setResult("There was an error submitting the form.");
            return;
        }

        setResult("Commission request received! You should get a response soon.");
        setLoading(false);

        addCommission();
    };

    async function addCommission(){
        const {error} = await supabase
            .from('commissions')
            .insert({
                name: `${firstName} ${lastName}`, 
                email: email, 
                price: GetPrice(width, height)
            });
        
        if(error){
            console.error(error);
            setLoading(false);
            return;
        }
    }

    return(
        <div style={{textAlign:"center"}}>
            <h2>Request a Commission</h2>
            <br />
            {loading ?
            <Loading />
            :
            result ?
            <div>
                <p>{result}</p>
            </div>
            :
            <form onSubmit={submit}>
                <p style={{fontSize:"1rem", textAlign:"left"}}>Get your own personalized colored pencil portrait. Fill out this form to receive a quote. Prices will vary based on size and complexity.</p>
                <div className='form-names'>
                    <span className="form-input">
                        <label><small>First Name</small></label>
                        <input name="First Name" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required/>
                    </span>
                    <span className="form-input">
                        <label><small>Last Name</small></label>
                        <input name="Last Name" type="text" placeholder='Optional' value={lastName} onChange={(e) => setLastName(e.target.value)}/>
                    </span>
                </div>
                <span className="form-input">
                    <label><small>Email</small></label>
                    <input name="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                </span>
                <span className="form-input">
                    <label><small>Reference Photo</small></label>
                    <input name="Reference Photo" type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files[0])} style={{border:"none"}} />
                    <small style={{width:"50%", fontSize:"10px"}}>Note: this image will be exactly whats drawn, make sure the quality and lighting is good</small>
                </span>
                <div className='form-names'>
                    <span className="form-input">
                        <label><small>Width (inches)</small></label>
                        <input name="Width" type="number" min="0" max="14" inputMode="decimal" step="0.1" value={width} onChange={(e) => setWidth(e.target.value)} />
                    </span>
                    <span className="form-input">
                        <label><small>Height (inches)</small></label>
                        <input name="Height" type="number" min="0" max="14" inputMode="decimal" step="0.1" value={height} onChange={(e) => setHeight(e.target.value)} />
                    </span>
                </div>
                <span className="form-input">
                    <label><small>Message</small></label>
                    <textarea name="Message" rows="5" placeholder='Optional' value={message} onChange={(e) => setMessage(e.target.value)}/>
                </span>
                <br />
                <button type="submit" className='form-submit'>Submit</button>
            </form>}
        </div>
    );
}