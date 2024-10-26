const { expect, browser } = require('@wdio/globals');
const Login = require('../pageobjects/logInPage/logInAction');
const hamburgerA = require('../pageobjects/Features/Hamburger/hamAction');
const hamburgerL = require('../pageobjects/Features/Hamburger/hamLocators');
const resetApp = require('../pageobjects/Features/ResetAppState/rasAction');
const addToCart = require('../pageobjects/Features/Cart/AddToCart');
const checkOutLocators = require('../pageobjects/checkOut/checkOutLocators');
const checkOutActions = require('../pageobjects/checkOut/checkOutActions');
const messages = require('../pageobjects/Features/Messages/messages')
const logout = require('../pageobjects/Features/logOut/logOut')

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

let checkOutData = {
    f_n: 'mahir',
    l_n: 'shadid',
    p_c: '4203'
} 

let totalPrice = '$55.97';
let totalPriceWithTax = '$60.45';

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
    it('Should verify the selected items and total price', async()=>{
        await addToCart.clickOnCartIcon();
        await checkOutActions.clickCheckout();

        await checkOutActions.insertCheckoutInfo(
            checkOutData.f_n,
            checkOutData.l_n,
            checkOutData.p_c
        );

        await checkOutActions.clickOnContinue();

        for (const itemName of Object.values(itemsInCart)) {
            const cartItemElement = await addToCart.cartItems(itemName);
            const cartItemText = await cartItemElement.getText();
            await expect(cartItemText).toEqual(itemName);
        }

        const priceElements = await addToCart.itemPrices;
        let calculatedTotalPrice = 0;

        for (const priceElement of priceElements) {
            const priceText = await priceElement.getText();
            const priceValue = parseFloat(priceText.replace('$', ''));
            calculatedTotalPrice += priceValue;
            
        }
        const expectedTotalPricewithoutTax = parseFloat(totalPrice.replace('$', ''));
        await expect(calculatedTotalPrice).toEqual(expectedTotalPricewithoutTax);

        const totalPriceWithTaxElement = await checkOutLocators.totalPriceWithTax;
        const totalPriceWithTaxText = await totalPriceWithTaxElement.getText();
        const totalPriceWithTaxTexttrimmed = totalPriceWithTaxText.split('Total: ')[1].trim();
        const totalPriceWithTaxValue = parseFloat(totalPriceWithTaxTexttrimmed.replace('$', ''));

        console.log(`Total Price with Tax from Page: ${totalPriceWithTaxValue}`); 

        const expectedTotalPrice = parseFloat(totalPriceWithTax.replace('$', ''));

        console.log(`Expected Total Price with Tax: ${expectedTotalPrice}`);

        await expect(totalPriceWithTaxValue).toEqual(expectedTotalPrice);
    })
    it('Should finish the purchase journey', async()=>{
        await checkOutActions.clickOnFinish();
    })
    it('Should verify the purchase', async()=>{
        const thankYouMsg = await messages.thankYouMsgAfterOrder;
        const thankYouMsgText = await thankYouMsg.getText();

        await expect(thankYouMsgText).toEqual('Thank you for your order!');
    })
    it('Should reset the App and Log Out', async()=>{
        await hamburgerA.clickOnHam();
        await resetApp.clickOnRAS();
        await logout.logOut.click();
    })
})
