import React from 'react';

function AdminParking() {
    return (
        <div className="iot-sensor-simulation">
            <h1>Administration Parking</h1>
            <button>Simulation IoT detection arrivée</button>
            <p>Donc annulation du compte à rebour de 5mn pour accéder à la place</p>

            <button>Simulation IoT detection départ</button>
            <p>Et donc la place est de nouveau disponible sur le marché</p>
        </div>
    );
}

export default AdminParking;