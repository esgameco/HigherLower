const Web3 = require('web3');

const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");

const getContractBalance = async (instance) => {
    return await web3.eth.getBalance(instance.address);
}

// Withdraws an amount of funds from contract
const adminWithdraw = async (instance, addr, amount) => {
    await instance.adminWithdraw(amount, {'from': addr});
};

// Withdraws all funds from a contract
const adminWithdrawAll = async (instance, addr) => {
    await adminWithdraw(instance, addr, await getContractBalance(instance));
};

module.exports = {
    getContractBalance,
    adminWithdraw,
    adminWithdrawAll,
}