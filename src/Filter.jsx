import { IoOptions, IoSwapVertical } from "react-icons/io5";
import './Filter.css'
import { useEffect, useState } from "react";

export default function Filter(params){
    const {filters, setFilters, mediums, asc} = params;
    const [displayFilters, setDisplayFilters] = useState(false);
    const [filterCount, setFilterCount] = useState(0);

    useEffect(() => {
        setFilterCount(Object.entries(filters).filter(([key, value]) => value === true && key != "cleared").length);
    }, [filters])

    return(
        <div style={{marginBottom:"2rem", display:"flex", borderTop:"1px solid var(--accent-color)", borderBottom:"1px solid var(--accent-color)"}}>
            <div style={{display:"flex", gap:"0.5rem", alignItems:"center"}}>
                <div className="filter-bar" onClick={() => setDisplayFilters(!displayFilters)}>
                    <IoOptions />
                    <small>Filter</small>
                    {filterCount > 0 && <small className="filter-bar-number">{filterCount}</small>}
                </div>
                {!filters.cleared && <small className="clear" onClick={() => {setFilters({cleared:true, ascending:false}); setDisplayFilters(false)}}>Clear</small>}
            </div>
            <div className={`more-filters ${displayFilters ? "in" : "out"}`} style={{display:"flex", gap:"1rem", padding:"1rem"}}>
                |
                <div className="filter-option">
                    <label onClick={() => {asc.set(!asc.value)}}><IoSwapVertical /> {asc.value ? "Ascending" : "Descending"}</label>
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