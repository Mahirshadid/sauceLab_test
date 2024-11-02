const { expect, browser } = require('@wdio/globals');
const Login = require('../pageobjects/logInPage/logInAction');
const messages = require('../pageobjects/Features/Messages/messages');
const checkOutActions = require('../pageobjects/checkOut/checkOutActions');
const addToCart = require('../pageobjects/Features/Cart/AddToCart');
const credentials = require('../pageobjects/credentials/credentials');

let emptyCheck = {
    f_n: '',
    l_n: 'shadid',
    p_c: '123'
}

let flipTheType = {
    f_n: '124324',
    l_n: '132332',
    p_c: 'oneTwoFiveSix'
}

let whiteSpace = {
    f_n: 'm',
    l_n: 's',
    p_c: '1         2         3'
}

describe('Negative Testing: Boundary values and edge case handling on checkout info page', ()=>{
    it('Should navigate to checkout page after login and selecting an item', async()=>{
        await Login.InsertLoginInfo(
            credentials.std_user.username,
            credentials.std_user.password
        );
        await Login.ClickLoginButton();

        await addToCart.clickOnAddToCart('sauce-labs-backpack');

        await addToCart.clickOnCartIcon();

        await browser.waitUntil(async () => {
            const cartItems = await addToCart.cartItems('Sauce Labs Backpack');
            return await cartItems.isDisplayed();
        }, {
            timeout: 5000,
            timeoutMsg: 'Cart items were not visible in 5s'
        });

        // Checkout Button Clicked
        await checkOutActions.clickCheckout();

        await expect(browser).toHaveUrl(expect.stringContaining('checkout-step-one'));
    })
    it('Should handle empty fields', async()=>{
        await checkOutActions.insertCheckoutInfo(
            emptyCheck.f_n,
            emptyCheck.l_n,
            emptyCheck.p_c
        );
        await checkOutActions.clickOnContinue();
        
        const error = await messages.errorOnCheckoutPage;
        const errorTxt = await error.getText();

        await expect(errorTxt).toContain("is required");
    })
    it('Should handle data type flipped fields', async()=>{
        await checkOutActions.insertCheckoutInfo(
            flipTheType.f_n,
            flipTheType.l_n,
            flipTheType.p_c
        );
        await checkOutActions.clickOnContinue();
        
        const error = await messages.errorOnCheckoutPage;
        await expect(error).toBeDisplayed();
    })
    it('Should handle white-space case fields', async()=>{

        await browser.back();
        console.log(await browser.getUrl());

        await checkOutActions.insertCheckoutInfo(
            whiteSpace.f_n,
            whiteSpace.l_n,
            whiteSpace.p_c
        );
        await checkOutActions.clickOnContinue();
        
        const error = await messages.errorOnCheckoutPage;
        await expect(error).toBeDisplayed();
    })
})