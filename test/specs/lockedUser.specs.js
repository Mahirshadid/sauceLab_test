const { expect } = require('@wdio/globals')
const Login = require('../pageobjects/logInPage/logInAction')
const message = require('../pageobjects/Features/Messages/messages')
const credentials = require('../pageobjects/credentials/credentials');

describe('Login with locked_out_user', () => {
    it('Should Insert the login Info for Login', async () => {
        // Login
        await Login.InsertLoginInfo(
            credentials.locked_user.username,
            credentials.locked_user.password
        );
        await Login.ClickLoginButton();
    })
    it('Should verify the error message', async () => {
        const error = await message.errorOnLoginPage;
        const errorMessage = await error.getText();
        // verifying error message
        expect(errorMessage).toContain("Sorry, this user has been locked out.");
    })
})

