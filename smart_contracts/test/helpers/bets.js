const Web3 = require('web3');

//
// View functions:
//

// Gets current game
const getCurrentGame = async (instance) => {
    return instance.currentGame();
};

// Gets bet total for current game
const getBetTotal = async (instance, addr) => {
    const total = await instance.getCurrentTotal.call({'from': addr});
    return Web3.utils.fromWei(total);
};

// Gets Bet for an Address
const getBet = async (instance, addr) => {
    const bet = await instance.getCurrentBet.call({'from': addr});
    return Web3.utils.fromWei(bet);
};

// Gets All Bets
const getAllBets = async (instance, addresses) => {
    return await Promise.all(addresses.map((acc) => getBet(instance, acc)));
};

// Displays all bets
const displayAllBets = async (instance, addresses, bets=[]) => {
    if (bets.length == 0)
        bets = await getAllBets(instance, addresses);
    addresses.forEach((addr, i) => {
        console.log(i, addr.substring(0, 5), bets[i]);
    });
};

// Checks whether the prize is claimable
const isClaimable = async (instance, addr) => {
    return await instance.getClaimable({'from': addr}).valueOf();
}

// Checks whether new game is available
const newGameAvailable = async (instance, addr) => {
    return await instance.getNewGame({'from': addr}).valueOf();
}

// Waits for the ability to claim rewards
//      Note: Requires a transaction to update block on test network
//            since the block timestamp cannot be updated if there is no new transactions
const waitForFunc = async (instance, addr, func) => {
    let numTries = 1;
    let state = await func(instance, addr);
    while (!state) {
        // Sleeps for 1 second
        await new Promise(resolve => setTimeout(resolve, 1000)).then(console.log('Try #', numTries));
        // Bets nothing to update block
        // TODO: Make more general
        try {
            await bet(instance, addr, 0);
        }
        catch {}
        // Checks whether rewards are claimable
        state = await func(instance, addr);
        numTries++;

        console.log(state)
    }
}

//
// Transaction Functions:
//

// Bets amount from account
const bet = async (instance, addr, amount) => {
    await instance.bet({'from': addr, 'value': amount * 1E18});
};

// Withdraws amount from account
const withdraw = async (instance, addr, amount) => {
    await instance.withdraw(amount, {'from': addr});
};

// Claim rewards
const claim = async (instance, addr) => {
    await instance.claim({'from': addr});
};

// Starts the next game
const startNextGame = async (instance, addr) => {
    await instance.startNextGame({'from': addr});
};

module.exports = {
    getCurrentGame,
    getBetTotal,
    getBet,
    getAllBets,
    displayAllBets,
    isClaimable,
    newGameAvailable,
    waitForFunc,

    bet,
    withdraw,
    claim,
    startNextGame
}