const Lottery = artifacts.require("./Lottery.sol");

contract('Lottery', function (accounts) {

    const player0 = accounts[0];
    const player1 = accounts[1];
    const player2 = accounts[2];

    function randomPlayer() {
        return accounts[getRandomInt(0, 3)];
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const defaultPay = web3.toWei(2, 'ether');
    const defaultCap = web3.toWei(5, 'ether');

    let lottery;

    beforeEach(async () => {
        lottery = await Lottery.new(defaultCap, defaultPay);
    });

    it('should be able to play', async () => {
        const player0Balance = web3.eth.getBalance(player0);

        const trx = await lottery.play({from: player0, value: defaultPay});

        assert(player0Balance > web3.eth.getBalance(player0));
        assert.equal(trx.logs[0].args.player, player0);
        assert.equal(trx.logs[0].args.sum, defaultPay);
    });

    it('should pay winner', async () => {
        const player0Balance = web3.eth.getBalance(player0);
        const player1Balance = web3.eth.getBalance(player1);
        const player2Balance = web3.eth.getBalance(player2);

        const iterations = defaultCap / defaultPay;
        let lastTransaction;

        for (let i = 0; i < iterations; i++) {
            const currentPlayer = randomPlayer();
            const currentPlayerBalance = web3.eth.getBalance(currentPlayer);

            lastTransaction = await lottery.play({from: currentPlayer, value: defaultPay});
            assert(currentPlayerBalance > web3.eth.getBalance(currentPlayer));
            assert.equal(lastTransaction.logs[0].args.player, currentPlayer);
            assert.equal(lastTransaction.logs[0].args.sum, defaultPay);
        }

        const winner = lastTransaction.logs[1].args.winner;
        if (winner === player0) {
            assert(player0Balance < web3.eth.getBalance(player0));
        } else if (winner === player1) {
            assert(player1Balance < web3.eth.getBalance(player1));
        } else {
            assert(player2Balance < web3.eth.getBalance(player2));
        }

    });

});