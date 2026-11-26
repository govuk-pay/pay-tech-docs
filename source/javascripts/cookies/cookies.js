window.GovUkPay = window.GovUkPay || {}

window.GovUkPay.Cookies = (function () {

  function getCookieDomain() {
    var PROD_HOSTNAME = 'payments.service.gov.uk';
    if (window.location.hostname.includes(PROD_HOSTNAME)) {
      return PROD_HOSTNAME;
    }
    return window.location.hostname.replace(/^www\./, '.')
  }

  function setCookies(cookieName, cookieValue, options) {
    const encodedCookieName = cookieName ? encodeURIComponent(cookieName) : cookieName
    const encodedCookieValue = cookieValue ? encodeURIComponent(cookieValue) : cookieValue

    let cookieString = `${encodedCookieName}=${encodedCookieValue}; path=/; domain=${getCookieDomain()}`

    if (options && options.expires) {
      const currentDate = new Date()
      currentDate.setTime(currentDate.getTime() + (options.expires * 24 * 60 * 60 * 1000))

      cookieString = cookieString + '; expires=' + currentDate.toUTCString()
    }

    if (document.location.protocol === 'https:') {
      cookieString = cookieString + '; Secure'
    }

    document.cookie = cookieString
    return cookieString
  }

  function getCookies(cookieName) {
    let name = cookieName + "="
    let splitCookies = document.cookie.split(";")

    for (let i = 0; i < splitCookies.length; i++) {
      let cookies = splitCookies[i]

      while (cookies.charAt(0) == ' ') {
        cookies = cookies.substring(1)
      }

      if (cookies.indexOf(name) == 0) {
        return decodeURIComponent(cookies.substring(name.length, cookies.length))
      }
    }
    return null;
  }

  return {
    getCookies: getCookies,
    setCookies: setCookies,
    getCookieDomain: getCookieDomain
  }
})()