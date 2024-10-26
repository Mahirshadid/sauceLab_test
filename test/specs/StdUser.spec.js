const { expect, browser } = require('@wdio/globals');
const Login = require('../pageobjects/logInPage/logInAction');
const hamburgerA = require('../pageobjects/Features/Hamburger/hamAction');
const hamburgerL = require('../pageobjects/Features/Hamburger/hamLocators');
const resetApp = require('../pageobjects/Features/ResetAppState/rasAction');
const addToCart = require('../pageobjects/Features/Cart/AddToCart');

let std_user = {
    username: 'standard_user',
    password: 'secret_sauce'
};

let items = {
    item1: 'sauce-labs-backpack',
    item2: 'sauce-labs-bike-light',
    item3: 'sauce-labs-bolt-t-shirt'
};

let itemsInCart = {
    item1: "Sauce Labs Backpack",
    item2: "Sauce Labs Bike Light",
    item3: "Sauce Labs Bolt T-Shirt"
};

let totalPrice = '$55.97';

describe('Login with standard user and perform actions', () => {
    it('Should show inventory page after successful login', async()=>{
        await Login.InsertLoginInfo(
            std_user.username,
            std_user.password
        );
        await Login.ClickLoginButton();
        await expect(browser).toHaveUrl(expect.stringContaining('inventory'));
    })
    it('Should open hamburger menu and reset app state', async()=>{
        await hamburgerA.clickOnHam();
        await hamburgerL.hamburgerMenu.waitUntil(async function () {
            return (await this.isDisplayed());
        }, {
            timeout: 5000,
            timeoutMsg: 'Hamburger menu was not visible in 5s'
        })
        await resetApp.clickOnRAS();
        await hamburgerA.clickOnHamClose();
    })
    it('Should add 3 items from the inventory', async()=>{
        await addToCart.clickOnAddToCart(items.item1);
        await addToCart.clickOnAddToCart(items.item2);
        await addToCart.clickOnAddToCart(items.item3);

        await addToCart.clickOnCartIcon();

        await browser.waitUntil(async () => {
            const cartItems = await addToCart.cartItems(itemsInCart.item1);
            return await cartItems.isDisplayed();
        }, {
            timeout: 5000,
            timeoutMsg: 'Cart items were not visible in 5s'
        });

    })
    it('Should verify the items in the Cart', async()=>{
        for (const itemName of Object.values(itemsInCart)) {
            const cartItemElement = await addToCart.cartItems(itemName);
            const cartItemText = await cartItemElement.getText();
            await expect(cartItemText).toEqual(itemName);
        }
    })
    it('Should verify the total price of the items in the Cart', async()=>{
        const priceElements = await addToCart.itemPrices;
        let calculatedTotalPrice = 0;

        for (const priceElement of priceElements) {
            const priceText = await priceElement.getText();
            const priceValue = parseFloat(priceText.replace('$', ''));
            calculatedTotalPrice += priceValue;
            
        }
        const expectedTotalPrice = parseFloat(totalPrice.replace('$', ''));
        await expect(calculatedTotalPrice).toEqual(expectedTotalPrice);
    })
})
