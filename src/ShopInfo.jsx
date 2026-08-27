import { IoChevronBack } from "react-icons/io5";
import './ShopInfo.css'

export default function ShopInfo(params){
    const {shop, listing} = params;

    const emailBody = `
        Hello, I am interested in purchasing ${listing.title}.
    `;
    return (
    <div className="shop-container">
        {/* <small className="shop-type">{shop[0].type.toString()}</small> */}
        <h1 className="shop-price">${shop[0].price}</h1>
        <a className="shop-button" href={`mailto:joeybezner@gmail.com?subject=${listing.title} inquiry - ${listing.id}&body=${emailBody}`}>Inquire</a>
        <div className="specs">
            {/* <div className="specs-button">
                <p>Product Specs</p>
                <div><IoChevronBack className="icon"/></div>
            </div> */}
            <div className="specs-button">
                <p>Type</p>
                <div><p>{shop[0].type.toString()}</p></div>
            </div>
            <div className="specs-button">
                <p>Dimensions</p>
                <div><p>{shop[0].dimensions} in</p></div>
            </div>
            <div className="specs-button">
                <p>Date Posted</p>
                <div><p>{shop[0].date_posted.toString().slice(0, 10)}</p></div>
            </div>
            {shop[0].paper && <div className="specs-button">
                <p>Paper Type</p>
                <div><p>{shop[0].paper}</p></div>
            </div>}
        </div>
    </div> 
    );
}