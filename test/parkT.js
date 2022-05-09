const ParkT = artifacts.require("./ParkT.sol");


contract("parkT", accounts => {
    it("...should register a parking", async () => {
        const parkTInstance = await ParkT.deployed();

        // appel de la méthode d'enregistrement d'un parking
        await parkTInstance.registerParking(20, 20220505, { from: accounts[0] });

        // récupération du parking enregistré
        const spot = await parkTInstance.Parkings(accounts[0]);

        assert.equal(spot.price, 20, "The parking cost 20");
    });

    it("...should", async () => {
       // TODO
    });
});
