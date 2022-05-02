// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

contract ParkT {
  // Information sur le parking
  struct Parking {
    string postalAddress;
    uint8 startHour;
    uint8 endHour;
  }

  // référencement des parkings mis à disposition des conducteurs
  mapping(address => Parking) public spot;

  //Events
  event parkingRegister(address parkingOwner);
  // enregistrement d'un parking pour un propriétaire
  function parkRegister(string calldata _address) public {
    spot[msg.sender] = Parking(_address, 0, 0);
    emit parkingRegister(msg.sender);
  }

  // function pour la réservation du parking

}
