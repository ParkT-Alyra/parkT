const { BN, expectEvent, expectRevert} = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const ParkT = artifacts.require("./ParkT.sol");

contract("parkT", accounts => {

    let parkTInstance, parking, registerParking;
    before(async () => {
        parkTInstance = await ParkT.deployed();
        registerParking = await parkTInstance.registerParking(1, 250, "16580", {x: "48.85449", y:"2.31356" }, { from: accounts[0] });
    })
    beforeEach(async () => {
        parking = await parkTInstance.parkingById(1);
    });

    describe("registerParking", () => {
        it("...should have a price and all information", async () => {
            // appel de la méthode d'enregistrement d'un parking
            assert.equal(parking.priceBySecond, 1, "The parking cost 1 token by second");
            assert.equal(parking.deposit, 250, "The deposit is 250");
            assert.equal(parking.owner, accounts[0], "owner account");
            assert.equal(parking.balance, 0, "balance O");
            assert.equal(parking.coordinate.x, "48.85449", "coordinate x");
            expectEvent(registerParking, "ParkingRegistered", {
                parkingId: new BN(1)
            });
            assert.equal(await parkTInstance.getParkingId(), 1, "parkingId equal 1");
        });
        it("...should register one parking at a time", async () => {
            // appel de la méthode d'enregistrement d'un parking
            const emptyParking = await parkTInstance.parkingById(2);
            assert.equal(emptyParking.owner, 0, 'emptyParking');
        });
    });

    describe.only("fetchParkings", () => {
        it("...should fetch and returns registered parkings", async () => {
            await parkTInstance.registerParking(5, 250, "75014", {x: "48.85449", y:"2.31356"}, { from: accounts[1] });
            await parkTInstance.registerParking(10, 255, "06000", {x: "48.85449", y:"2.31356"}, { from: accounts[2] });
            const parkings = await parkTInstance.fetchParkings();
            expect(parkings[0].priceBySecond).to.be.bignumber.equal(new BN(1));
            expect(parkings[0].postalCode).to.be.equal("16580");
            expect(parkings[1].priceBySecond).to.be.bignumber.equal(new BN(5));
            expect(parkings[1].postalCode).to.be.equal("75014");
            expect(parkings[2].priceBySecond).to.be.bignumber.equal(new BN(10));
            expect(parkings[2].postalCode).to.be.equal("06000");
        });
        it("...should fetch and returns available parkings", async () => {
            const parkingsBefore = await parkTInstance.fetchParkings();
            console.log(parkingsBefore);
            console.log('####AFTER###');
            await parkTInstance.bookParking(2, { from: accounts[1], value: 864255 });
            // const bookedParkingId = await parkTInstance.bookedParkingId(2);
            // const bookedParkingId1 = await parkTInstance.bookedParkingId(1);
            const parkings = await parkTInstance.fetchParkings();
            
            console.log(parkings);
            // console.log(bookedParkingId.timestamp);
            // console.log(bookedParkingId1.timestamp);
            
            // const availableParkings = await parkTInstance.fetchAvailableParkings();
            // //assert.equal(await parkTInstance.getAvailableParkingsCounter(), 2, "parkingId equal 2");
            // console.log('Available parkings vvvvvvvvvvvvvv');
            // console.log(availableParkings);
        });
    });

    describe("bookParking", () => {
        it("...should not book a parking if is not register", async () => {
            await expectRevert(
                parkTInstance.bookParking(5, { from: accounts[1], value: 86650 }),
                'Parking not register',
            );
        });
        it("...should not book a parking for insufficient funds", async () => {
            await expectRevert(
                parkTInstance.bookParking(1, { from: accounts[1], value: 200 }),
                'Insufficient funds',
            );
        });
        it("...should book a parking", async () => {
            const bookParking = await parkTInstance.bookParking(1, { from: accounts[1], value: 86650 })
            const bookedParkingId = await parkTInstance.bookedParkingId(1);
            assert.notEqual(bookedParkingId.timestamp, new BN(1), "timestamp updated")
            assert.equal(bookedParkingId.driver, accounts[1], "driver updated")
            assert.equal(bookedParkingId.requiredAmount, 86650, "amount updated")
            expectEvent(bookParking, "ParkingBooked", {
                parkingId: new BN(1)
            });
        });
        it("...should not book an already booked parking", async () => {
            await expectRevert(
                parkTInstance.bookParking(1, { from: accounts[1], value: 86650 }),
                'Not available',
            );
        });
    });

    describe("releaseParking", () => {
        it("...should revert if releaser is not the booker", async () => {
            await expectRevert(
                parkTInstance.releaseParking(0, {from: accounts[2]}),
                'Driver not booker',
            );
        });

        it("...should release a parking", async () => {
            const releaseParking = await parkTInstance.releaseParking(1, {from: accounts[1]});

            const bookedParking = await parkTInstance.bookedParkingId(1);

            assert.equal(bookedParking.timestamp, 0, "timestamp reset");
            assert.equal(bookedParking.driver, 0, "driver reset");
            assert.equal(bookedParking.amount, 0, "amount reset");

            expectEvent(releaseParking, "ParkingReleased", {
                parkingId: new BN(1)
            });
        });

    })

    describe("withdraw", () => {
        it("...should revert if is not the owner of the parking", async () => {
            parking.balance = 500;
            await expectRevert(
                parkTInstance.withdraw(0, {from: accounts[1]}),
                'revert',
            );
        });

        it("...should transfer funds and reset balance", async () => {
            let parkingById = await parkTInstance.parkingById(1);
            parkingById.balance = new BN(500);
            assert.equal(parkingById.balance, 500, "test balance");

            const payedAmount = await parkTInstance.withdraw(1, {from: accounts[0]});

            parkingById = await parkTInstance.parkingById(1);

            expectEvent(payedAmount, "DonePayment", {
                amount : new BN(0)
            });
        });
    })
});
