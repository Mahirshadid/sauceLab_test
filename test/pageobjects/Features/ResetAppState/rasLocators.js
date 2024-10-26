class rasLocators {
    get rasLink(){
        return $('//a[@data-test="reset-sidebar-link"]');
    }
}

module.exports = new rasLocators();