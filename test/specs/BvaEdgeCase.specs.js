const { expect } = require('@wdio/globals');
const Login = require('../pageobjects/logInPage/logInAction');
const messages = require('../pageobjects/Features/Messages/messages');
const addToCart = require('../pageobjects/Features/Cart/AddToCart');
const checkOutActions = require('../pageobjects/checkOut/checkOutActions');

let emptyCheck = {
    un: '',
    p: 'secret_sauce'
}

let CS = {
    un: 'Standard_user',
    p: 'secret_saucE'
}

let WSC = {
    un: 'standard_user ',
    p: 'secret_sauce'
}

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

describe('Additionally, Login Page BVA and Edge Cases', ()=>{
    it('Should handle empty fields', async()=>{
        await Login.InsertLoginInfo(
            emptyCheck.un,
            emptyCheck.p
        );
        await Login.ClickLoginButton();
        
        const error = await messages.errorOnLoginPage;
        const errorTxt = await error.getText();

        expect(errorTxt).toContain("Username is required");
    })
    it('Should handle case-sensitive fields', async()=>{
        await Login.InsertLoginInfo(
            CS.un,
            CS.p
        );
        await Login.ClickLoginButton();
        
        const error = await messages.errorOnLoginPage;
        const errorTxt = await error.getText();

        expect(errorTxt).toContain("Username and password do not match any user in this service");
    })
    it('Should handle white-space case fields', async()=>{
        await Login.InsertLoginInfo(
            WSC.un,
            WSC.p
        );
        await Login.ClickLoginButton();
        
        const error = await messages.errorOnLoginPage;
        const errorTxt = await error.getText();

        expect(errorTxt).toContain("Username and password do not match any user in this service");
    })
    it('Should handle empty cart checkout', async()=>{
        await Login.InsertLoginInfo(
            std_user.username,
            std_user.password
        );
        await Login.ClickLoginButton();

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

        await checkOutActions.clickOnFinish();

        const thankYouMsg = await messages.thankYouMsgAfterOrder;
        const thankYouMsgText = await thankYouMsg.getText();
        // verifying success message
        await expect(thankYouMsgText).not.toEqual('Thank you for your order!');
    })
})