class AddToCartAction {
    async clickOnAddToCart(itemName) {
        const addToCartButton = await $(`//button[@name="add-to-cart-${itemName}"]`);
        await addToCartButton.click();
    }
    async clickOnCartIcon(){
        await $('//a[@data-test="shopping-cart-link"]').click();
    }
    async cartItems(itemName){
        return await $(`//div[@data-test="inventory-item-name" and contains(text(),"${itemName}")][1]`);
    }
    get itemPrices(){
        return $$('//div[@data-test="inventory-item-price"][1]');
    }
    async clickOnAddToCartForGU(itemNo) {
        const addToCartButton = await $(`//div[@class="inventory_item"][${itemNo}]/div/div/button`);
        await addToCartButton.click();
    }
    get itemNameForGU(){
        return $('//div[@class="inventory_item"][1]/div/div/a');
    }
}

module.exports = new AddToCartAction();