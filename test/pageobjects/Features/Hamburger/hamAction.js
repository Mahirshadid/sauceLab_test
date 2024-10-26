const hamLocators = require('./hamLocators');

class hamActions {
    async clickOnHam(){
        await hamLocators.hamburgerButton.click();
    }
    async clickOnHamClose(){
        await hamLocators.hamburgerCloseButton.click();
    }
}

module.exports = new hamActions();