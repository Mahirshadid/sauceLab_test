class hamLocators {
    get hamburgerButton(){
        return $('//button[@id="react-burger-menu-btn"]');
    }
    get hamburgerMenu(){
        return $('//div[@class="bm-menu"]');
    }
    get hamburgerCloseButton(){
        return $('//button[@id="react-burger-cross-btn"]');
    }
}

module.exports = new hamLocators();