const { expect } = require('@wdio/globals');
const Login = require('../pageobjects/logInPage/logInAction');
const messages = require('../pageobjects/Features/Messages/messages');

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

describe('Negative Testing: Boundary values and edge case handling on login page', ()=>{
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
})