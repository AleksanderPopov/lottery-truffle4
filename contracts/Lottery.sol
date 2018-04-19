pragma solidity ^0.4.18;

contract Lottery {
    uint256 public HARD_CAP;
    uint256 public FIXED_PRICE;
    address[] users;
    address public self = address(this);

    event Play(address player, uint sum, uint currentBalance);
    event Prize(address winner);

    function Lottery(uint256 initialCap, uint256 initialInvestableSum) public {
        require(initialCap != 0);
        require(initialInvestableSum != 0);
        require(initialCap >= initialInvestableSum);
        HARD_CAP = initialCap;
        FIXED_PRICE = initialInvestableSum;
    }

    function play() public payable {
        require(msg.value == FIXED_PRICE);
        Play(msg.sender, msg.value, self.balance);
        users.push(msg.sender);
        if (self.balance >= HARD_CAP) {
            // not fair
            uint winnerIndex = block.timestamp % users.length;
            address winner = users[winnerIndex];
            winner.transfer(self.balance);

            Prize(winner);
            users.length = 0;
        }
    }

}
