const { expect } = require('@wdio/globals')
const Login = require('../pageobjects/logInPage/logInAction')

let locked_out_user = {
    username: 'locked_out_user',
    password: 'secret_sauce'
}

describe('Login with locked_out_user', () => {
    it('should verify the error message', async () => {
        await Login.InsertLoginInfo(
            locked_out_user.username,
            locked_out_user.password
        );
        await Login.ClickLoginButton();
        const error = await $('//h3[@data-test="error"]');
        const errorMessage = await error.getText();
        expect(errorMessage).toContain("Sorry, this user has been locked out.");
    })
})

