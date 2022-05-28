import React, {useEffect, useState} from 'react';

function ParkingItem(props) {
    const {bookParking} = props;

    return (
        <tr>
            <td>{props.uniqId}</td>
            <td>{props.postalCode}</td>
            <td>{props.priceBySecond}</td>
            <td>{props.deposit}</td>
            <td>{props.coordinate.x} - {props.coordinate.y}</td>
            <td>
                 <button id={props.uniqId} value={parseInt(props.priceBySecond)*24*60*60+parseInt(props.deposit)} onClick={bookParking}>Réserver le Parking</button>
            </td>
        </tr>
    );
}

function Parkings(props) {
    const {parkings, bookParking} = props;
    const [searchedPostalCode, setSearchedPostalCode] = useState("");
    const [parkingsFoundByPostalCode, setParkingsFoundByPostalCode] = useState([]);
    const handleChange = event => {
        setSearchedPostalCode(event.target.value);
    }
    useEffect(() => {
        const results = parkings.filter(parking => parking['postalCode'] === searchedPostalCode);
        setParkingsFoundByPostalCode(results);
      }, [searchedPostalCode]);
    const ParkingItems = parkingsFoundByPostalCode.map((parking) =>
        <ParkingItem key={parking.id}
            uniqId={parking.id}
            postalCode={parking.postalCode}
            priceBySecond={parking.priceBySecond}
            deposit={parking.deposit}
            coordinate={parking.coordinate}
            bookParking={bookParking}
        />
    );

    return (
        <div className="Parkings">
        <h1>Recherchez une place en entrant un code postal</h1>
        <label>Trouvez des places de parking</label>
        <input type="text" placeholder="code postal" value={searchedPostalCode} onChange={handleChange}/>
        <div className="box">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Code postal</th>
                        <th>Prix</th>
                        <th>Caution</th>
                        <th>Position GPS (map)</th>
                    </tr>
                </thead>
                <tbody>
                    {ParkingItems}
                </tbody>
            </table>
        </div>
    </div>
    )
}

export default Parkings;
