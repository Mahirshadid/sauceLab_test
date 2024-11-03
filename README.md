# SauceLab Website Testing Task  

This project has been given by OSTAD LP. as the final assessment on the demo website: https://www.saucedemo.com/  

Q1 | [Mark 20] Try login with locked_out_user and verify the error message.  

test > specs > lockedUser.specs.js

Q2 | [Mark 50] Login with standard_user. Then from the hamburger menu Reset App State. Then Add Any three items to the cart. Then navigate up to the final checkout page and verify all the product's name and the total price. Then finish the purchase journey and verify the successful order message. Then Reset the App State again and log out.  

test > specs > StdUser.specs.js

Q3 | [Mark 30] Login with performance_glitch_user and Reset App State. Then filter by name (Z to A) and select the first product into the cart. Then navigate up to the final checkout page and verify all the product's name and the total price. Then finish the purchase journey and verify the successful order message. Then Reset the App State again and log out.  

test > specs > glitchUser.specs.js

Additionally, I have done a few negative testing besides the positive one just to locate the defects in the demo website; can be found in  

test > specs > negativeTesting > loginPage.js  
                               > checkOutInfoPage.js  
                               > emptyCartCheckout.js  

# Pre-requisites to run the project

- Node.js: Make sure you have Node.js installed. You can download it from https://nodejs.org/en/download/package-manager.
- Java: Make sure you have JDK installed. Download it from https://www.oracle.com/bd/java/technologies/downloads/#jdk23-windows.
- Java setup: the Bin file in the JDK directory should be added as path and create a variable naming "JAVA-HOME" in "Advanced System Settings -> Environment Variables".
- An IDE to execute: In example, Visual Studio Code https://visualstudio.microsoft.com/downloads/.

# Steps to run the project

- Copy the repository url https://github.com/Mahirshadid/sauceLab_test.
- Go to VSCode, select or create a local folder to store the project.
- Open terminal.
- Type "git clone https://github.com/Mahirshadid/sauceLab_test" and press enter.
- The project dir will be imported into the folder.
- In terminal, type "cd sauceLab_test", and press enter to navigate to the parent folder of the project. sauceLab_test is the parent folder of the project.
- Now, type "npm install". NPM will install all the necessary packages from the package.json file.
- Type "npm run test" to run the project and "npm run reporter" to create report using Allure.

# Testomat Report

- https://app.testomat.io/report/9b929cc8/d7f2a702-9c56-4c1b-bcd0-5e27c74e14f9
- Expiry Date: Dec 31, 2024 12:00 AM

## How I calculated the tax percentage of the sauceLab items

To find the tax percentage based on the item total and tax amount, you can use this formula:

Tax Percentage = (Tax Amount/Total Price) × 100

Selected some items, thus,  
Total price = $49.99  
Tax = $4.00

Filling up the values:

Tax Percentage = (4.00/49.99) × 100  
Tax Percentage = 8.00%  

So, each item selected has an added 8% tax on its price.

## Allure Report

![Allure Report](https://github.com/user-attachments/assets/6ecb021d-b7ed-4008-b568-e0ac2216fa71)
