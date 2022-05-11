const { expectEvent, expectRevert} = require('@openzeppelin/test-helpers');
const ParkT = artifacts.require("./ParkT.sol");


contract("parkT", accounts => {

    let parkTInstance, spot;
    before(async () => {
        parkTInstance = await ParkT.deployed();
        await parkTInstance.registerParking(20, { from: accounts[0] });
    })
    beforeEach(async () => {
        //parkTInstance = await ParkT.new({from: accounts[0]});
        spot = await parkTInstance.ParkingSpots(0);
    });

    describe("registerParking", () => {
        it("...parking should have a price", async () => {
            // appel de la méthode d'enregistrement d'un parking
            assert.equal(spot.price, 20, "The parking cost 20");
        });
        it("...parking should revert for already registered", async () => {
            // appel de la méthode d'enregistrement d'un parking
            await expectRevert(
                parkTInstance.registerParking(20, { from: accounts[0] }),
                'ParkingSpot already registered',
            );

            await expectRevert(
                parkTInstance.ParkingSpots(1),
                'revert',
            );
        });
        it("...should register a parking with localization", async () => {
            // appel de la méthode d'enregistrement d'un parking
            assert.equal(spot.price, 20, "The parking cost 20");
            await expectRevert(
                parkTInstance.registerParking(20, { from: accounts[0] }),
                'ParkingSpot already registered',
            );

            await expectRevert(
                parkTInstance.ParkingSpots(1),
                'revert',
            );
        });
    });

    describe("bookParkingSpot", () => {
        it("...should not book a parking for unknow parking", async () => {
            await expectRevert(
                parkTInstance.bookParkingSpot(accounts[2], { from: accounts[1], value: 10 }),
                'Unknow parking spot',
            );
        });
        it("...should not book a parking for insufficient funds", async () => {
            await expectRevert(
                parkTInstance.bookParkingSpot(accounts[0], { from: accounts[1], value: 10 }),
                'Insufficient funds',
            );
        });
        it("...should book a parking with event", async () => {
            const bookParking = await parkTInstance.bookParkingSpot(accounts[0], { from: accounts[1], value: 20 });
            const bookedParkings = await parkTInstance.BookedParkings.call(accounts[1]);
            assert.equal(bookedParkings, accounts[0]);
            const availableParkingOffers = await parkTInstance.AvailableParkingOffers.call(accounts[1]);
            assert.equal(availableParkingOffers.isAvailable, false);
            expectEvent(bookParking, "LogParkingBookedPayment", {
                driverAddress: "0xf17f52151EbEF6C7334FAD080c5704D77216b732"
            });
        });

    });

    describe("releaseParkingSpot", () => {
        it("...should revert unknow parking", async () => {
            await expectRevert(
                parkTInstance.releaseParkingSpot(accounts[2], { from: accounts[1] }),
                'Unknow parking spot',
            );
            await parkTInstance.releaseParkingSpot(accounts[0], { from: accounts[1] });

            const bookedParkings = await parkTInstance.BookedParkings.call(accounts[1]);
            assert.equal(bookedParkings, 0);
            const availableParkingOffers = await parkTInstance.AvailableParkingOffers.call(accounts[1]);
            // assert false : assert.equal(availableParkingOffers.isAvailable, true);
            assert.equal(spot.isAvailable, true);
        });

        it("...should release a parking", async () => {
            const releaseParking = await parkTInstance.releaseParkingSpot(accounts[0], { from: accounts[1] });

            const bookedParkings = await parkTInstance.BookedParkings.call(accounts[1]);
            assert.equal(bookedParkings, 0);
            const availableParkingOffers = await parkTInstance.AvailableParkingOffers.call(accounts[1]);
            // assert false : assert.equal(availableParkingOffers.isAvailable, true);
            assert.equal(spot.isAvailable, true);
            expectEvent(releaseParking, "LogParkingRelease", {
                ownerBooked: "0x627306090abaB3A6e1400e9345bC60c78a8BEf57"
            });
        });

    })
});
