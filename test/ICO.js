require('chai').use(require('chai-as-promised')).should();
const Reverter = require('./helpers/reverter');
const Asserts = require('./helpers/asserts');
const ICO = artifacts.require('ICO');
const Token = artifacts.require('DAPPToken');


contract('ICO', function(accounts) {
    const reverter = new Reverter(web3);
    afterEach('revert', reverter.revert);

    let ico;
    let token;
    let owner = Token.address;
    const ERROR_MSG = 'VM Exception while processing transaction: revert';

    before('setup', () => {
        Token.deployed()
            .then(instance => token = instance);
        return ICO.deployed()
            .then(instance => ico = instance)
            .then(reverter.snapshot);
    });

    it('owner balance', async function() {
        let decimals = (await token.decimals()).toNumber();
        let owner_balance = (await token.balanceOf(owner)).toNumber();
        assert.equal(owner_balance, 1000000 * Math.pow(10, decimals));
    });

    it('buy tokens', async function() {
        let account = web3.eth.accounts[0];
        let decimals = (await token.decimals()).toNumber();
        let expected_balance = Math.pow(10, decimals);
        let total_supply = (await token.balanceOf(Token.address)).toNumber();
        assert.equal(total_supply, 1000000 * Math.pow(10, decimals));
        for(let i=0; i<2; i++) {
            account = web3.eth.accounts[i];

            let account_balance = (await token.balanceOf(account)).toNumber();
            assert.equal(account_balance, 0, 'account balance should be 0');

            let result = await ico.buy({from: account, value: web3.toWei(1, "finney")});
            account_balance = (await token.balanceOf(account)).toNumber();
            assert.equal(account_balance, expected_balance, 'account balance should be 1 token (with considering decimals)');
        }

        let result = await ico.sendTransaction({ from: account, gas: 3000000, value: web3.toWei(0.001, "ether")});
        result = web3.eth.sendTransaction({
            to: ICO.address,
            from: account,
            value: web3.toWei(1, "finney")});

        total_supply = (await token.balanceOf(Token.address)).toNumber();
        assert.equal(total_supply, (1000000 - 4) * Math.pow(10, decimals));
    });

});