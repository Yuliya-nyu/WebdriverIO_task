class HeaderComponent {
  get cartBadge() {
    return $('span[data-test="cart-quantity"]');
  }
  get signInBtn() {
    return $('//a[normalize-space()="Sign in"]');
  }
  get homeLink() {
    return $('.nav-link.active');
  }
  get categoriesMenu() {
    return $('.nav-link.dropdown-toggle');
  }
  get langSelector() {
    return $('button[data-test="language-select"]');
  }

  async getCartCount() {
    const badge = this.cartBadge;

    if (!(await badge.isDisplayed())) {
      return 0;
    }

    const n = parseInt(await badge.getText(), 10);
    return Number.isFinite(n) ? n : 0;
  }

  async waitForCartIncrement(before) {
    await browser.waitUntil(async () => (await this.getCartCount()) > before, {
      timeout: 5000,
      interval: 500,
      timeoutMsg: 'Cart counter did not increment',
    });
    return await this.getCartCount();
  }

  async selectCategory(category) {
    await this.categoriesMenu.click();

    const item = $(`//a[normalize-space()="${category}"]`);
    await item.waitForClickable({ timeout: 5000 });
    await item.click();
  }

  async selectLang(lang) {
    await this.langSelector.waitForClickable({ timeout: 5000 });
    await this.langSelector.click();

    const option = await this.langOption(lang);
    await option.waitForClickable({ timeout: 5000 });
    await option.click();
  }

  langOption(lang) {
    return $(`//a[normalize-space()="${lang}"]`);
  }

  async getLangIndicatorText() {
    const el = this.langSelector;
    await el.waitForDisplayed({ timeout: 5000 });
    return (await el.getText()).trim();
  }

  async getHomeLinkText() {
    const el = await this.homeLink;
    await el.waitForDisplayed({ timeout: 5000 });
    return (await el.getText()).trim();
  }
}
export default new HeaderComponent();
