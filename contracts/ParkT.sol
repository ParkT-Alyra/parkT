// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "@openzeppelin/contracts/access/Ownable.sol";

contract ParkT is Ownable { //parkTBooking + 1 contrat token
    // state variables
    uint256 parkingId;

    // events
    event ParkingRegistered(uint256 parkingId);
    event ParkingBooked(uint256 parkingId);
    event ParkingReleased(uint256 parkingId);

    // function modifiers

    // struct, arrays, mapping or enums
    struct Coordinates {
        uint256 x;
        uint256 y;
    }

    struct Parking {
        address payable owner;
        uint256 priceBySecond; // à la seconde + 10* 60*60 86400 token + deposit mise en fourriere
        uint256 deposit; // à la seconde + 10* 60*60 86400 token + deposit mise en fourriere
        uint16 postalCode; // getParkingByPostalCode 06550
        Coordinates coordinate;
    }

    struct Booking {
        address payable driver;
        uint256 timestamp;
        uint256 requiredAmount;
    }

    // all parkings
    mapping(uint => Parking) public parkingById;
    mapping(uint => Booking) public bookingByParkingId;
    // mapping parking by postalcode  idParking => po

    function getParkingId() public view returns (uint256) {
        return parkingId;
    }

    function registerParking(uint256 _price, uint256 _deposit, uint16 _postalCode, Coordinates memory _coordinate) external {
        parkingById[parkingId] = Parking(payable(msg.sender), _price, _deposit, _postalCode, _coordinate);
        emit ParkingRegistered(parkingId);
        parkingId += 1;
    }

    function bookParking(uint _parkingId) payable public {
        Booking memory booking = bookingByParkingId[_parkingId];
        require(booking.timestamp == 0,  "Not available");

        // vérification des fonds
        Parking memory parking = parkingById[_parkingId];
        uint dailyPrice = parking.priceBySecond * 1 days;
        uint minRequireDemand = dailyPrice + parking.deposit;
        require(msg.value == minRequireDemand, "Insufficient funds");

        // mise à jour de la Blockchain
        booking.requiredAmount = minRequireDemand;
        booking.timestamp = block.timestamp;
        booking.driver = payable(msg.sender);

        emit ParkingBooked(_parkingId);
    }


    function releaseParking(uint _parkingId) public {
        Booking memory booking = bookingByParkingId[_parkingId];

        require(booking.driver == msg.sender, "Driver not booker");

        uint256 delay = block.timestamp - booking.timestamp;
        Parking memory parking = parkingById[_parkingId];

        // paiement au propriétaire
        uint256 amount = parking.priceBySecond * delay;
        parking.owner.transfer(amount);

        // mise à jour de la Blockchain
        uint256 driverRefund = booking.requiredAmount - amount;
        booking.timestamp = 0;
        booking.driver = payable(address(0));
        booking.requiredAmount = 0;
        payable(msg.sender).transfer(driverRefund);

        emit ParkingReleased(_parkingId);
    }
}
