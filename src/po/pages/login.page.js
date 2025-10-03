import BasePage from "./base.page";

class LoginPage extends BasePage {
  
  get emailInput() {
    return $("#email");
  }
  get passwordInput() {
    return $("#password");
  }
  get submitBtn() {
    return $(".btnSubmit");
  }
  get errorMsg() {
    return $("#password-error");
  }

  async open() {
    await super.open("/auth/login");
  }

  async getErrorMessage() {
    return await this.errorMsg.getText();
  }
}
export default new LoginPage();
