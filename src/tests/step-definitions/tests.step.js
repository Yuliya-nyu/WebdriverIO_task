const { Given, When, Then } = require('@wdio/cucumber-framework');
const { $, $$, expect, browser } = require('@wdio/globals')

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
  expect(text).toContain('Password is required');
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
  await expect(text).toContain('product added to shopping cart')
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
  await expect(after).toBeGreaterThan(cartBefore)
});

Given(/^the user is not signed in$/, async () => {
  await browser.url('/')
  await browser.deleteCookies()
  await browser.refresh()
  
  const signInBtn = $('//a[normalize-space()="Sign in"]');
  await expect(signInBtn).toBeDisplayed();
});

When(/^the user add product to favourites$/, async () => {
  await $('#btn-add-to-favorites').click()
});

Then(/^the error toast is displayed$/, async () => {
  const toast = await $('#toast-container .toast-message[role="alert"]')
  await toast.waitForDisplayed({ timeout: 10000 })

  const text = (await toast.getText()).toLowerCase()
  await expect(text).toContain('unauthorized, can not add product to your favorite list.')
});

Given(/^the user is on the home page$/, async () => {
  await browser.url('/');
});

When(/^the user selects a product$/, async () => {
  const anyProductLink = $('//a[contains(@href,"/product/")]')
  await anyProductLink.click()
});

Then(/^the product details page is displayed$/, async () => {
  await expect(browser).toHaveUrl(expect.stringContaining('product'));
  await expect($('#btn-add-to-cart')).toBeDisplayed();
});

Then(/^the product information is visible$/, async () => {
  await expect($('h1[data-test="product-name"]')).toBeDisplayed();
  await expect($('.figure-img.img-fluid')).toBeDisplayed();
  await expect($('span[aria-label="unit-price"]')).toBeDisplayed();
  await expect($('#description')).toBeDisplayed();
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

  await expect(browser).toHaveUrl(expect.stringContaining(slug));
  await expect(categoryHeading()).toHaveText(expect.stringContaining(category));
});

Then(/^products from "([^"]*)" are shown$/, async (category) => {
  const products = await $$('div.card');
  const noProductsMessage = await $('//*[contains(text(), "no products found")]');

  if (products.length > 0) {
  
    await expect(products).toBeElementsArrayOfSize({ gte: 1 });

    for (const product of products) {
      const title = await product.$('h5, .card-title, [data-test="product-name"]');
      await expect(title).toBeDisplayed();
    }
  } else {
    await expect(noProductsMessage).toBeDisplayed();
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
  await expect(searchTerm).toHaveText(expect.stringContaining(product));
});

Then(/^all listed results contain the "([^"]*)" name$/, async (product) => {
  const results = await $$('[data-test="search_completed"] .card-title');

  for (const item of results) {
    const text = await item.getText();
    expect(text.toLowerCase()).toContain(product.toLowerCase());
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
  expect(results.length).toBe(0);
});

Then(/^a message "([^"]*)" is shown$/, async (message) => {
  const msg = await $('//div[@data-test="no-results"]');
  expect(msg).toBeDisabled();
  await expect(msg).toHaveText(message);
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
  await expect(indicator).toHaveText([lang])
});

Then(/^the site content is displayed in "([^"]*)"$/, async (lang) => {
  const homeLink = await $(`.nav-link.active`);

  if (lang === 'DE') {
    await expect(homeLink).toHaveText('Home');
  } else if (lang === 'EN') {
    await expect(homeLink).toHaveText('Home');
  } else if (lang === 'ES') {
    await expect(homeLink).toHaveText('Inicio');
  } else if (lang === 'FR') {
    await expect(homeLink).toHaveText('Accueil');
  } else if (lang === 'NL') {
    await expect(homeLink).toHaveText('Home'); 
  } else if (lang === 'TR') {
    await expect(homeLink).toHaveText('Anasayfa');
  }
});










