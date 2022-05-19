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
    /// @notice Emitted when withdraw is done by the owner
    /// @param amount amount received by the owner
    event DonePayment(uint256 amount);

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
        uint256 priceBySecond;
        uint256 deposit;
        uint256 balance;
        uint16 postalCode;
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

    /// @notice check if the withdraw is from the parking owner
    modifier isParkingOwner(uint _parkingId) {
        require(parkingById[_parkingId].owner == msg.sender, "not owner");
        _;
    }

    function getParkingId() public view returns (uint256) {
        return parkingId;
    }

    /// @notice register a parking with all information
    /// @param _price is the price for one second
    /// @param _deposit is the price collateral in case of any problem
    /// @param _postalCode is for the parking display
    /// @param _coordinate is for the coordinate of the parking
    function registerParking(uint256 _price, uint256 _deposit, uint16 _postalCode, Coordinates memory _coordinate) external {
        parkingById[parkingId] = Parking(payable(msg.sender), _price, _deposit, 0, _postalCode, _coordinate);
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
        parking.balance += amount;

        uint256 driverRefund = booking.requiredAmount - amount;
        booking.timestamp = 0;
        booking.driver = payable(address(0));
        booking.requiredAmount = 0;

        // update Blockchain
        bookingByParkingId[_parkingId] = booking;
        payable(msg.sender).transfer(driverRefund);

        emit ParkingReleased(_parkingId, amount, driverRefund);
    }

    /// @notice withdraw for the parking owner
    /// @param _parkingId id of the parking wanted to get balance by the owner
    function withdraw(uint _parkingId) public isParkingOwner(_parkingId) {
        uint amount = parkingById[_parkingId].balance;
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transaction failed"); //Require the transaction success or revert
        emit DonePayment(amount);
        parkingById[_parkingId].balance = 0;
    }
}
