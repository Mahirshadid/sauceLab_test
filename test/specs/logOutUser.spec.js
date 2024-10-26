const { expect } = require('@wdio/globals')
const Login = require('../pageobjects/logInPage/logInAction')
const message = require('../pageobjects/Features/Messages/messages')

let locked_out_user = {
    username: 'locked_out_user',
    password: 'secret_sauce'
}

describe('Login with locked_out_user', () => {
    it('Should Insert the login Info for Login', async () => {
        await Login.InsertLoginInfo(
            locked_out_user.username,
            locked_out_user.password
        );
        await Login.ClickLoginButton();
    })
    it('Should verify the error message', async () => {
        const error = await message.errorOnLoginPage;
        const errorMessage = await error.getText();
        expect(errorMessage).toContain("Sorry, this user has been locked out.");
    })
})

