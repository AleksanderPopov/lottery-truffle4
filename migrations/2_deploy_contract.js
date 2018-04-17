var Lottery = artifacts.require("./Lottery.sol");

module.exports = function (deployer) {
    deployer.deploy(Lottery, web3.toWei(5, 'ether'), web3.toWei(2, 'ether'));
};
