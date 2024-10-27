# SauceLab Website Testing Task  

This project has been given by OSTAD LP. as the final assessment on the demo website: https://www.saucedemo.com/  

Q1 | [Mark 20] Try login with locked_out_user and verify the error message,

Q2 | [Mark 50] Login with standard_user. Then from the hamburger menu Reset App State. Then Add Any three items to the cart. Then navigate up to the final checkout page and verify all the product's name and the total price. Then finish the purchase journey and verify the successful order message. Then Reset the App State again and log out.

Q3 | [Mark 30] Login with performance_glitch_user and Reset App State. Then filter by name (Z to A) and select the first product into the cart. Then navigate up to the final checkout page and verify all the product's name and the total price. Then finish the purchase journey and verify the successful order message. Then Reset the App State again and log out.


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
