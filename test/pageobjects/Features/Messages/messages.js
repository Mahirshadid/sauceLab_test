class messages {
    get thankYouMsgAfterOrder(){
        return $('//h2[@data-test="complete-header"]');
    }
    get errorOnLoginPage(){
        return $('//h3[@data-test="error"]');
    }
    get errorOnCheckoutPage(){
        return $('//h3[@data-test="error"]');
    }
}

module.exports = new messages();