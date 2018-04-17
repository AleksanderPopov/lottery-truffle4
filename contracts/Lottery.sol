pragma solidity ^0.4.18;

contract Lottery {
    uint256 public HARD_CAP;
    uint256 public FIXED_PRICE;
    mapping(uint => address) private users;
    uint private counter = 0;

    event Play(address player, uint sum, uint currentBalance);
    event Prize(uint winnerIndex, address winner, uint sum);

    function Lottery(uint256 initialCap, uint256 initialInvestableSum) public {
        HARD_CAP = initialCap;
        FIXED_PRICE = initialInvestableSum;
    }

    function play() public payable {
        require(msg.value == FIXED_PRICE);
        Play(msg.sender, msg.value, this.balance);
        users[counter] = msg.sender;
        counter++;
        if (this.balance >= HARD_CAP) {
            sendPrize();
        }
    }

    function sendPrize() private {
        uint winnerIndex = block.timestamp % counter;
        address winner = users[winnerIndex];
        Prize(winnerIndex, winner, this.balance);
        winner.transfer(this.balance);
        
        reset();
    }

    function reset() private {
        counter = 0;
    }

}
