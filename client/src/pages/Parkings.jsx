import React from 'react';

const parkings = [
    "06000",
    "06100",
    "06200",
    "06300",
    "75014"
  ];

function Parkings() {
    const [searchTerm, setSearchTerm] = React.useState("");
    const [searchResults, setSearchResults] = React.useState([]);
    const handleChange = event => {
        setSearchTerm(event.target.value);
    };
    React.useEffect(() => {
        const results = parkings.filter(parking =>
            parking.toLowerCase().includes(searchTerm)
        );
        setSearchResults(results);
      }, [searchTerm]);

    return (
        <div class="Parkings">
            <h1>Recherchez une place en entrant un code postal</h1>
            <label>Trouvez des places de parking</label>
            <input type="text" placeholder="code postal" value={searchTerm} onChange={handleChange}/>
            <ul>
                {searchResults.map(item => (
                 <li>{item}</li>
                ))}
            </ul>
        </div>
    );
}

export default Parkings;