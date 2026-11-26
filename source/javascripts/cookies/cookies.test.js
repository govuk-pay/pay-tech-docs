/**
 * @jest-environment jsdom
 * @jest-environment-options {"url": "http://www.example.io/"}
 */

describe("Cookies", () => {
  const testCookieValues = [
    {
      cookieName: "testCookie_1",
      cookieValue: "cookieValue_1"
    },
    {
      cookieName: "testCookie_2",
      cookieValue: "cookieValue_2"
    },
    {
      cookieName: "testCookie;3",
      cookieValue: "cookieValue;3"
    }
  ]

  function clearCookies() {
    testCookieValues.forEach((cookie) => {
      const encodedCookieName = encodeURIComponent(cookie.cookieName)
      document.cookie = `${encodedCookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=example.io`
    })
  }

  beforeAll(() => {
    require('./cookies')
  })

  beforeEach(() => {
    clearCookies()
  })

  describe("getCookies", () => {
    const cookieName = testCookieValues[0].cookieName
    const cookieValue = testCookieValues[0].cookieValue

    it("should return null if the cookie is not found", () => {
      expect(window.GovUkPay.Cookies.getCookies(cookieName)).toEqual(null)
    })

    it("should return the cookie when it matches the name", () => {
      window.GovUkPay.Cookies.setCookies(cookieName, cookieValue)
      expect(window.GovUkPay.Cookies.getCookies(cookieName)).toEqual(cookieValue)
    })
  })

  describe("setCookies", () => {
    const cookieName = testCookieValues[1].cookieName
    const cookieValue = testCookieValues[1].cookieValue

    it("should encode the cookie name", () => {
      window.GovUkPay.Cookies.setCookies(testCookieValues[2].cookieName, cookieValue)
      expect(document.cookie).toEqual(`${encodeURIComponent(testCookieValues[2].cookieName)}=${cookieValue}`)
    })

    it("should encode the cookie value", () => {
      window.GovUkPay.Cookies.setCookies(cookieName, testCookieValues[2].cookieValue)
      expect(document.cookie).toEqual(`${cookieName}=${encodeURIComponent(testCookieValues[2].cookieValue)}`)
    })

    it("should set the cookie", () => {
      window.GovUkPay.Cookies.setCookies(cookieName, cookieValue)
      expect(document.cookie).toEqual(`${cookieName}=${cookieValue}`)
    })

    it("should set the cookie value to null", () => {
      window.GovUkPay.Cookies.setCookies(cookieName, null)
      expect(document.cookie).toEqual(`${cookieName}=null`)
    })

    it("should set the expiration if days are sent", () => {
      let expiresInDays = 365
      let currentDate = new Date()
      currentDate.setTime(currentDate.getTime() + (expiresInDays * 24 * 60 * 60 * 1000))

      let cookiesSet = window.GovUkPay.Cookies.setCookies(cookieName, cookieValue, { expires: expiresInDays })
    
      expect(cookiesSet).toContain('expires=')
      expect(cookiesSet).toContain(`${currentDate.getUTCFullYear()}`)
    })

    it("should not set the secure flag", () => {
      expect(window.GovUkPay.Cookies.setCookies(cookieName, cookieValue)).not.toContain("Secure")
    })
  })

  describe("getCookieDomain", () =>{
    it("should replace the 'www'", () =>{
      expect(window.GovUkPay.Cookies.getCookieDomain()).toEqual('.example.io')
    })
  })
})