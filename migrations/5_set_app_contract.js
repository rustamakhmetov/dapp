var Token = artifacts.require("DAPPToken");
var App = artifacts.require("App");

module.exports = function(deployer) {
    async function setAppContract() {
        let token = await Token.deployed();
        await token.setAppContract(App.address);
        return true;
    }

    setAppContract().then(v => {
        console.log("Set app contract: ", v);  // prints 60 after 2 seconds.
    });
};
