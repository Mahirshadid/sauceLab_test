const { expect } = require('@wdio/globals');
const Login = require('../pageobjects/logInPage/logInAction');
const messages = require('../pageobjects/Features/Messages/messages');
const addToCart = require('../pageobjects/Features/Cart/AddToCart');
const checkOutActions = require('../pageobjects/checkOut/checkOutActions');
const credentials = require('../pageobjects/credentials/credentials');


describe('Negative Testing: Handling empty cart checkout', ()=>{
    it('Should login to user profile', async()=>{
        await Login.InsertLoginInfo(
            credentials.std_user.username,
            credentials.std_user.password
        );
        await Login.ClickLoginButton();

        // Verifying that the login is successful and redirected to inventory page
        await expect(browser).toHaveUrl(expect.stringContaining('inventory'));
    })
    it('Should insert checkout info after cart page without selecting any item', async()=>{
        await addToCart.clickOnCartIcon();

        await checkOutActions.clickCheckout();

        // Inserting Shipping Credentials
        await checkOutActions.insertCheckoutInfo(
            credentials.checkout.firstname,
            credentials.checkout.lastname,
            credentials.checkout.postcode
        );

        // Clicking Continue to final page
        await checkOutActions.clickOnContinue();

        await expect(browser).toHaveUrl(expect.stringContaining('checkout-step-two'));
    })
    it('Should show error when checking out empty cart', async()=>{
        await checkOutActions.clickOnFinish();

        const thankYouMsg = await messages.thankYouMsgAfterOrder;
        const thankYouMsgText = await thankYouMsg.getText();
        // verifying success message
        await expect(thankYouMsgText).not.toEqual('Thank you for your order!');
    })
})