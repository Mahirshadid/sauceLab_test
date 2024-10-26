// class addToCart {
//     get itemPrices(){
//         return $('//div[@data-test="inventory-item-price"]');
//     }
// }

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
}

module.exports = new AddToCartAction();