//=require ../cookies/cookies.js
//=require ../analytics

window.GovUkPay = window.GovUkPay || {}

window.GovUkPay.CookieBanner = (function () {
  const GOVUK_PAY_ANALYTICS_CONSENT_COOKIE_NAME = 'govuk_pay_cookie_policy';
  const ANALYTICS_CONSENT_BANNER_ID = 'pay-cookie-banner';

  function hasAnalyticsConsent() {
    let cookie = window.GovUkPay.Cookies.getCookies(GOVUK_PAY_ANALYTICS_CONSENT_COOKIE_NAME)
    let parsed = cookie && JSON.parse(cookie);
    return Boolean(parsed) && parsed.analytics === true;
  }

  function setAnalyticsCookie() {
    let userConsentedToAnalytics = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

    let cookieValue = JSON.stringify({
      analytics: userConsentedToAnalytics
    });

    let cookieAttributes = {
      expires: 365
    }
 
    window.GovUkPay.Cookies.setCookies(GOVUK_PAY_ANALYTICS_CONSENT_COOKIE_NAME, cookieValue, cookieAttributes);
  }

  function hideBannerIfExists(event) {
    let banner = document.querySelector(".pay-cookie-banner__confirmation")
   
    if (banner) {
      banner.style.display = 'none';
    }
    
    if (event.target) {
      event.preventDefault();
    }
  }

  function showConfirmationMessage(analyticsConsent) {
    let messagePrefix = analyticsConsent ? 'You’ve accepted analytics cookies.' : 'You told us not to use analytics cookies.';
    let $cookieBannerMainContent = document.querySelector('.pay-cookie-banner__wrapper');
    let $cookieBannerConfirmationMessage = document.querySelector('.pay-cookie-banner__confirmation-message');
    $cookieBannerConfirmationMessage.prepend(messagePrefix);
    $cookieBannerMainContent.style.display = 'none';
    let $cookieBannerConfirmationWrapper = document.querySelector('.pay-cookie-banner__confirmation');
    $cookieBannerConfirmationWrapper.style.display = 'block';
  }

  function acceptAnalyticsCookies() {
    setAnalyticsCookie(true);
    showConfirmationMessage(true);
  }

  function rejectAnalyticsCookies() {
    setAnalyticsCookie(false);
    showConfirmationMessage(false);
  }

  /**
   * ConsentProvidedCallback: function - generic callback that will be called if user provides consent
   **/
  function checkConsentForBannerDisplay() {
    let consentCookieSet = window.GovUkPay.Cookies.getCookies(GOVUK_PAY_ANALYTICS_CONSENT_COOKIE_NAME);
    let consentProvidedCallback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () { };

    let banner = document.querySelector("#".concat(ANALYTICS_CONSENT_BANNER_ID));

    if (consentCookieSet && banner) {
        banner.style.display = 'none';
    } else {
      banner.style.display = 'block'
      let acceptButton = banner.querySelector('button[data-accept-cookies=true]');
      let rejectButton = banner.querySelector('button[data-accept-cookies=false]');
      if (acceptButton && rejectButton) {
        acceptButton.addEventListener('click', acceptAnalyticsCookies);
        acceptButton.addEventListener('click', consentProvidedCallback);
        rejectButton.addEventListener('click', rejectAnalyticsCookies);
      }

      let hideCookieBannerLink = banner.querySelector('button[data-hide-cookie-banner]');
      if (hideCookieBannerLink) {
        hideCookieBannerLink.addEventListener('click', hideBannerIfExists);
      }
    }
  }

  return {
    hasAnalyticsConsent: hasAnalyticsConsent,
    checkConsentForBannerDisplay: checkConsentForBannerDisplay
  }
})()
