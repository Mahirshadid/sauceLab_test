class logInLocators {
    get logInInfo(){
        return {
            username: $('//input[@name="user-name"]'),
            password: $('//input[@name="password"]')
        };
    }
    get logInButton(){
        return $('//input[@name="login-button"]');
    }
}

module.exports = new logInLocators();