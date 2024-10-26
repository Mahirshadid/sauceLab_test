class filter {
    get filter(){
        return $('//select[@data-test="product-sort-container"]');
    }
}

module.exports = new filter();