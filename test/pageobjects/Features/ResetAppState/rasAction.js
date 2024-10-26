const rasLocators = require('./rasLocators');

class rasActions {
    async clickOnRAS(){
        await rasLocators.rasLink.click();
    }
}

module.exports = new rasActions();