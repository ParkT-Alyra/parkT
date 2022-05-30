import React from 'react';

function AdminParking(props) {
    const {withdraw} = props;
    return (
        <div className="iot-sensor-simulation">
            <h1 className="title pt-5 has-text-white">Administration Parking</h1>
            <button className="button is-warning mb-2">Simulation IoT detection arrivée</button>
            <p className="has-text-white">Donc annulation du compte à rebour de 5mn pour accéder à la place</p>

            <button className="button is-warning mt-4">Simulation IoT detection départ</button>
            <p className="has-text-white pb-5">Et donc la place est de nouveau disponible sur le marché</p>

            <button className="button is-warning my-4" onClick={withdraw}>Récupérer ses fonds</button>
        </div>
    );
}

export default AdminParking;