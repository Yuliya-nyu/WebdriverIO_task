import BasePage from "./base.page";

class HomePage extends BasePage {
  get firstProductLink() {
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

  async openFirstProduct() {
    await this.open("/");
    await this.firstProductLink.click();
  }

  async search(product) {
    await this.searchInput.setValue(product);
    await this.searchBtn.scrollIntoView();
    await this.searchBtn.click();
  }

  async getSearchResults() {
    const texts = [];

    for await (const el of this.searchReults) {
      texts.push(await el.getText());
    }
    return texts;
  }
}
export default new HomePage();
