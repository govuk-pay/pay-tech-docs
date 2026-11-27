//= require govuk_tech_docs
//= require analytics
//= require cookie-banner/cookie-banner
//= require cookies/cookies

window.addEventListener('DOMContentLoaded', function() {
  if (window.GovUkPay) {
    window.GovUkPay.CookieBanner.checkConsentForBannerDisplay(window.initialiseGtag)

    if (window.GovUkPay.CookieBanner.hasAnalyticsConsent()) {
      window.initialiseGtag()
    }
   }
})
