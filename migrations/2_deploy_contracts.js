var Token = artifacts.require("DAPPToken");

module.exports = function(deployer) {
  deployer.deploy(Token);
};
