// Voting.sol
// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";

contract ParkT is Ownable {
    // state variables
    
    // events
    event LogParkingBookedPayment(address driverAddress);
    
    // function modifiers
    
    // struct, arrays, mapping or enums
    struct ParkingSpot {
        uint256 price;
        string availabilityDate;
        bool isRegistered;
        bool isAvailable;
    }

    mapping(address => ParkingSpot) Parkings;

    //driverAddress => parkingOwnerAddress
    mapping(address => address) BookedParkings;

    mapping(address => uint256) private _balances;

    mapping(address => ParkingSpot) AvailableParkingOffers;
    
    function registerParking(uint256 _price, string memory _availabilityDate) external {
        require(!Parkings[msg.sender].isRegistered, "ParkingSpot already registered");
        addParkingSpot(msg.sender, _price, _availabilityDate);
    }

    function addParkingSpot(address _parkingSpotAddress, uint256 _price, string memory _availabilityDate) internal {
        Parkings[_parkingSpotAddress] = ParkingSpot({price: _price, availabilityDate: _availabilityDate, isRegistered: true, isAvailable: true});
    }

    function bookParkingSpot(address _parkingSpotAddress) payable public {
        require(Parkings[_parkingSpotAddress].isRegistered, "Unknow parking spot");
        require(Parkings[_parkingSpotAddress].isAvailable, "Not available");
        require(msg.value >= Parkings[_parkingSpotAddress].price, "Insufficient funds");
        _balances[msg.sender] += msg.value;
        addBookedParkingSpot(msg.sender, _parkingSpotAddress);
        emit LogParkingBookedPayment(msg.sender);
        updateParkingSpotAvailability(_parkingSpotAddress, false);
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

}
