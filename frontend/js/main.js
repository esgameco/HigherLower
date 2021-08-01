//
// Constructor
//

window.addEventListener('load', async () => {
    // Injects Web3 into website
    window.ethereum.request({method: 'eth_requestAccounts'});
    window.web3 = new Web3(window.ethereum);
    window.contract = await getContract();
    const accounts = await web3.eth.getAccounts();
    window.address = accounts[0];

    // Initializes info
    updateInfo();

    // Buttons
    const newGameButton = document.getElementById('hl-btn-new-game');
    const betButton = document.getElementById('hl-btn-bet');
    const claimButton = document.getElementById('hl-btn-claim');
    const updateInfoButton = document.getElementById('hl-btn-update-info');

    // Listeners
    newGameButton.addEventListener('click', newGame);
    betButton.addEventListener('click', bet);
    claimButton.addEventListener('click', claim);
    updateInfoButton.addEventListener('click', updateInfo);
});

//
// View functions:
//

// Updates info in card
const updateInfo = async () => {
    const currentGameInfo = document.getElementById('hl-info-game');
    const betTotalInfo = document.getElementById('hl-info-bet-total');
    const betInfo = document.getElementById('hl-info-bet');
    const claimableInfo = document.getElementById('hl-info-claimable');
    const newGameInfo = document.getElementById('hl-info-start-new');

    currentGameInfo.innerHTML = await getCurrentGame();
    betTotalInfo.innerHTML = String(await getBetTotal()) + ' eth';
    betInfo.innerHTML = String(await getBet()) + ' eth';
    claimableInfo.innerHTML = await isClaimable();
    newGameInfo.innerHTML = await newGameAvailable();
};

// Gets current game
const getCurrentGame = async () => {
    return await window.contract.methods.currentGame().call({'from': window.address});
};

// Gets bet total for current game
const getBetTotal = async () => {
    const total = await window.contract.methods.getCurrentTotal().call({'from': window.address});
    return window.web3.utils.fromWei(total);
};

// Gets Bet for an Address
const getBet = async () => {
    const bet = await window.contract.methods.getCurrentBet().call({'from': window.address});
    return window.web3.utils.fromWei(bet);
};

// Checks whether the prize is claimable
const isClaimable = async () => {
    return await window.contract.methods.getClaimable().call({'from': window.address});
};

// Checks whether new game is available
const newGameAvailable = async () => {
    return await window.contract.methods.getNewGame().call({'from': window.address});
};

//
// Transaction Functions:
//

// Bets amount from account
const bet = async () => {
    // get label element value and pass to bet to change the value of the bet
    return await window.contract.methods.bet().send({'from': window.address, 'value': 10000000000000});
};

// Withdraws amount from account
const withdraw = async () => {
    await window.contract.methods.withdraw(amount).send({'from': window.address});
};

// Claim rewards
const claim = async () => {
    await window.contract.methods.claim().send({'from': window.address});
};

// Starts the next game
const newGame = async () => {
    return await window.contract.methods.startNextGame().send({'from': window.address});
};

//
// Contract
//

const getContract = async () => {
    return await new window.web3.eth.Contract([
          {
            "inputs": [],
            "stateMutability": "nonpayable",
            "type": "constructor"
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "time",
                "type": "uint256"
              }
            ],
            "name": "TooEarly",
            "type": "error"
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "time",
                "type": "uint256"
              }
            ],
            "name": "TooLate",
            "type": "error"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": false,
                "internalType": "address",
                "name": "player",
                "type": "address"
              },
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
              }
            ],
            "name": "Bet",
            "type": "event"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": false,
                "internalType": "address",
                "name": "winner",
                "type": "address"
              }
            ],
            "name": "NewCurrentWinner",
            "type": "event"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "number",
                "type": "uint256"
              }
            ],
            "name": "NewGame",
            "type": "event"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": true,
                "internalType": "address",
                "name": "previousOwner",
                "type": "address"
              },
              {
                "indexed": true,
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
              }
            ],
            "name": "OwnershipTransferred",
            "type": "event"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": false,
                "internalType": "address",
                "name": "winner",
                "type": "address"
              }
            ],
            "name": "PrizesClaimed",
            "type": "event"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": false,
                "internalType": "address",
                "name": "player",
                "type": "address"
              },
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
              }
            ],
            "name": "Withdraw",
            "type": "event"
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
              }
            ],
            "name": "adminWithdraw",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ],
            "name": "betTotals",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ],
            "stateMutability": "view",
            "type": "function",
            "constant": true
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              },
              {
                "internalType": "address",
                "name": "",
                "type": "address"
              }
            ],
            "name": "bets",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ],
            "stateMutability": "view",
            "type": "function",
            "constant": true
          },
          {
            "inputs": [],
            "name": "currentGame",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ],
            "stateMutability": "view",
            "type": "function",
            "constant": true
          },
          {
            "inputs": [],
            "name": "currentWinner",
            "outputs": [
              {
                "internalType": "address",
                "name": "",
                "type": "address"
              }
            ],
            "stateMutability": "view",
            "type": "function",
            "constant": true
          },
          {
            "inputs": [],
            "name": "endBets",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ],
            "stateMutability": "view",
            "type": "function",
            "constant": true
          },
          {
            "inputs": [],
            "name": "owner",
            "outputs": [
              {
                "internalType": "address",
                "name": "",
                "type": "address"
              }
            ],
            "stateMutability": "view",
            "type": "function",
            "constant": true
          },
          {
            "inputs": [],
            "name": "renounceOwnership",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [],
            "name": "startNext",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ],
            "stateMutability": "view",
            "type": "function",
            "constant": true
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
              }
            ],
            "name": "transferOwnership",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [],
            "name": "startNextGame",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [],
            "name": "bet",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function",
            "payable": true
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
              }
            ],
            "name": "withdraw",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [],
            "name": "claim",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [],
            "name": "getCurrentBet",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ],
            "stateMutability": "view",
            "type": "function",
            "constant": true
          },
          {
            "inputs": [],
            "name": "getCurrentTotal",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ],
            "stateMutability": "view",
            "type": "function",
            "constant": true
          },
          {
            "inputs": [],
            "name": "getTimeLeft",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ],
            "stateMutability": "view",
            "type": "function",
            "constant": true
          },
          {
            "inputs": [],
            "name": "getClaimable",
            "outputs": [
              {
                "internalType": "bool",
                "name": "",
                "type": "bool"
              }
            ],
            "stateMutability": "view",
            "type": "function",
            "constant": true
          },
          {
            "inputs": [],
            "name": "getNewGame",
            "outputs": [
              {
                "internalType": "bool",
                "name": "",
                "type": "bool"
              }
            ],
            "stateMutability": "view",
            "type": "function",
            "constant": true
          }
        ], '0xF31b5f86E0885fD01D3012fd31c8D32b4A01E795');
};