require('chai').use(require('chai-as-promised')).should();
require('truffle-test-utils').init();
const Reverter = require('./helpers/reverter');
const Asserts = require('./helpers/asserts');
const App = artifacts.require('App');
const ICO = artifacts.require('ICO');
const Token = artifacts.require('DAPPToken');


contract('App', function(accounts) {
    const reverter = new Reverter(web3);
    afterEach('revert', reverter.revert);

    let app;
    let ico;
    let token;
    let owner = Token.address;
    const ERROR_MSG = 'VM Exception while processing transaction: revert';

    before('setup', () => {
        ICO.deployed()
            .then(instance => ico = instance);
        Token.deployed()
            .then(instance => token = instance);
        return App.deployed()
            .then(instance => app = instance)
            .then(reverter.snapshot);
    });

    it('set price', async function() {
        let decimals = (await token.decimals()).toNumber();
        let price = (await app.price()).toNumber();
        let new_price = 20 * Math.pow(10, decimals);
        assert.equal(price, 10 * Math.pow(10, decimals));
        await app.setPrice(new_price);
        price = (await app.price()).toNumber();
        assert.equal(price, new_price);
    });

    it('set message', async function() {
        let new_message = "new string";
        let new_message2 = "new string";
        let account0 = web3.eth.accounts[0];

        let message = await app.message();
        assert.equal(message, "");

        // не хватает баланса для установки сообщения
        await ico.buy({from: account0, value: web3.toWei(1, "finney")}); // покупаем 1 токен
        let res = await app.setMessage("new string", {from: account0});
        // message = await app.message();
        assert.equal(message, "");

        // баланса достаточно для покупки установки сообщения
        await ico.buy({from: account0, value: web3.toWei(9, "finney")}); // покупаем 1 токен
        res = await app.setMessage(new_message, {from: account0});
        assert.web3Event(res, {
            event: 'Message',
            args: {
                _address: account0,
                _message: new_message // No need for toNumber hassle
            }
        }, 'The event is emitted');
        message = await app.message();
        assert.equal(message, new_message);

        // проверяем балансы
        let decimals = (await token.decimals()).toNumber();
        // аккаунт
        let account_balance = (await token.balanceOf(account0)).toNumber();
        assert.equal(account_balance, 0, 'account balance should be 0 token');
        // App
        let expected_balance = 10 * Math.pow(10, decimals);
        account_balance = (await token.balanceOf(App.address)).toNumber();
        assert.equal(account_balance, expected_balance);

        // устанавливаем сообщение со 2 аккаунта
        let account1 = web3.eth.accounts[1];
        await ico.buy({from: account1, value: web3.toWei(11, "finney")}); // покупаем 11 токенов
        res = await app.setMessage(new_message2, {from: account1});
        assert.web3Event(res, {
            event: 'Message',
            args: {
                _address: account1,
                _message: new_message2 // No need for toNumber hassle
            }
        }, 'The event is emitted');
        message = await app.message();
        assert.equal(message, new_message2);

        // проверяем балансы
        // аккаунт
        account_balance = (await token.balanceOf(account1)).toNumber();
        assert.equal(account_balance, 1 * Math.pow(10, decimals) , 'account balance should be 0 token');
        // App
        expected_balance = 20 * Math.pow(10, decimals);
        account_balance = (await token.balanceOf(App.address)).toNumber();
        assert.equal(account_balance, expected_balance);
    });
});