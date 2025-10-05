class CategoryPage {
  get heading() {
    return $("//h1 | //h2");
  }
  get productCards() {
    return $$("div.card");
  }
  get emptyState() {
    return $('//*[contains(text(), "no products found")]');
  }

  async isCategoryDisplayed(category) {
    const slug = category
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    const url = await browser.getUrl();
    await expect(url).toContain(slug);
    
    return this.heading.waitForDisplayed({ timeout: 5000 });
  }

  async waitForResults() {
    await browser.waitUntil(
      async () => {
        const cards = await this.productCards;
        if (cards.length > 0) return true;

        try {
          return await this.emptyState.isDisplayed();
        } catch {
          return false;
        }
      },
      {
        timeout: 5000,
        interval: 250,
        timeoutMsg: 'Neither products nor "no products found" message appeared',
      }
    );
  }

  async expectProductsOrEmpty(assert) {
    await this.waitForResults();
    const cards = await this.productCards;

    if (cards.length > 0) {
      assert.isAbove(cards.length, 0, "At least one product should be found");

      for (const card of cards) {
        const titleEl = await card.$(
          '[data-test="product-name"], h5.card-title'
        );
        const visible = await titleEl.isDisplayed();
        assert.isTrue(visible, "Product title should be visible");
      }
    } else {
      assert.isTrue(
        await this.emptyState.isDisplayed(),
        '"No products found" message should be visible'
      );
    }
  }
}

export default new CategoryPage();
