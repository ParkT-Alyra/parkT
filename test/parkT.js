const ParkT = artifacts.require("./ParkT.sol");


contract("parkT", accounts => {
    it("...should register a parking", async () => {
        const parkTInstance = await ParkT.deployed();

        // appel de la méthode d'enregistrement d'un parking
        await parkTInstance.parkRegister('toto', { from: accounts[0] });

        // récupération du parking enregistré
        const spot = await parkTInstance.spot(accounts[0]);

        assert.equal(spot.postalAddress, 'toto', "The postal address is 'toto'");
    });

    it("...should", async () => {
       // TODO
    });
});
