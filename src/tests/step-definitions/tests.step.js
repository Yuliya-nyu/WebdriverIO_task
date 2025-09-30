const { Given, When, Then } = require('@wdio/cucumber-framework');
const { $, $$, expect, browser } = require('@wdio/globals')
const { expectChai, assert } = require('../support/chai');

Given(/^user is on login page$/, async () => {
  await browser.url('/auth/login');
});

When(/^user enters a valid email$/, async () => {
  await $('#email').setValue('test@example.com');
});

When(/^user leaves the password field empty$/, async () => {
  await $('#password').clearValue();
});

When(/^user clicks the login button$/, async () => {
  await $('.btnSubmit').click();
});

Then(/^an error message for missing password is displayed$/, async () => {
  const errorMsg = await $('#password-error');
  
  const text = await errorMsg.getText();
  expectChai(text).to.include('Password is required');
});

Given(/^the user is on the product details page$/, async () => {
  await browser.url('/')
  const anyProductLink = await $('//a[contains(@href,"/product/")]')
  await anyProductLink.click()
})

When(/^the user adds the product to the basket$/, async () => {
  const addBtn = await $('#btn-add-to-cart')
  await addBtn.click()
})

Then(/^a confirmation toast is displayed$/, async () => {
  const toastMsg = await $('#toast-container .toast-message[role="alert"]')
  await toastMsg.waitForDisplayed({ timeout: 10000 })

  const text = (await toastMsg.getText()).toLowerCase()
  assert.include(text, 'product added to shopping cart')
});

let cartBefore = 0
async function getCartCount() {
  const badge =  await $('span[data-test="cart-quantity"]')
  if (!(await badge.isExisting()) || !(await badge.isDisplayed())) return 0
  const n = parseInt((await badge.getText()).trim(), 10)
  return Number.isFinite(n) ? n : 0
}

Then(/^the basket counter is incremented$/, async () => {
  await browser.waitUntil(
    async () => (await getCartCount()) >= cartBefore + 1,
    { timeout: 10000, interval: 250, timeoutMsg: 'Cart counter did not increment' }
  )
  const after = await getCartCount()

  after.should.be.greaterThan(cartBefore);
});

Given(/^the user is not signed in$/, async () => {
  await browser.url('/')
  await browser.deleteCookies()
  await browser.refresh()
  
  const signInBtn = $('//a[normalize-space()="Sign in"]');
  const isVisible = await signInBtn.isDisplayed();
  expectChai(isVisible).to.be.true;   
});

When(/^the user add product to favourites$/, async () => {
  await $('#btn-add-to-favorites').click()
});

Then(/^the error toast is displayed$/, async () => {
  const toast = await $('#toast-container .toast-message[role="alert"]')
  await toast.waitForDisplayed({ timeout: 10000 })

  const text = (await toast.getText()).toLowerCase()
  assert.include(text,'unauthorized, can not add product to your favorite list.')
});

Given(/^the user is on the home page$/, async () => {
  await browser.url('/');
});

When(/^the user selects a product$/, async () => {
  const anyProductLink = $('//a[contains(@href,"/product/")]')
  await anyProductLink.click()
});

Then(/^the product details page is displayed$/, async () => {
  const url = await browser.getUrl();
  expectChai(url).to.include('product');
});

Then(/^the product information is visible$/, async () => {
  const productName = await $('h1[data-test="product-name"]');
  const productImg = await $('.figure-img.img-fluid');
  const unitPrice = await $('span[aria-label="unit-price"]');
  const description = await $('#description');

  await productName.waitForDisplayed({ timeout: 5000 });
  expectChai(await productName.isDisplayed()).to.be.true;

  await productImg.waitForDisplayed({ timeout: 5000 });
  expectChai(await productImg.isDisplayed()).to.be.true;

  await unitPrice.waitForDisplayed({ timeout: 5000 });
  expectChai(await unitPrice.isDisplayed()).to.be.true;

  await description.waitForDisplayed({ timeout: 5000 });
  expectChai(await description.isDisplayed()).to.be.true;
});

