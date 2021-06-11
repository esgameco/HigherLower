const Web3 = require('web3');

// const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");

// const addr = '0x3BD033EA554D0F0e314013DC4c9A9D12b0eE37c2';
// const pk = '74694a04a9124fa5ab93c1c237ef1971e6f5c48b1ccc19159182a0bca92282a1';

// const fs = require('fs');
// const path = require('path');

// const interface = fs.readFileSync('C:/Users/chanc/Documents/Projects/DAPP/HigherLower/bin/smart_contracts/contracts/HigherLower.abi');
// const abi = JSON.parse(interface);
// let contract = new web3.eth.Contract(abi, '0x705230eb5c6f2cC2762BA7E6795d5dE7D278D2f1');

// console.log(contract.methods)

// contract.methods.startNextGame().send({'from': addr, 'gas': 2500000});
// contract.methods.bet().send({'from': addr, 'gas': 2500000, 'value': 10000000000});

// contract.methods.currentGame().call({'from': addr}, (data) => console.log(data));

const HigherLower = artifacts.require('HigherLower');

const betHelper = require('./helpers/bets.js')
const adminHelper = require('./helpers/admin.js');

// Contract tests:
contract('HigherLower', async accounts => {
    it('should start with game one', async () => {
        const game = await HigherLower.deployed();

        const currentGame = await betHelper.getCurrentGame(game, accounts[0]);
        assert.equal(currentGame.valueOf(), 1, 'Current Game isn\'t correct.')
    });

    it('should allow bets', async () => {
        const game = await HigherLower.deployed();

        // Account 1 Bets 1 Eth
        await betHelper.bet(game, accounts[0], 1);

        const currentBet = await betHelper.getBet(game, accounts[0]);
        assert.equal(currentBet, 1, 'Bet not working');
    });

    it('should allow withdrawing', async () => {
        const game = await HigherLower.deployed();

        // Account 1 Bets 0.5 Eth
        await betHelper.bet(game, accounts[0], 0.5);
        // Account 2 Bets 2 Eth
        await betHelper.bet(game, accounts[1], 2);
        /*
            1 => 1.5 Eth
            2 => 2 Eth (Winner)
        */
        
        // Account 1 Withdraws 1 Eth
        await betHelper.withdraw(game, accounts[0], '1000000000000000000');
        /*
            1 => 0.5 Eth
            2 => 2 Eth (Winner)
        */

        const balAcc = await betHelper.getBet(game, accounts[0]);
        assert.equal(balAcc, 0.5, 'Withdraw not working');
    });

    it('should allow claiming', async () => {
        const game = await HigherLower.deployed();

        // Account 2 Claims Rewards
        await betHelper.waitForFunc(game, accounts[1], betHelper.isClaimable);
        await betHelper.claim(game, accounts[1]);

        const betTotal = await betHelper.getBetTotal(game, accounts[1]);

        assert.equal(betTotal, 0, 'Couldn\'t claim rewards');
    });

    it('should allow new games', async () => {
        const game = await HigherLower.deployed();

        // Starts new game
        while (await betHelper.getCurrentGame(game, accounts[0]) != 2) {
            try {
                await betHelper.startNextGame(game, accounts[0]);
            }
            catch {}
        }

        const currentGame = await betHelper.getCurrentGame(game, accounts[0]);
        assert.equal(currentGame, 2, 'Couln\'t start the next game');
    });

    it('should allow admin withdraws', async () => {
        const game = await HigherLower.deployed();

        await betHelper.bet(game, accounts[0], 0.5);
        await adminHelper.adminWithdrawAll(game, accounts[0]);

        const finalBalance = await adminHelper.getContractBalance(game);
        assert.equal(finalBalance, 0, 'Couldn\'t withdraw all funds');
    });
});