// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ParkT is Ownable { //parkTBooking + 1 contrat token
    // state variables
    /// @notice Counter helper for increment/decrement
    /// @dev Counter from openzeppelin
    using Counters for Counters.Counter;
    /// @notice Counter helper for counting parkings registered
    /// @dev Counter for all parkings 
    Counters.Counter private _parkingIds;
    /// @notice Counter for current booked parkings
    /// @dev Counter for all booked parkings 
    Counters.Counter private _bookedParkingIds;

    uint public availableParkingsCounter;

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
        string x;
        string y;
    }

    /// @notice struct for parking registration
    /// @dev Parking is the main struct representing a spot for a car
    struct Parking {
        address payable owner;
        uint id;
        uint256 priceBySecond;
        uint256 deposit;
        uint256 balance;
        string postalCode;
        Coordinates coordinate;
    }

    /// @notice struct for booking reservation
    /// @dev Booking is the struct representing a booking by a driverbookParking
    struct Booking {
        address payable driver;
        uint256 timestamp;
        uint256 amount;
    }

    // all parkings
    /// @notice list of registered parking by id
    /// @dev use for registering all the parking
    mapping(uint => Parking) public parkingById;
    /// @notice list of parking booked by id
    /// @dev use for registering all booking and display available parking
    mapping(uint => Booking) public bookedParkingId;

    /// @notice check if the withdraw is from the parking owner
    /// @dev check if the transaction signer is the owner of the parking
    modifier isParkingOwner(uint _parkingId) {
        require(parkingById[_parkingId].owner == msg.sender, "not owner");
        _;
    }

    ///@notice getter for the current parking ID
    ///@dev parkingId less one is the number of the parking registering - TODO use instead @openzeppelin/contracts/utils/Counters.sol
    function getParkingId() public view returns (uint256) {
        return _parkingIds.current();
    }

    function getAvailableParkingsCounter() public view returns (uint) {
        return availableParkingsCounter;
    }

    /// @notice register a parking with all information
    /// @param _price is the price for one second
    /// @param _deposit is the price collateral in case of any problem
    /// @param _postalCode is for the parking display
    /// @param _coordinate is for the coordinate of the parking
    /// @dev simply add an entry in the mapping parkingById for listing all parking
    function registerParking(uint256 _price, uint256 _deposit, string memory _postalCode, Coordinates memory _coordinate) external {
        _parkingIds.increment();
        uint parkingId = _parkingIds.current();
        parkingById[parkingId] = Parking(payable(msg.sender), parkingId, _price, _deposit, 0, _postalCode, _coordinate);
        emit ParkingRegistered(parkingId);
    }

    /// @notice fetch all parkings (for demonstration purposes)
    /// @dev return list of all registered parkings (use of memory array building pattern https://fravoll.github.io/solidity-patterns/memory_array_building.html)
    function fetchParkings() public view returns (Parking[] memory) {
        uint parkingCount = _parkingIds.current();

        Parking[] memory parkings = new Parking[](parkingCount);
        for (uint i = 0; i < parkingCount; i++) {
            uint currentId = i + 1;
            Parking storage currentParking = parkingById[currentId];
            parkings[i] = currentParking;
        }
        return parkings;
    }

    /// @notice fetch all available parkings
    /// @dev return list of all registered parkings that are not already booked
    function fetchAvailableParkings() public returns (Parking[] memory) {
        uint parkingCount = _parkingIds.current();
        uint availableParkingCount = _parkingIds.current() - _bookedParkingIds.current();
        availableParkingsCounter = availableParkingCount;

        Parking[] memory availableParkings = new Parking[](availableParkingCount);
        for (uint i = 0; i < parkingCount; i++) {
            uint currentId = i + 1;
            Booking memory booking = bookedParkingId[currentId];
            if (booking.timestamp == 0) {
                availableParkings[i] = parkingById[currentId];
            }
        }
        return availableParkings;
    }

    /// @notice book a parking by a driver
    /// @param _parkingId id of the parking wanted to book by the driver
    /// @dev checks about availability and authorized the transaction - update bookedParkingId with the booking
    function bookParking(uint _parkingId) payable external {
        Parking memory parking = parkingById[_parkingId];
        require(parking.owner != address(0),  "Parking not register");

        Booking memory booking = bookedParkingId[_parkingId];
        require(booking.timestamp == 0,  "Not available");

        // vérification des fonds
        uint dailyPrice = parking.priceBySecond * 1 days;
        uint minRequireDemand = dailyPrice + parking.deposit;
        require(msg.value >= minRequireDemand, "Insufficient funds");

        booking.amount = msg.value;
        booking.timestamp = block.timestamp;
        booking.driver = payable(msg.sender);

        // update Blockchain
        bookedParkingId[_parkingId] = booking;
        _bookedParkingIds.increment();

        emit ParkingBooked(_parkingId);
    }

    /// @notice release a parking by a driver
    /// @param _parkingId id of the parking wanted to release by the driver
    /// @dev call by the IOT with the booker address
    /// @dev save the collateral for the owner and refund the driver
    function releaseParking(uint _parkingId) external {
        Booking memory booking = bookedParkingId[_parkingId];

        require(booking.driver == msg.sender, "Driver not booker");

        uint256 delay = block.timestamp - booking.timestamp;
        Parking memory parking = parkingById[_parkingId];

        // paiement au propriétaire
        uint256 amount = parking.priceBySecond * delay;
        parking.balance += amount;

        uint256 driverRefund = booking.amount - amount;
        booking.timestamp = 0;
        booking.driver = payable(address(0));
        booking.amount = 0;

        // update Blockchain
        bookedParkingId[_parkingId] = booking;
        _bookedParkingIds.decrement();
        (bool success, ) = payable(msg.sender).call{value: driverRefund}("");
        require(success, "Transaction failed"); //Require the transaction success or revert

        emit ParkingReleased(_parkingId, amount, driverRefund);
    }

    /// @notice withdraw for the parking owner
    /// @param _parkingId id of the parking wanted to get balance by the owner
    /// @dev avoid pull payment attack by using a function for the withdraw
    function withdraw(uint _parkingId) external isParkingOwner(_parkingId) {
        uint amount = parkingById[_parkingId].balance;
        parkingById[_parkingId].balance = 0;
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transaction failed"); //Require the transaction success or revert
        emit DonePayment(amount);
    }
}
