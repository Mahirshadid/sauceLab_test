const { expect, browser } = require('@wdio/globals');
const Login = require('../pageobjects/logInPage/logInAction');
const filter = require('../pageobjects/Features/Filter/filter');
const hamburgerA = require('../pageobjects/Features/Hamburger/hamAction');
const hamburgerL = require('../pageobjects/Features/Hamburger/hamLocators');
const resetApp = require('../pageobjects/Features/ResetAppState/rasAction');
const addToCart = require('../pageobjects/Features/Cart/AddToCart');
const checkOutActions = require('../pageobjects/checkOut/checkOutActions');
const messages = require('../pageobjects/Features/Messages/messages')
const logout = require('../pageobjects/Features/logOut/logOut')
const credentials = require('../pageobjects/credentials/credentials')

// storing filter options
let filters = {
    ZtoA: 'za',
    AtoZ: 'az',
    LowToHigh: 'lohi',
    HighToLow: 'hilo'
}

describe('Login with glitched user and perform actions', () => {

    // Function to count the length of the items list and get the items
    async function getInventoryItems() {
        const inventoryList = await addToCart.inventoryList;
        const inventoryListLen = inventoryList.length;

        const items = [];
        for (let i = 0; i < inventoryListLen; i++) {
            const itemName = await inventoryList[i].getText();
            items.push(itemName);
        }
        return items;
    }
    // Function to get the prices
    async function getInventoryPrices() {
        const inventoryList = await addToCart.inventoryPriceList;
        const prices = [];
        for (let i = 0; i < inventoryList.length; i++) {
            const itemPrice = await inventoryList[i].getText();
            prices.push(itemPrice);
        }
        return prices;
    }

    async function getFirstItemAndPrice() {
        const items = await getInventoryItems();
        const prices = await getInventoryPrices();

        const firstItem = items[0];
        const firstItemPrice = prices[0];

        return { name: firstItem, price: firstItemPrice };
    }

    let actualItems = {};

    it('Should show inventory page after successful login', async()=>{
        // Login
        await Login.InsertLoginInfo(
            credentials.glitched_user.username,
            credentials.glitched_user.password
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
    it('Should select a filter option', async()=>{
        await filter.filter.waitUntil(async function () {
            return (await this.isDisplayed());
        }, {
            timeout: 10000,
            timeoutMsg: 'Filter option was not visible in 10s'
        });
        const sortDropdown = await filter.filter;
        // Selecting the given filter option
        await sortDropdown.selectByAttribute('value', `${filters.ZtoA}`);
    })
    it('Should add the first product into the cart', async()=>{

        // Adding the first item into the cart
        const { name: firstItem, price: firstItemPrice } = await getFirstItemAndPrice();
        const firstItemName = firstItem.toLowerCase().replace(/ /g, '-');
        await addToCart.clickOnAddToCart(firstItemName);

        actualItems = { item1:firstItem };

        const firstItemPriceValue =  parseFloat(firstItemPrice.replace('$', ''));

        // calculating actual values
        let calculateWithTax = (firstItemPriceValue*0.08);
        calculatedTotalPrice = firstItemPriceValue+calculateWithTax;
    })
    it('Should navigate to cart', async()=>{
        // Clicking on the Cart
        await addToCart.clickOnCartIcon();

        await browser.waitUntil(async () => {
            const cartItems = await addToCart.cartItems(actualItems.item1);
            return await cartItems.isDisplayed();
        }, {
            timeout: 5000,
            timeoutMsg: 'Cart items were not visible in 5s'
        });
    })
    it('Should perform checkout actions', async()=>{

        // Checkout Button Clicked
        await checkOutActions.clickCheckout();

        // Inserting Shipping Credentials
        await checkOutActions.insertCheckoutInfo(
            credentials.checkout.firstname,
            credentials.checkout.lastname,
            credentials.checkout.postcode
        );

        // Clicking Continue to final page
        await checkOutActions.clickOnContinue();

        await expect(browser).toHaveUrl(expect.stringContaining('checkout-step-two'));
    })
    it('Should verify the selected item', async()=>{
        // Verifying Cart items that are added
        for (const itemName of Object.values(actualItems)) {
            const cartItemElement = await addToCart.cartItems(itemName);
            const cartItemText = await cartItemElement.getText();
            await expect(cartItemText).toEqual(itemName);
        }
    })
    it('Should verify total price including tax', async()=>{
        const priceElements = await addToCart.itemPrices;
        let calculatedTotalPriceWithTax = 0;
        const taxRate = 0.08; // 8% tax rate
        for (const priceElement of priceElements) {
            const priceText = await priceElement.getText();
            const priceValue = parseFloat(priceText.replace('$', ''));
            const calculatedPriceWithTax = priceValue + (priceValue * taxRate); 
            calculatedTotalPriceWithTax += calculatedPriceWithTax;
        }
        // verifying total price with Tax
        await expect(calculatedTotalPriceWithTax.toFixed(2)).toEqual(calculatedTotalPrice.toFixed(2));
    })
    it('Should finish the purchase', async()=>{
        await checkOutActions.clickOnFinish();
    })
    it('Should verify the purchase with success message', async()=>{
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