When(/^the user selects the "([^"]*)" category from the Categories menu$/, async (category) => {
  await $('.nav-link.dropdown-toggle').click();
  const item = $(`//a[normalize-space()="${category}"]`);
  await item.waitForClickable({ timeout: 5000 });
  await item.click();
});

const categoryHeading = () => $('//h1 | //h2');

Then(/^the category page for "([^"]*)" is displayed$/, async (category) => {
  const slug = category
    .toLowerCase()                  
    .replace(/\s+/g, '-')           
    .replace(/[^a-z0-9-]/g, '');

const url = await browser.getUrl();
expectChai(url).to.include(slug);
});

Then(/^products from "(.*)" are shown$/, async (category) => {
  await browser.waitUntil(async () => {
    return (await $$('div.card')).length > 0 
        || await $('//*[contains(text(), "no products found")]').isDisplayed();
  }, {
    timeout: 5000,
    timeoutMsg: 'Neither products nor "no products found" message appeared'
  });

  const products = await $$('div.card');
  const noProductsMessage = await $('//*[contains(text(), "no products found")]');

  if (products.length > 0) {
    assert.isAbove(products.length, 0, "At least one product should be found");

    for (const product of products) {
      const title = await product.$('h5,.card-title,[data-test="product-name"]');
      assert.isTrue(await title.isDisplayed(), "Product title should be visible");
    }
  } else {
    assert.isTrue(await noProductsMessage.isDisplayed(), "No products found message should be visible");
  }
});

When(/^the user searches for the existing "([^"]*)" name$/, async (product) => {
  const searchInput = await $('#search-query');
  searchInput.setValue(product);
  const searchButton = await $('button[type="submit"]');
  await searchButton.scrollIntoView();
  await searchButton.click();
});

Then(/^the search results for "([^"]*)" are displayed$/, async (product) => {
  const searchTerm = await $('span[data-test="search-term"]');

  const text = await searchTerm.getText();
  expectChai(text).to.include(product);
});

Then(/^all listed results contain the "([^"]*)" name$/, async (product) => {
  const results = await $$('[data-test="search_completed"] .card-title');

  for (const item of results) {
    const text = await item.getText();
    text.toLowerCase().should.include(product.toLowerCase());
  }
});

When(/^the user searches for non-existing "([^"]*)"$/, async (product) => {
  const searchInput = await $('#search-query');
  searchInput.setValue(product);
  const searchButton = await $('button[type="submit"]');
  await searchButton.scrollIntoView();
  await searchButton.click();
});

Then(/^no product results are displayed$/, async () => {
  const results = await $$('[data-test="search_completed"] .card-title');

  results.length.should.equal(0);
});

Then(/^a message "([^"]*)" is shown$/, async (message) => {
  const msg = await $('//div[@data-test="no-results"]');
  expect(msg).toBeDisabled();

  const text = await msg.getText();
  assert.include(text, message, `Expected "${text}" to include "${message}"`);
});

When(/^the user selects "([^"]*)" from the language dropdown$/, async (lang) => {
  const dropdown = await $('#language');
  await dropdown.waitForClickable({ timeout: 5000 });
  await dropdown.click();

  const option = await $(`//a[normalize-space()="${lang}"]`);
  await option.waitForClickable({ timeout: 5000 });
  await option.click();
});

Then(/^the language indicator shows "([^"]*)"$/, async (lang) => {
  const indicator = await $('#language');

  const text = await indicator.getText();
  text.should.equal(lang);

});

Then(/^the site content is displayed in "([^"]*)"$/, async (lang) => {
  const expectedTexts = {
  DE: 'Home',
  EN: 'Home',
  ES: 'Inicio',
  FR: 'Accueil',
  NL: 'Home',
  TR: 'Anasayfa'
};
  const homeLink = await $(`.nav-link.active`);

  await homeLink.waitUntil(async function () {
  return (await this.getText()) === expectedTexts[lang];
}, {
  timeout: 5000,
  timeoutMsg: `Expected text: ${expectedTexts[lang]}`
});

const text = await homeLink.getText();
expectChai(text).to.equal(expectedTexts[lang]);
});










