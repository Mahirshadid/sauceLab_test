const { expect, browser } = require('@wdio/globals');
const Login = require('../pageobjects/logInPage/logInAction');
const filter = require('../pageobjects/Features/Filter/filter');
const hamburgerA = require('../pageobjects/Features/Hamburger/hamAction');
const hamburgerL = require('../pageobjects/Features/Hamburger/hamLocators');
const resetApp = require('../pageobjects/Features/ResetAppState/rasAction');
const addToCart = require('../pageobjects/Features/Cart/AddToCart');
const checkOutLocators = require('../pageobjects/checkOut/checkOutLocators');
const checkOutActions = require('../pageobjects/checkOut/checkOutActions');
const messages = require('../pageobjects/Features/Messages/messages')
const logout = require('../pageobjects/Features/logOut/logOut')

let pg_user = {
    username: 'performance_glitch_user',
    password: 'secret_sauce'
};

let filters = {
    ZtoA: 'za'
}

let itemNo = 1;

let itemsInCart = {
    item1: "Test.allTheThings() T-Shirt (Red)",
};

let checkOutData = {
    f_n: 'mahir',
    l_n: 'shadid',
    p_c: '4203'
}

let totalPrice = '$15.99';
let totalPriceWithTax = '$17.27';

describe('Login with glitched user and perform actions', () => {
    it('Should show inventory page after successful login', async()=>{
        await Login.InsertLoginInfo(
            pg_user.username,
            pg_user.password
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
    it('Should select a filter option', async()=>{
        await filter.filter.waitUntil(async function () {
            return (await this.isDisplayed());
        }, {
            timeout: 10000,
            timeoutMsg: 'Filter option was not visible in 10s'
        });
        const sortDropdown = await filter.filter;
        await sortDropdown.selectByAttribute('value', `${filters.ZtoA}`);
    })
    it('Should add the first product into the cart', async()=>{
        await addToCart.itemNameForGU.waitUntil(async function () {
            return (await this.isDisplayed());
        }, {
            timeout: 10000,
            timeoutMsg: 'Items were not visible in 10s'
        });
        await addToCart.clickOnAddToCartForGU(itemNo);
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
