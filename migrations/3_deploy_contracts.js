var ICO = artifacts.require("ICO");
var Token = artifacts.require("DAPPToken");

module.exports = function(deployer) {
  deployer.deploy(ICO, Token.address);
};
