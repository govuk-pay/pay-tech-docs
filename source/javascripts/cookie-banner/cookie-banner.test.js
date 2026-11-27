'use strict'
const cookieBannerTemplate = require("./cookie-banner-test-template")

describe("Cookie Banner", () => {
  
  beforeEach(() => {
    document.body.innerHTML = cookieBannerTemplate

    require("./cookie-banner")
    require("../cookies/cookies")
    
    window.GovUkPay = window.GovUkPay || {}
    window.initialiseGtag = jest.fn()

    // expire analytics cookie explictly, as cookies are not cleared in jest environment during the tests
    document.cookie = "govuk_pay_cookie_policy=;expires=Thu, 01 Jan 1970 00:00:00 UTC;domain=.example.org";
  })

  describe("new user", () => {
    const cookieName = 'govuk_pay_cookie_policy'
    it("should display the banner", () => {
      window.GovUkPay.CookieBanner.checkConsentForBannerDisplay()

      const banner = document.querySelector('.pay-cookie-banner')
      expect(banner.style.display).toEqual("block")
    })

    describe("clicked YES for consent", () => {
      it("sets the consent correctly", () => {
        window.GovUkPay.CookieBanner.checkConsentForBannerDisplay()
        document.querySelector('button[data-accept-cookies="true"]').click()

        const cookieConsent =  window.GovUkPay.Cookies.getCookies(cookieName)
        const cookieConsentJson = JSON.parse(cookieConsent)
        expect(cookieConsentJson.analytics).toEqual(true)
      })

      it("displays the confirmation message", () => {
        window.GovUkPay.CookieBanner.checkConsentForBannerDisplay()
        document.querySelector('button[data-accept-cookies="true"]').click()

        const confirmationBlock = document.querySelector('.pay-cookie-banner__confirmation')
        const confirmationMessage = document.querySelector('.pay-cookie-banner__confirmation-message')
        expect(confirmationBlock.style.display).toEqual('block')
        expect(confirmationMessage.innerHTML).toContain("You’ve accepted analytics cookies.")
      })
    })

    describe("clicked NO for consent", () => {
      it("sets the consent correctly", () => {
        window.GovUkPay.CookieBanner.checkConsentForBannerDisplay()
        document.querySelector('button[data-accept-cookies="false"]').click()

        const cookieConsent =  window.GovUkPay.Cookies.getCookies(cookieName)
        const cookieConsentJson = JSON.parse(cookieConsent)
        expect(cookieConsentJson.analytics).toEqual(false)
      })

      it("displays the confirmation message", () => {
        window.GovUkPay.CookieBanner.checkConsentForBannerDisplay()
        document.querySelector('button[data-accept-cookies="false"]').click()

        const confirmationBlock = document.querySelector('.pay-cookie-banner__confirmation')
        const confirmationMessage = document.querySelector('.pay-cookie-banner__confirmation-message')
        expect(confirmationBlock.style.display).toEqual('block')
        expect(confirmationMessage.innerHTML).toContain('You told us not to use analytics cookies.')
      })
    })

    it("should hide the confirmation block", () => {
      window.GovUkPay.CookieBanner.checkConsentForBannerDisplay()
      document.querySelector('button[data-accept-cookies="true"]').click()

      const confirmationBlock = document.querySelector('.pay-cookie-banner__confirmation')
      expect(confirmationBlock.style.display).toEqual('block')

      confirmationBlock.querySelector('button[data-hide-cookie-banner="true"]').click()
      confirmationBlock.querySelector('.pay-cookie-banner__hide-button').click()
      expect(confirmationBlock.style.display).toEqual('none')
    })
  })

  describe("previous user", () => {
    it("should not display the banner if when cookie consent is false", () => {
      window.GovUkPay.Cookies.setCookies('govuk_pay_cookie_policy', '{"analytics": false}')
    
      window.GovUkPay.CookieBanner.checkConsentForBannerDisplay()
      const banner = document.querySelector('.pay-cookie-banner')
      
      expect(banner.style.display).toEqual("none")
    })

    it("should not display the banner if when cookie consent is true", () => {
      window.GovUkPay.Cookies.setCookies('govuk_pay_cookie_policy', '{"analytics": true}')
    
      window.GovUkPay.CookieBanner.checkConsentForBannerDisplay()
      const banner = document.querySelector('.pay-cookie-banner')
      
      expect(banner.style.display).toEqual("none")
    })
  })
  
})