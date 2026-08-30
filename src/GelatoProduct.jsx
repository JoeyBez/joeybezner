import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";

export default function GelatoProduct(params){
    const {data, product} = params;
    const [price, setPrice] = useState();

    useEffect(() => {
        const getPrice = async () => {
            try {
                const { data, error } = await supabase.functions.invoke(
                    "gelato_getPrice",
                    {
                        body: {product: product}
                    }
                );

                if (error) {
                    console.error("Supabase function error:", error);
                    return;
                }

                console.log("Gelato price:", data);

                setPrice(data);
            } catch (error) {
                console.error("Error fetching Gelato template:", error);
            }
        };

        if(data) getPrice();
    }, [data]);

    return (
        <div style={{width:"200px"}}>
            <img src={data.previewUrl} style={{width:"100%"}} alt="" />
            <p>{data.title}</p>
        </div>
    );
}