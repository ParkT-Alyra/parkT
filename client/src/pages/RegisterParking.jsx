import React from 'react';

function RegisterParking(props) {
    const {registerParking, price, postalCode, coordX, coordY, deposite } = props;
    return (
        <div className="container">
            <div className="columns">
                <div className="column is-full">
                    <h1 className="title pt-5 has-text-white">Un parking ? Enregistrez-vous !</h1>
                </div>
            </div>
            <div className="columns is-centered">
                <div className="column is-one-fifth">
                   <div className="registerParking">
                    <label className="has-text-white">Tarif</label>
                    <input className="input is-warning is-small is-rounded mb-2" size="5" ref={price} type="text"/>
                    <label className="has-text-white">Code Postal</label>
                    <input className="input is-warning is-small is-rounded mb-2" ref={postalCode} type="text"/>
                    <label className="has-text-white">Coordonnées Lat</label>
                    <input className="input is-warning is-small is-rounded mb-2" ref={coordX} type="text"/>
                    <label className="has-text-white">Coordonnées Long</label>
                    <input className="input is-warning is-small is-rounded mb-2" ref={coordY} type="text"/>
                    <label className="has-text-white">Caution demandée</label>
                    <input className="input is-warning is-small is-rounded mb-4" ref={deposite} type="text"/>
                    <button className="button is-warning mb-2" onClick={registerParking}>Enregistrer votre Parking</button>
                </div>
            </div>
        </div>
    </div>
    );
}

export default RegisterParking;
