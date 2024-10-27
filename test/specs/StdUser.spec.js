const { expect, browser } = require('@wdio/globals');
const Login = require('../pageobjects/logInPage/logInAction');
const hamburgerA = require('../pageobjects/Features/Hamburger/hamAction');
const hamburgerL = require('../pageobjects/Features/Hamburger/hamLocators');
const resetApp = require('../pageobjects/Features/ResetAppState/rasAction');
const addToCart = require('../pageobjects/Features/Cart/AddToCart');
const checkOutLocators = require('../pageobjects/checkOut/checkOutLocators');
const checkOutActions = require('../pageobjects/checkOut/checkOutActions');
const messages = require('../pageobjects/Features/Messages/messages');
const logout = require('../pageobjects/Features/logOut/logOut');

// storing login credentials for standard user
let std_user = {
    username: 'standard_user',
    password: 'secret_sauce'
};

// storing items that needs to be added to cart
let items = {
    item1: 'sauce-labs-backpack',
    item2: 'sauce-labs-bike-light',
    item3: 'sauce-labs-bolt-t-shirt'
};

// Expected Items in cart for verification
let itemsInCart = {
    item1: "Sauce Labs Backpack",
    item2: "Sauce Labs Bike Light",
    item3: "Sauce Labs Bolt T-Shirt"
};

// Shipping info for checking out
let checkOutData = {
    f_n: 'mahir',
    l_n: 'shadid',
    p_c: '4203'
} 

// Actual values for total price and total price with tax for verification
let totalPrice = '$55.97';
let totalPriceWithTax = '$60.45';

describe('Login with standard user and perform actions', () => {
    it('Should show inventory page after successful login', async()=>{
        // Login
        await Login.InsertLoginInfo(
            std_user.username,
            std_user.password
        );
        await Login.ClickLoginButton();
        // Verifying that the login is successful and redirected to inventory page
        await expect(browser).toHaveUrl(expect.stringContaining('inventory'));
    })
    it('Should open hamburger menu and reset app state', async()=>{
        // Open Hamburger Menu
        await hamburgerA.clickOnHam();
        // Wait until it shows up
        await hamburgerL.hamburgerMenu.waitUntil(async function () {
            return (await this.isDisplayed());
        }, {
            timeout: 5000,
            timeoutMsg: 'Hamburger menu was not visible in 5s'
        })
        // Click on reset app state
        await resetApp.clickOnRAS();
        // Close hamburger menu
        await hamburgerA.clickOnHamClose();
    })
    it('Should add 3 items from the inventory', async()=>{
        // Adding 3 Items in Cart
        await addToCart.clickOnAddToCart(items.item1);
        await addToCart.clickOnAddToCart(items.item2);
        await addToCart.clickOnAddToCart(items.item3);

        // Checking Cart
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

        // Checkout Button Clicked
        await checkOutActions.clickCheckout();

        // Inserting Shipping Credentials
        await checkOutActions.insertCheckoutInfo(
            checkOutData.f_n,
            checkOutData.l_n,
            checkOutData.p_c
        );

        // Clicking Continue to final page
        await checkOutActions.clickOnContinue();

        // Verifying Cart items that are added
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
        // verifying total price
        const expectedTotalPricewithoutTax = parseFloat(totalPrice.replace('$', ''));
        await expect(calculatedTotalPrice).toEqual(expectedTotalPricewithoutTax);

        const totalPriceWithTaxElement = await checkOutLocators.totalPriceWithTax;
        const totalPriceWithTaxText = await totalPriceWithTaxElement.getText();
        const totalPriceWithTaxTexttrimmed = totalPriceWithTaxText.split('Total: ')[1].trim();
        const totalPriceWithTaxValue = parseFloat(totalPriceWithTaxTexttrimmed.replace('$', ''));

        console.log(`Total Price with Tax from Page: ${totalPriceWithTaxValue}`); 

        const expectedTotalPrice = parseFloat(totalPriceWithTax.replace('$', ''));

        console.log(`Expected Total Price with Tax: ${expectedTotalPrice}`);

        // verifying total price with Tax
        await expect(totalPriceWithTaxValue).toEqual(expectedTotalPrice);
    })
    it('Should finish the purchase journey', async()=>{
        await checkOutActions.clickOnFinish();
    })
    it('Should verify the purchase', async()=>{
        const thankYouMsg = await messages.thankYouMsgAfterOrder;
        const thankYouMsgText = await thankYouMsg.getText();
        // verifying success message
        await expect(thankYouMsgText).toEqual('Thank you for your order!');
    })
    it('Should reset the App and Log Out', async()=>{
        await hamburgerA.clickOnHam();
        await resetApp.clickOnRAS();
        await logout.logOut.click();
    })
})
