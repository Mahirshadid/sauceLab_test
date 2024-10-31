const { expect } = require('@wdio/globals');
const Login = require('../pageobjects/logInPage/logInAction');
const messages = require('../pageobjects/Features/Messages/messages');
const addToCart = require('../pageobjects/Features/Cart/AddToCart');
const checkOutActions = require('../pageobjects/checkOut/checkOutActions');

// storing login credentials for standard user
let std_user = {
    username: 'standard_user',
    password: 'secret_sauce'
};

// Shipping info for checking out
let checkOutData = {
    f_n: 'mahir',
    l_n: 'shadid',
    p_c: '4203'
} 

describe('Negative Testing: Handling empty cart checkout', ()=>{
    it('Should login to user profile', async()=>{
        await Login.InsertLoginInfo(
            std_user.username,
            std_user.password
        );
        await Login.ClickLoginButton();

        // Verifying that the login is successful and redirected to inventory page
        await expect(browser).toHaveUrl(expect.stringContaining('inventory'));
    })
    it('Should insert checkout info after cart page', async()=>{
        await addToCart.clickOnCartIcon();

        await checkOutActions.clickCheckout();

        // Inserting Shipping Credentials
        await checkOutActions.insertCheckoutInfo(
            checkOutData.f_n,
            checkOutData.l_n,
            checkOutData.p_c
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