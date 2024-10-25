const logInLocators = require('./logInLocators');

class logInActions {
    async InsertLoginInfo(username,password){
        await logInLocators.logInInfo.username.waitUntil(async function () {
            return (await this.isDisplayed());
        }, {
            timeout: 5000,
            timeoutMsg: 'Login fields were not visible in 5s'
        })
        await logInLocators.logInInfo.username.setValue(username);
        await logInLocators.logInInfo.password.setValue(password);
    }

    async ClickLoginButton(){
        await logInLocators.logInButton.click();
    }

}

module.exports = new logInActions();