const checkOutLocators = require('./checkOutLocators');

class checkOutActions {
    async clickCheckout(){
        await checkOutLocators.checkOutButtonFromCart.click();
    }
    async insertCheckoutInfo(firstName,lastName,postalCode){
        await checkOutLocators.checkOutInfo.firstName.setValue(firstName);
        await checkOutLocators.checkOutInfo.lastName.setValue(lastName);
        await checkOutLocators.checkOutInfo.postCode.setValue(postalCode);
    }
    async clickOnContinue(){
        await checkOutLocators.continueToPurchaseButton.click();
    }
    async clickOnFinish(){
        await checkOutLocators.finishPurchaseButton.click();
    }
}

module.exports = new checkOutActions();