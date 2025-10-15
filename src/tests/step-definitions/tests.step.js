const { Given, When, Then } = require('@wdio/cucumber-framework');
const { expectChai, assert } = require('../support/chai');

import { loginPage, productDetailsPage, homePage, categoryPage } from '../../po/pages';
import { headerComponent } from '../../po/components/common';

Given(/^user is on login page$/, async () => {
  await loginPage.open();
});

When(/^user enters a valid email$/, async () => {
  await loginPage.emailInput.setValue('test@example.com');
});

When(/^user leaves the password field empty$/, async () => {
  await loginPage.passwordInput.clearValue();
});

When(/^user clicks the login button$/, async () => {
  await loginPage.submitBtn.click();
});

Then(/^an error message for missing password is displayed$/, async () => {
  const errorText = await loginPage.getErrorMessage();
  expectChai(errorText).to.include('Password is required');
});

Given(/^the user is on the product details page$/, async () => {
  await homePage.openFirstProduct();
});

When(/^the user adds the product to the basket$/, async () => {
  await productDetailsPage.addToBasket();
});

Then(/^a confirmation toast is displayed$/, async () => {
  const text = await productDetailsPage.getToastText();
  expectChai(text).to.include('product added to shopping cart');
});

Then(/^the basket counter is incremented$/, async () => {
  const before = await headerComponent.getCartCount();
  await productDetailsPage.addToBasket();
  const after = await headerComponent.waitForCartIncrement(before);
  expectChai(after).to.be.greaterThan(before);
});

Given(/^the user is not signed in$/, async () => {
  await browser.url('/');
  await browser.deleteCookies();
  await browser.refresh();

  const isVisible = await headerComponent.signInBtn.isDisplayed();
  expectChai(isVisible).to.be.true;
});

When(/^the user add product to favourites$/, async () => {
  await productDetailsPage.addToFavBtn.click();
});

Then(/^the error toast is displayed$/, async () => {
  const text = await productDetailsPage.getToastText();
  assert.include(text, 'unauthorized, can not add product to your favorite list.');
});

Given(/^the user is on the home page$/, async () => {
  await homePage.open();
});

When(/^the user selects a product$/, async () => {
  await homePage.firstProductLink.click();
});

Then(/^the product details page is displayed$/, async () => {
  const isOpened = await productDetailsPage.isOpened();
  expectChai(isOpened).to.be.true;
});

Then(/^the product information is visible$/, async () => {
  await productDetailsPage.waitForProductDetails();

  expectChai(await productDetailsPage.productName.isDisplayed()).to.be.true;
  expectChai(await productDetailsPage.productImg.isDisplayed()).to.be.true;
  expectChai(await productDetailsPage.unitPrice.isDisplayed()).to.be.true;
  expectChai(await productDetailsPage.description.isDisplayed()).to.be.true;
});

When(/^the user selects the "([^"]*)" category from the Categories menu$/, async (category) => {
  await headerComponent.selectCategory(category);
});

Then(/^the category page for "([^"]*)" is displayed$/, async (category) => {
  await categoryPage.isCategoryDisplayed(category);
});

Then(/^products from "(.*)" are shown$/, async (_category) => {
  await categoryPage.expectProductsOrEmpty(assert);
});

When(/^the user searches for the existing "([^"]*)" name$/, async (product) => {
  await homePage.search(product);
});

Then(/^the search results for "([^"]*)" are displayed$/, async (product) => {
  const text = await homePage.searchTerm.getText();
  expectChai(text).to.include(product);
});

Then(/^all listed results contain the "([^"]*)" name$/, async (product) => {
  const results = await homePage.getSearchResults();
  results.forEach((text) => {
    expectChai(text.toLowerCase()).to.include(product.toLowerCase());
  });
});

When(/^the user searches for non-existing "([^"]*)"$/, async (product) => {
  await homePage.search(product);
});

Then(/^a no results message "([^"]*)" is shown$/, async (message) => {
  const results = await homePage.searchReults;
  expectChai(results.length).to.equal(0);

  const text = await homePage.noResultsMsg.getText();
  assert.include(text, message, `Expected "${text}" to include "${message}"`);
});

When(/^the user selects "([^"]*)" from the language dropdown$/, async (lang) => {
  await headerComponent.selectLang(lang);
});

Then(/^the language indicator shows "([^"]*)"$/, async (lang) => {
  const text = await headerComponent.getLangIndicatorText();
  text.should.include(lang);
});

Then(/^the site content is displayed in "([^"]*)"$/, async (lang) => {
  const expectedTexts = {
    DE: 'Start',
    EN: 'Home',
    ES: 'Inicio',
    FR: 'Accueil',
    NL: 'Home',
    TR: 'Anasayfa',
  };

  await browser.waitUntil(
    async () => (await headerComponent.getHomeLinkText()) === expectedTexts[lang],
    {
      timeout: 5000,
      timeoutMsg: `Expected text: ${expectedTexts[lang]}`,
    }
  );

  const text = await headerComponent.getHomeLinkText();
  expectChai(text).to.include(expectedTexts[lang]);
});
