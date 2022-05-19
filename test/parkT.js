const { BN, expectEvent, expectRevert} = require('@openzeppelin/test-helpers');
const ParkT = artifacts.require("./ParkT.sol");

contract("parkT", accounts => {

    let parkTInstance, spot, registerParking;
    before(async () => {
        parkTInstance = await ParkT.deployed();
        registerParking = await parkTInstance.registerParking(1, 250, 16580, {x: 200, y: 500}, { from: accounts[0] });
    })
    beforeEach(async () => {
        spot = await parkTInstance.parkingById(0);
    });

    describe("registerParking", () => {
        it("...should have a price and all information", async () => {
            // appel de la méthode d'enregistrement d'un parking
            assert.equal(spot.priceBySecond, 1, "The parking cost 1 token by second");
            assert.equal(spot.deposit, 250, "The deposit is 250");
            assert.equal(spot.owner, accounts[0], "owner account");
            assert.equal(spot.balance, 0, "balance O");
            expectEvent(registerParking, "ParkingRegistered", {
                parkingId: new BN(0)
            });
            assert.equal(await parkTInstance.getParkingId(), 1, "parkingId equal 1");
        });
        it("...should revert for unknown parking", async () => {
            // appel de la méthode d'enregistrement d'un parking
            const emptySpot = await parkTInstance.parkingById(1);
            assert.equal(emptySpot.owner, 0, 'emptyParking');
        });
    });

    describe("bookParking", () => {
        it("...should not book a parking if is not register", async () => {
            await expectRevert(
                parkTInstance.bookParking(1, { from: accounts[1], value: 86650 }),
                'Parking not register',
            );
        });
        it("...should not book a parking for insufficient funds", async () => {
            await expectRevert(
                parkTInstance.bookParking(0, { from: accounts[1], value: 200 }),
                'Insufficient funds',
            );
        });
        it("...should book an empty parking", async () => {
            const bookParking = await parkTInstance.bookParking(0, { from: accounts[1], value: 86650 })
            const bookingByParkingId = await parkTInstance.bookingByParkingId(0);
            assert.notEqual(bookingByParkingId.timestamp, new BN(0), "timestamp updated")
            assert.equal(bookingByParkingId.driver, accounts[1], "driver updated")
            assert.equal(bookingByParkingId.requiredAmount, 86650, "amount updated")
            expectEvent(bookParking, "ParkingBooked", {
                parkingId: new BN(0)
            });
        });
        it("...should not book a parking if not empty", async () => {
            await expectRevert(
                parkTInstance.bookParking(0, { from: accounts[1], value: 86650 }),
                'Not available',
            );
        });
    });

    describe("releaseParking", () => {
        it("...should revert unknow parking", async () => {
            await expectRevert(
                parkTInstance.releaseParking(0, {from: accounts[2]}),
                'Driver not booker',
            );
        });

        it("...should release a parking", async () => {
            const releaseParking = await parkTInstance.releaseParking(0, {from: accounts[1]});

            const bookedParking = await parkTInstance.bookingByParkingId(0);

            assert.equal(bookedParking.timestamp, 0, "timestamp reset");
            assert.equal(bookedParking.driver, 0, "driver reset");
            assert.equal(bookedParking.requiredAmount, 0, "amount reset");

            expectEvent(releaseParking, "ParkingReleased", {
                parkingId: new BN(0)
            });
        });

    })

    describe("withdraw", () => {
        it("...should revert if is not the owner of the parking", async () => {
            spot.balance = 500;
            await expectRevert(
                parkTInstance.withdraw(0, {from: accounts[1]}),
                'revert',
            );
        });

        it("...should transfer funds and reset balance", async () => {
            let parkingById = await parkTInstance.parkingById(0);
            parkingById.balance = new BN(500);
            assert.equal(parkingById.balance, 500, "test balance");

            parkingById = await parkTInstance.parkingById(0);
            const payedAmount = await parkTInstance.withdraw(0, {from: accounts[0]})

            expectEvent(payedAmount, "DonePayment");

            assert.equal(parkingById.balance, 0, "reset balance");
        });
    })
});
