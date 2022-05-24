import React from 'react';

function RegisterParking(props) {
    const {registerParking} = props;
    return (
        <div>
            <h1>Un parking ? Enregistrez-vous !</h1>
            <button onClick={registerParking}>Register Parking</button>
        </div>
    );
}

export default RegisterParking;