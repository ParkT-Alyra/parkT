import React from 'react';

function RegisterParking(props) {
    const {registerParking, price, postalCode, coordX, coordY, deposite } = props;
    return (
        <div className="registerParking">
            <h1>Un parking ? Enregistrez-vous !</h1>
            <h3>Tarif</h3>
            <input ref={price} type="text" />
            <h3>Code Postal</h3>
            <input ref={postalCode} type="text" />
            <h3>Coordonnées Lat</h3>
            <input ref={coordX} type="text" />
            <h3>Coordonnées Long</h3>
            <input ref={coordY} type="text" />
            <h3>Caution demandée</h3>
            <input ref={deposite} type="text" />
            <br/>
            <br/>
            <button onClick={registerParking}>Enregistrer votre Parking</button>
        </div>
    );
}

export default RegisterParking;
