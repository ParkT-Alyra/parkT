import React from 'react';

function Parkings({parkings}) {
    const [searchTerm, setSearchTerm] = React.useState("");
    const [searchResults, setSearchResults] = React.useState([]);
    const handleChange = event => {
        setSearchTerm(event.target.value);
    };
    React.useEffect(() => {
        const results = parkings.filter(parking => parking.postalCode == searchTerm
        );
        setSearchResults(results);
      }, [searchTerm]);

    return (
        <div className="Parkings">
            <h1>Recherchez une place en entrant un code postal</h1>
            <label>Trouvez des places de parking</label>
            <input type="text" placeholder="code postal" value={searchTerm} onChange={handleChange}/>
            <ul>
                {searchResults.map(item => (
                 <li key="{item}">{item.postalCode}, coordonnées : {item.coordinates.x} - {item.coordinates.y}</li>
                ))}
            </ul>
        </div>
    );
}

export default Parkings;