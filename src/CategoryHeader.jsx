export default function CategoryHeader(params){
    const {category} = params;

    return (
        <div className="category-header">
            <h2>{category ? category : "All Works"}</h2>
        </div>
    );
}