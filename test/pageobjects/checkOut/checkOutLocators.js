class checkOutLocators {
    get checkOutButtonFromCart(){
        return $('//button[@data-test="checkout"]');
    }
    get checkOutInfo(){
        return {
            firstName: $('//input[@data-test="firstName"]'),
            lastName: $('//input[@data-test="lastName"]'),
            postCode: $('//input[@data-test="postalCode"]')
        };
    }
    get checkoutItems(){
        return $(`(//div[@data-test="inventory-item-name"])`);
    }
    get continueToPurchaseButton(){
        return $('//input[@data-test="continue"]');
    }
    get totalPriceWithTax(){
        return $('//div[@data-test="total-label"]');
    }
    get finishPurchaseButton(){
        return $('//button[@data-test="finish"]');
    }
}

module.exports = new checkOutLocators();