var App = artifacts.require("App");
var Token = artifacts.require("DAPPToken");

module.exports = function(deployer) {
  deployer.deploy(App, Token.address);
};
