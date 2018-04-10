require('chai').use(require('chai-as-promised')).should();
require('truffle-test-utils').init();
const Reverter = require('./helpers/reverter');
const Asserts = require('./helpers/asserts');
const App = artifacts.require('App');
const Token = artifacts.require('DAPPToken');


contract('DAPPToken', function(accounts) {
    const reverter = new Reverter(web3);
    afterEach('revert', reverter.revert);

    let app;
    let token;
    const ERROR_MSG = 'VM Exception while processing transaction: revert';

    before('setup', () => {
        Token.deployed()
            .then(instance => token = instance);
        return App.deployed()
            .then(instance => app = instance)
            .then(reverter.snapshot);
    });

    it('set app contract', async function() {
        let owner = accounts[0];
        let not_owner = web3.eth.accounts[1];
        // запрещено не владельцу
        await token.setAppContract(app.address, {from: not_owner}).should.be.rejectedWith(ERROR_MSG);

        // разрешено владельцу
        let app_address = await token.appContract();
        let new_app_address = App.address;
        let res = await token.setAppContract(new_app_address, {from: owner});
        assert.web3Event(res, {
            event: 'ChangeAppContract',
            args: {
                _from: app_address,
                _to: new_app_address
            }
        }, 'The event is emitted');
    });
});