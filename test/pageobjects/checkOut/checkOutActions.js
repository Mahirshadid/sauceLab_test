const checkOutLocators = require('./checkOutLocators');

class checkOutActions {
    async clickCheckout(){
        await checkOutLocators.checkOutButtonFromCart.click();
    }
    async insertCheckoutInfo(firstName,lastName,postalCode){
        await browser.waitUntil(async()=>{
            return (await checkOutLocators.checkOutInfo.firstName.isDisplayed());
        },{
            timeout: 5000,
            timeoutMsg: 'checkOut Info fields were not visible in 5s'
        });
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