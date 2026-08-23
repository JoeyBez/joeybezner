import { IoOptions, IoSwapVertical } from "react-icons/io5";
import './Filter.css'
import { useState } from "react";

export default function Filter(params){
    const {filters, setFilters, mediums} = params;
    const [displayFilters, setDisplayFilters] = useState(false);

    return(
        <div style={{marginBottom:"2rem", display:"flex"}}>
            <div style={{display:"flex", gap:"0.5rem", alignItems:"center"}}>
                <div className="filter-bar" onClick={() => setDisplayFilters(!displayFilters)}>
                    <IoOptions />
                    <small>Filter</small>
                    {/* <small className="filter-bar-number">2</small> */}
                </div>
                {!filters.cleared && <small className="clear" onClick={() => {setFilters({cleared:true}); setDisplayFilters(false)}}>Clear</small>}
            </div>
            <div className={`more-filters ${displayFilters ? "in" : "out"}`} style={{display:"flex", gap:"1rem", padding:"1rem"}}>
                |
                <div className="filter-option">
                    <label><IoSwapVertical /> Descending</label>
                </div>
                |
                {mediums.map((medium, key) => (
                    <div className="filter-option" key={key}>
                        <input onChange={() => {setFilters({...filters, cleared:false, [medium]:!filters[medium]})}} checked={filters[medium] || false} type="checkbox" id={key} />
                        <label htmlFor={key} >{medium}</label>
                    </div>
                ))}
            </div>
        </div>
    );
}