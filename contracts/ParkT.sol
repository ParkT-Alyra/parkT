// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "@openzeppelin/contracts/access/Ownable.sol";

contract ParkT is Ownable { //parkTBooking + 1 contrat token
    // state variables
    uint256 parkingId;

    /// @notice Emitted when a Parking is register
    /// @dev Emitted when registerParking called
    /// @param parkingId ID of the parking
    event ParkingRegistered(uint256 parkingId);
    /// @notice Emitted when a Parking is booked
    /// @dev Emitted when bookParking called
    /// @param parkingId ID of the parking
    event ParkingBooked(uint256 parkingId);
    /// @notice Emitted when a Parking is released
    /// @dev Emitted when releaseParking called
    /// @param parkingId ID of the parking
    /// @param payedAmount amount paid to the parking owner
    /// @param refundAmount amount refund to the driver
    event ParkingReleased(uint256 parkingId, uint256 payedAmount, uint256 refundAmount);

    // function modifiers

    /// @notice coordinates of the parking
    /// @dev abscissa and ordinate
    struct Coordinates {
        uint256 x;
        uint256 y;
    }

    /// @notice struct for parking registration
    /// @dev Parking is the main struct representing a spot for a car
    struct Parking {
        address payable owner;
        uint256 priceBySecond; // à la seconde + 10* 60*60 86400 token + deposit mise en fourriere
        uint256 deposit; // à la seconde + 10* 60*60 86400 token + deposit mise en fourriere
        uint16 postalCode; // getParkingByPostalCode 06550
        Coordinates coordinate;
    }

    /// @notice struct for booking reservation
    /// @dev Booking is the struct representing a booking by a driver
    struct Booking {
        address payable driver;
        uint256 timestamp;
        uint256 requiredAmount;
    }

    // all parkings
    /// @notice list of registered parking by id
    mapping(uint => Parking) public parkingById;
    /// @notice list of parking booked by id
    mapping(uint => Booking) public bookingByParkingId;
    // @TODO mapping parking by postalcode  idParking => po

    function getParkingId() public view returns (uint256) {
        return parkingId;
    }

    /// @notice register a parking with all information
    /// @param _price is the price for one second
    /// @param _deposit is the price collateral in case of any problem
    /// @param _postalCode is for the parking display
    /// @param _coordinate is for the coordinate of the parking
    function registerParking(uint256 _price, uint256 _deposit, uint16 _postalCode, Coordinates memory _coordinate) external {
        parkingById[parkingId] = Parking(payable(msg.sender), _price, _deposit, _postalCode, _coordinate);
        emit ParkingRegistered(parkingId);
        parkingId += 1;
    }

    /// @notice book a parking by a driver
    /// @param _parkingId id of the parking wanted to book by the driver
    function bookParking(uint _parkingId) payable public {
        Parking memory parking = parkingById[_parkingId];
        require(parking.owner != address(0),  "Parking not register");

        Booking memory booking = bookingByParkingId[_parkingId];
        require(booking.timestamp == 0,  "Not available");

        // vérification des fonds
        uint dailyPrice = parking.priceBySecond * 1 days;
        uint minRequireDemand = dailyPrice + parking.deposit;
        require(msg.value == minRequireDemand, "Insufficient funds");

        booking.requiredAmount = minRequireDemand;
        booking.timestamp = block.timestamp;
        booking.driver = payable(msg.sender);

        // update Blockchain
        bookingByParkingId[_parkingId] = booking;

        emit ParkingBooked(_parkingId);
    }

    /// @notice release a parking by a driver
    /// @param _parkingId id of the parking wanted to release by the driver
    function releaseParking(uint _parkingId) public {
        Booking memory booking = bookingByParkingId[_parkingId];

        require(booking.driver == msg.sender, "Driver not booker");

        uint256 delay = block.timestamp - booking.timestamp;
        Parking memory parking = parkingById[_parkingId];

        // paiement au propriétaire
        uint256 amount = parking.priceBySecond * delay;
        parking.owner.transfer(amount);
// TODO check reentrancy
        uint256 driverRefund = booking.requiredAmount - amount;
        booking.timestamp = 0;
        booking.driver = payable(address(0));
        booking.requiredAmount = 0;

        // update Blockchain
        bookingByParkingId[_parkingId] = booking;
        payable(msg.sender).transfer(driverRefund);

        emit ParkingReleased(_parkingId, amount, driverRefund);
    }
}
