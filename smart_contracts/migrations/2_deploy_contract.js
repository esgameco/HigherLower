const HigherLower = artifacts.require("HigherLower");

module.exports = function (deployer) {
    deployer.deploy(HigherLower);
};
