/**
 * @jest-environment jsdom
 * @jest-environment-options {"url": "https://www.payments.service.gov.uk"}
 */

describe("Cookies", () => {
  const cookieName = "testCookie_1"
  const cookieValue = "cookieValue_1"

  function clearCookies() {
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=example.io`
  }

  beforeAll(() => {
    require('./cookies')
  })

  beforeEach(() => {
    clearCookies()
  })

  describe("setCookies", () => {
    it("should set the secure flag", () => {
      expect(window.GovUkPay.Cookies.setCookies(cookieName, cookieValue)).toContain("Secure")
    })
  })

  describe("getCookieDomain", () =>{
    it("should return the payment service domain", () =>{
      expect(window.GovUkPay.Cookies.getCookieDomain()).toEqual('payments.service.gov.uk')
    })
  })
})