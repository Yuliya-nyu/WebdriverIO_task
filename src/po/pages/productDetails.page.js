class ProductDetailsPage {
  
  get addBtn() {
    return $("#btn-add-to-cart");
  }
  get toastMsg() {
    return $('#toast-container .toast-message[role="alert"]');
  }
  get errorToastMsg() {
    return $('#toast-container .toast-message[role="alert"]');
  }
  get addToFavBtn() {
    return $("#btn-add-to-favorites");
  }
  get productName() {
    return $('h1[data-test="product-name"]');
  }
  get productImg() {
    return $(".figure-img.img-fluid");
  }
  get unitPrice() {
    return $('span[aria-label="unit-price"]');
  }
  get description() {
    return $("#description");
  }

  async waitForProductDetails() {
    await this.productName.waitForDisplayed({ timeout: 5000 });
    await this.productImg.waitForDisplayed({ timeout: 5000 });
    await this.unitPrice.waitForDisplayed({ timeout: 5000 });
    await this.description.waitForDisplayed({ timeout: 5000 });
  }

  async addToBasket() {
    await this.addBtn.click();
  }
  async getToastText() {
    await this.toastMsg.waitForDisplayed({ timeout: 10000 });
    return (await this.toastMsg.getText()).toLowerCase();
  }
  async getErrorToastText() {
    await this.errorToastMsg.waitForDisplayed({ timeout: 10000 });
    return (await this.toastMsg.getText()).toLowerCase();
  }

  async isOpened() {
    const url = await browser.getUrl();
    return url.includes("product");
  }
}

export default new ProductDetailsPage();
