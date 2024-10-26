class logOut {
    get logOut(){
        return $('//a[@data-test="logout-sidebar-link"]'); 
    }
}

module.exports = new logOut();