/**
 * @jest-environment jsdom
 */

require("./cookie-banner/cookie-banner")
require("./cookies/cookies")

describe("Application JS", () => { 
  beforeEach(() => {
    // expire analytics cookie explictly, as cookies are not cleared in jest environment during the tests
    document.cookie = "govuk_pay_cookie_policy=;expires=Thu, 01 Jan 1970 00:00:00 UTC;domain=.example.org";

    window.GovUkPay.CookieBanner.checkConsentForBannerDisplay = jest.fn()
    window.initialiseGtag = jest.fn()

    // Override Document ready function in the test
    window.addEventListener = (event, callback) => {
      callback()
    }

    jest.resetModules();
  }); 

  it("should always call the checkConsentForBannerDisplay", () => {
    require("./application")

    expect(
      window.GovUkPay.CookieBanner.checkConsentForBannerDisplay.mock.calls.length
      ).toBe(1);
  });

  it("does not load Google analytics when there is no cookie consent cookie", () => {
    require("./application")

    expect(
      window.initialiseGtag.mock.calls.length
      ).toBe(0);
  });

  it("does not load Google analytics when cookie consent cookie = false", () => {
    const cookieValue = JSON.stringify({ analytics: false })
    window.GovUkPay.Cookies.setCookies("govuk_pay_cookie_policy", cookieValue);
    require("./application")

    expect(
      window.initialiseGtag.mock.calls.length
      ).toBe(0);
  });

  it("should load Google analytics when cookie consent cookie = true", () => {
    const cookieValue = JSON.stringify({ analytics: true })
    window.GovUkPay.Cookies.setCookies("govuk_pay_cookie_policy", cookieValue);

    require("./application")

    expect(
      window.initialiseGtag.mock.calls.length
    ).toBe(1);
  });
});
