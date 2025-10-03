import BasePage from "./base.page";

class HomePage extends BasePage {
  
  get anyProductLink() {
    return $('//a[contains(@href,"/product/")]');
  }

  get searchInput() {
    return $("#search-query");
  }
  get searchBtn() {
    return $('button[type="submit"]');
  }
  get searchTerm() {
    return $('span[data-test="search-term"]');
  }
  get searchReults() {
    return $$('[data-test="search_completed"] .card-title');
  }
  get noResultsMsg() {
    return $('//div[@data-test="no-results"]');
  }

  async clickAnyProduct() {
    await this.anyProductLink.click();
  }

  async openAnyProduct() {
    await this.open("/");
    await this.clickAnyProduct();
  }

  async search(product) {
    await this.searchInput.setValue(product);
    await this.searchBtn.scrollIntoView();
    await this.searchBtn.click();
  }

  async getSearchTerm() {
    return this.searchTerm.getText();
  }

  async getSearchResults() {
    const elements = await this.searchReults; // массив элементов
    const texts = [];

    for (const el of elements) {
      texts.push(await el.getText());
    }
    return texts;
  }

  async hasNoResults() {
    const results = await this.searchReults;
    return results.length === 0;
  }
}
export default new HomePage();
