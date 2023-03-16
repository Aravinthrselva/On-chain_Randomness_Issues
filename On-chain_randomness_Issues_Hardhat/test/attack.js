const {ethers} = require('hardhat');
const {expect} = require ('chai');
const {utils, BigNumber} = require('ethers');

describe("Attack", function() {
  it("should be able to guess the random number" , async function() {

    const Game = await ethers.getContractFactory('Game');
    const gameContract = await Game.deploy({value: utils.parseEther('0.10') });
    await gameContract.deployed();

    console.log("Game Contract Address: ", gameContract.address);

    // Deploy the attack contract

    const Attack = await ethers.getContractFactory('Attack');
    const attackContract= await Attack.deploy(gameContract.address);
    await attackContract.deployed();

    console.log("Attack Contract Address:", attackContract.address);

    // start attack

    let tx = await attackContract.attack();
    await tx.wait();

    const balanceETH = await gameContract.getBalance();

    // Balance of the Game contract should be 0   
    expect(balanceETH).to.equal(BigNumber.from('0'));

  });
});


/* 
How the attack takes place is as follows:

1. The attacker calls the attack function from the Attack.sol

2. attack further guesses the number using the same method as Game.sol 
which is uint(keccak256(abi.encodePacked(blockhash(block.number), block.timestamp)))


3. Attacker is able to guess the same number because blockhash and block.timestamp is public information and everybody has access to it

4. The attacker then calls the guess function from Game.sol
guess first calls the pickACard function which generates the same number using uint(keccak256(abi.encodePacked(blockhash(block.number), block.timestamp))) 
because pickACard and attack were both called in the same block.

5.guess compares the numbers and they turn out to be the same.

6. guess then sends the Attack.sol 0.1 ether and the game ends


Attacker is successfully able to find the random number

Don't use blockhash, block.timestamp, or really any sort of on-chain data as sources of randomness

You can use Chainlink VRF's for true source of randomness

*/