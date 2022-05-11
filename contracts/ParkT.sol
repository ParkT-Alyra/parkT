// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";

contract ParkT is Ownable {
    // state variables

    // events
    event LogParkingBookedPayment(address driverAddress);
    event LogParkingRelease(address ownerBooked);

    // function modifiers

    // struct, arrays, mapping or enums
    struct Coordinates {
        uint256 x;
        uint256 y;
    }

    struct ParkingSpot {
        uint256 price;
        // string availabilityDate; pas de date pour le MVP - on assume que la réservation se fait de 8h à 18h
        bool isRegistered;
        bool isAvailable;
        Coordinates coordinate;
    }

    ParkingSpot[] public ParkingSpots;

    // all parkings
    mapping(address => ParkingSpot) public Parkings;

    //driverAddress => parkingOwnerAddress
    mapping(address => address) public BookedParkings;

    mapping(address => uint256) private _balances;

    //available parkings
    mapping(address => ParkingSpot) public AvailableParkingOffers;

    function registerParking(uint256 _price) external {
        require(!Parkings[msg.sender].isRegistered, "ParkingSpot already registered");
        addParkingSpot(msg.sender, _price);
    }

    function addParkingSpot(address _parkingSpotAddress, uint256 _price) internal {
        Parkings[_parkingSpotAddress] = ParkingSpot({price: _price, isRegistered: true, isAvailable: true, coordinate: Coordinates({x: 100, y: 100})});
        AvailableParkingOffers[_parkingSpotAddress] = Parkings[_parkingSpotAddress];
        ParkingSpots.push(Parkings[_parkingSpotAddress]);
    }

    function bookParkingSpot(address _parkingSpotAddress) payable public {
        require(Parkings[_parkingSpotAddress].isRegistered, "Unknow parking spot");
        require(Parkings[_parkingSpotAddress].isAvailable, "Not available");
        require(msg.value >= Parkings[_parkingSpotAddress].price, "Insufficient funds");
        _balances[msg.sender] += msg.value;
        addBookedParkingSpot(msg.sender, _parkingSpotAddress);
        emit LogParkingBookedPayment(msg.sender);
        updateParkingSpotAvailability(_parkingSpotAddress, false);
        delete AvailableParkingOffers[_parkingSpotAddress];
    }

    function addBookedParkingSpot(address _driverAddress, address _parkingSpotAddress) internal {
        BookedParkings[_driverAddress] = _parkingSpotAddress;
    }

    function getParkingBalance(address _parkingSpotAddress) public view returns (uint256) {
        return _balances[_parkingSpotAddress];
    }

    function updateParkingSpotAvailability(address _parkingSpotAddress, bool isAvailable) internal {
        Parkings[_parkingSpotAddress].isAvailable = isAvailable;
    }

    function releaseParkingSpot(address _parkingSpotAddress) public {
        require(Parkings[_parkingSpotAddress].isRegistered, "Unknow parking spot");
        updateParkingSpotAvailability(_parkingSpotAddress, true);
        delete BookedParkings[msg.sender];
        emit LogParkingRelease(_parkingSpotAddress);
        // TODO Paiement au propriétaire
    }
}
