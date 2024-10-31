const { expect, browser } = require('@wdio/globals');
const Login = require('../pageobjects/logInPage/logInAction');
const hamburgerA = require('../pageobjects/Features/Hamburger/hamAction');
const hamburgerL = require('../pageobjects/Features/Hamburger/hamLocators');
const resetApp = require('../pageobjects/Features/ResetAppState/rasAction');
const addToCart = require('../pageobjects/Features/Cart/AddToCart');
const checkOutActions = require('../pageobjects/checkOut/checkOutActions');
const messages = require('../pageobjects/Features/Messages/messages');
const logout = require('../pageobjects/Features/logOut/logOut');

// storing login credentials for standard user
let std_user = {
    username: 'standard_user',
    password: 'secret_sauce'
};

// Shipping info for checking out
let checkOutData = {
    f_n: 'mahir',
    l_n: 'shadid',
    p_c: '4203'
} 

describe('Login with standard user and perform actions', () => {

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

    // Function to dynamically pick the items and their prices from inventory
    async function getThreeUniqueRandomItems() {
        const items = await getInventoryItems();
        const prices = await getInventoryPrices();
    
        if (items.length < 3) {
            throw new Error("Not enough items to pick three unique random items.");
        }
    
        // Create an array of item objects containing names and prices
        const inventoryArray = items.map((name, index) => ({ name, price: prices[index] }));
    
        // Shuffle the inventory array
        const shuffledItems = inventoryArray.sort(() => 0.5 - Math.random());
    
        // Pick the first three items
        const randomItemsArray = shuffledItems.slice(0, 3);
    
        // Separate names and prices
        const randomItemNames = randomItemsArray.map(item => item.name);
        const randomItemPrices = randomItemsArray.map(item => item.price);
        
        return { names: randomItemNames, prices: randomItemPrices };
    }

    let actualItemsFormatted = {};
    let actualItems = {};
    let calculatedTotalPrice;

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
    it('Should add any 3 items from the inventory', async()=>{

        // Using the function to pickup 3 items and their prices
        const { names: randomItemNames, prices: randomItemPrices } = await getThreeUniqueRandomItems();
        const [randomItem1, randomItem2, randomItem3] = randomItemNames;
        const [randomPrice1, randomPrice2, randomPrice3] = randomItemPrices;

        // Dictionary for actual items
        actualItems = {
            item1: randomItem1,
            item2: randomItem2,
            item3: randomItem3
        }

        // Formatting the values
        const randomItemFormatted1 = randomItem1.toLowerCase().replace(/ /g, '-');
        const randomItemFormatted2 = randomItem2.toLowerCase().replace(/ /g, '-');
        const randomItemFormatted3 = randomItem3.toLowerCase().replace(/ /g, '-');

        actualItemsFormatted = {
            item1: randomItemFormatted1,
            item2: randomItemFormatted2,
            item3: randomItemFormatted3
        }

        const randomPriceFormatted1 =  parseFloat(randomPrice1.replace('$', ''));
        const randomPriceFormatted2 =  parseFloat(randomPrice2.replace('$', ''));
        const randomPriceFormatted3 =  parseFloat(randomPrice3.replace('$', ''));

        // calculating actual values
        let calculateWithoutTax = randomPriceFormatted1+randomPriceFormatted2+randomPriceFormatted3;
        let calculateWithTax = (randomPriceFormatted1*0.08)+(randomPriceFormatted2*0.08)+(randomPriceFormatted3*0.08);
        calculatedTotalPrice = calculateWithoutTax+calculateWithTax;

        // Adding 3 Items in Cart
        await addToCart.clickOnAddToCart(actualItemsFormatted.item1);
        await addToCart.clickOnAddToCart(actualItemsFormatted.item2);
        await addToCart.clickOnAddToCart(actualItemsFormatted.item3);
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
    it('Should insert checkout info', async()=>{

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

        await expect(browser).toHaveUrl(expect.stringContaining('checkout-step-two'));
    })
    it('Should verify the selected items', async()=>{
        // Verifying Cart items that are added
        for (const itemName of Object.values(actualItems)) {
            const cartItemElement = await addToCart.cartItems(itemName);
            const cartItemText = await cartItemElement.getText();
            await expect(cartItemText).toEqual(itemName);
        }
    })
    it('Should verify total price', async()=>{
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
