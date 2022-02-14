/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {
  /***************************************************************************
   *                                                                          *
   * Make the view located at `views/homepage.ejs` your home page.            *
   *                                                                          *
   * (Alternatively, remove this and add an `index.html` file in your         *
   * `assets` directory)                                                      *
   *                                                                          *
   ***************************************************************************/

  // '/': { view: 'pages/homepage' },

  /***************************************************************************
   *                                                                          *
   * More custom routes here...                                               *
   * (See https://sailsjs.com/config/routes for examples.)                    *
   *                                                                          *
   * If a request to a URL doesn't match any of the routes in this file, it   *
   * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
   * not match any of those, it is matched against static assets.             *
   *                                                                          *
   ***************************************************************************/
  "POST /test/send": { action: "test/send-notification" },

  ///General routes
  // "GET /": { action: "user/test-api" },
  "POST /general/add-notification": { action: "general/add-notification" },

  //#region Admin routes

  "POST /admin/login": { action: "super-admin/login" },

  "POST /admin/add-subcategory": { action: "super-admin/add-subcategory" },
  "POST /admin/categories/add": { action: "super-admin/add-category" },
  "POST /admin/categories/update/:id": { action: "super-admin/edit-category" },
  "POST /admin/categories/get": { action: "super-admin/get-categories" },
  "POST /admin/categories/get/:id": { action: "super-admin/get-category" },
  "POST /admin/categories/delete/:id": {
    action: "super-admin/delete-category",
  },
  "POST /admin/categories/delete": {
    action: "super-admin/delete-categories",
  },
  "POST /admin/category-timeouts/get/:id": {
    action: "super-admin/get-category-timeout",
  },
  "POST /admin/category-timeouts/add": {
    action: "super-admin/edit-category-timeouts",
  },
  "POST /admin/category-timeouts/update/:id": {
    action: "super-admin/edit-category-timeouts",
  },
  "POST /admin/change-vendor-status": {
    action: "super-admin/change-vendor-status",
  },
  "POST /admin/upload-file": { action: "super-admin/upload-file" },
  "POST /admin/add-faq": { action: "super-admin/add-faq" },
  "POST /admin/users/get": { action: "super-admin/get-users" },
  "POST /admin/users/get/:id": { action: "super-admin/get-user" },
  "POST /admin/users/add": { action: "super-admin/add-user" },
  "POST /admin/users/update/:id": { action: "super-admin/update-user" },
  "POST /admin/users": { action: "super-admin/add-user" },
  "POST /admin/users/delete/:id": { action: "super-admin/delete-user" },
  "POST /admin/users/delete": { action: "super-admin/delete-users" },
  "POST /admin/roles": { action: "super-admin/create-role" },
  "POST /admin/roles/get": { action: "super-admin/get-roles" },
  "POST /admin/roles/get/:id": { action: "super-admin/get-role" },
  "POST /admin/roles/update/:id": { action: "super-admin/update-role" },
  "POST /admin/roles/delete/:id": { action: "super-admin/delete-role" },
  "POST /admin/create-permissions": { action: "vt-admin/create-permission" },
  "POST /admin/permissions": { action: "super-admin/assign-permissions" },
  "PUT /admin/permissions/:id": { action: "vt-admin/update-permission" },
  "GET /admin/permissions/:id": { action: "super-admin/get-permission" },
  "GET /admin/permissions": { action: "super-admin/get-permissions" },
  "DELETE /admin/permissions/:id": { action: "vt-admin/delete-permission" },
  "POST /admin/vendors/get": { action: "super-admin/get-vendors" },
  "POST /admin/vendors/get/:id": { action: "super-admin/get-vendor" },
  "POST /admin/vendors/update/:id": { action: "super-admin/edit-vendor" },
  "POST /admin/vendors/delete/:id": { action: "super-admin/delete-vendor" },
  "POST /admin/vendors/delete": { action: "super-admin/delete-vendors" },
  "POST /admin/drivers/get": { action: "super-admin/get-drivers" },
  "POST /admin/drivers/add": { action: "super-admin/add-driver" },
  "POST /admin/drivers/update/:id": { action: "super-admin/edit-driver" },
  "POST /admin/drivers/get/:id": { action: "super-admin/get-driver" },
  "POST /admin/drivers/delete/:id": { action: "super-admin/delete-driver" },
  "POST /admin/drivers/delete": { action: "super-admin/delete-drivers" },
  "POST /admin/orders/get": { action: "super-admin/get-proposals" },
  "POST /admin/orders/get/:id": { action: "super-admin/get-proposal" },
  "POST /admin/orders/delete/:id": { action: "super-admin/delete-proposal" },
  "POST /admin/orders/delete": { action: "super-admin/delete-proposals" },
  "POST /admin/order-items/get": { action: "super-admin/get-proposal-items" },
  "POST /admin/rfps/get": { action: "super-admin/get-rfps" },
  "POST /admin/rfps/get/:id": { action: "super-admin/get-rfp" },
  "POST /admin/rfps/delete/:id": { action: "super-admin/delete-rfp" },
  "POST /admin/rfps/delete": { action: "super-admin/delete-rfps" },
  "POST /admin/rfp-items/get": { action: "super-admin/get-rfp-items" },
  "POST /admin/vehicles/get": { action: "super-admin/get-vehicles" },
  "POST /admin/send-message-to-vendor": {
    action: "super-admin/send-message",
  },
  "POST /admin/messages/add": {
    action: "super-admin/send-message",
  },
  "POST /admin/countries/get": { action: "super-admin/get-countries" },
  "POST /admin/waspha-countries/get": {
    action: "super-admin/get-waspha-countries",
  },
  "POST /admin/waspha-countries/add": {
    action: "super-admin/add-waspha-country",
  },
  "POST /admin/waspha-countries/delete/:id": {
    action: "super-admin/delete-waspha-country",
  },
  "POST /admin/waspha-countries/delete": {
    action: "super-admin/delete-waspha-countries",
  },
  "POST /admin/wallets/get": { action: "super-admin/get-wallets" },
  "POST /admin/reviews/get": { action: "super-admin/get-reviews" },
  "POST /admin/translations/get": { action: "super-admin/get-translations" },
  "POST /admin/translations/get/:id": { action: "super-admin/get-translation" },
  "POST /admin/translations/delete/:id": {
    action: "super-admin/delete-translation",
  },
  "POST /admin/translations/add": { action: "super-admin/add-translation" },
  "POST /admin/translations/update/:id": {
    action: "super-admin/edit-translation",
  },
  "POST /admin/addresses/get": { action: "super-admin/get-addresses" },
  "POST /admin/notification-templates/get": {
    action: "super-admin/get-notification-templates",
  },
  "POST /admin/notification-templates/get/:id": {
    action: "super-admin/get-notification-template",
  },
  "POST /admin/notification-templates/update/:id": {
    action: "super-admin/edit-notification-template",
  },
  "POST /admin/notification-templates/delete/:id": {
    action: "super-admin/delete-notification-template",
  },
  "POST /admin/promo-codes/get": {
    action: "super-admin/get-promo-codes",
  },
  "POST /admin/promo-codes/add": { action: "super-admin/add-promo-code" },
  "POST /admin/promo-codes/get/:id": { action: "super-admin/get-promo-code" },
  "POST /admin/promo-codes/delete/:id": {
    action: "super-admin/delete-promo-code",
  },
  "POST /admin/promo-codes/delete": {
    action: "super-admin/delete-promo-codes",
  },
  "POST /admin/promo-codes/update/:id": {
    action: "super-admin/edit-promo-code",
  },
  "POST /admin/reports/get": {
    action: "super-admin/get-reports",
  },
  "POST /admin/reports/get/:id": {
    action: "super-admin/get-report",
  },
  "POST /admin/delivery-partner-reports/get": {
    action: "super-admin/get-driver-reports",
  },
  "POST /admin/delivery-partner-reports/get/:id": {
    action: "super-admin/get-driver-report",
  },
  "POST /admin/screen-contents/get": {
    action: "super-admin/get-screen-contents",
  },
  "POST /admin/screen-contents/get/:id": {
    action: "super-admin/get-screen-content",
  },
  "POST /admin/screen-contents/update/:id": {
    action: "super-admin/edit-screen-content",
  },
  "POST /admin/change-online-status": {
    action: "super-admin/change-online-status",
  },
  "POST /admin/edit-store-attributes": {
    action: "super-admin/edit-store-attributes",
  },
  "POST /admin/settings/get": {
    action: "super-admin/get-settings",
  },
  "POST /admin/settings/get/:id": {
    action: "super-admin/get-setting",
  },
  "POST /admin/settings/update/:id": {
    action: "super-admin/edit-setting",
  },
  "POST /admin/commissions/get": {
    action: "super-admin/get-commissions",
  },
  "POST /admin/commissions/get/:id": {
    action: "super-admin/get-commission",
  },
  "POST /admin/commissions/add": {
    action: "super-admin/add-commission",
  },
  "POST /admin/commissions/update/:id": {
    action: "super-admin/edit-commission",
  },
  "POST /admin/driver-commissions/get": {
    action: "super-admin/get-driver-commissions",
  },
  "POST /admin/driver-commissions/get/:id": {
    action: "super-admin/get-driver-commission",
  },
  "POST /admin/driver-commissions/add": {
    action: "super-admin/add-driver-commission",
  },
  "POST /admin/driver-commissions/update/:id": {
    action: "super-admin/edit-driver-commission",
  },
  "POST /admin/cancellation-reasons/get": {
    action: "super-admin/get-cancellation-reasons",
  },
  "POST /admin/cancellation-reasons/get/:id": {
    action: "super-admin/get-cancellation-reason",
  },
  "POST /admin/cancellation-reason-items/get/:id": {
    action: "super-admin/get-cancellation-reason-item",
  },
  "POST /admin/cancellation-reason-items/update/:id": {
    action: "super-admin/edit-cancellation-reason-item",
  },
  "POST /admin/make-payment-to-vendor": {
    action: "super-admin/make-payment-to-vendor",
  },
  "POST /admin/receive-payment-from-vendor": {
    action: "super-admin/receive-payment-from-vendor",
  },
  "POST /admin/change-driver-status": {
    action: "super-admin/change-driver-status",
  },
  "POST /admin/add-zone-option": {
    action: "super-admin/add-zone-option",
  },
  "POST /admin/zones/get": {
    action: "super-admin/get-zones",
  },
  "POST /admin/zones/get/:id": {
    action: "super-admin/get-zone",
  },
  "POST /admin/zones/add": {
    action: "super-admin/add-zone",
  },
  "POST /admin/zones/update/:id": {
    action: "super-admin/edit-zone",
  },
  "POST /admin/zones/delete/:id": {
    action: "super-admin/delete-zone",
  },
  "POST /admin/delivery-vehicle-charges/get": {
    action: "super-admin/get-delivery-vehicle-charges",
  },
  "POST /admin/delivery-vehicle-charges/get/:id": {
    action: "super-admin/get-delivery-vehicle-charge",
  },
  "POST /admin/delivery-vehicle-charges/add": {
    action: "super-admin/add-delivery-vehicle-charge",
  },
  "POST /admin/delivery-vehicle-charges/delete/:id": {
    action: "super-admin/delete-delivery-vehicle-charge",
  },
  "POST /admin/delivery-vehicle-charges/update/:id": {
    action: "super-admin/edit-delivery-vehicle-charge",
  },
  "POST /admin/delivery-vehicles/get": {
    action: "super-admin/get-delivery-vehicles",
  },
  "POST /admin/delivery-vehicles/get/:id": {
    action: "super-admin/get-delivery-vehicle",
  },
  "POST /admin/delivery-vehicles/add": {
    action: "super-admin/add-delivery-vehicle",
  },
  "POST /admin/delivery-vehicles/delete/:id": {
    action: "super-admin/delete-delivery-vehicle",
  },
  "POST /admin/delivery-vehicles/update/:id": {
    action: "super-admin/edit-delivery-vehicle",
  },
  "POST /admin/update-vendor-subscription-waspha-express": {
    action: "super-admin/update-vendor-subscription-waspha-express",
  },
  "POST /admin/update-vendor-services": {
    action: "super-admin/update-vendor-services",
  },
  "POST /admin/ads/get": {
    action: "super-admin/get-ads",
  },
  "POST /admin/ads/get/:id": {
    action: "super-admin/get-ad",
  },
  "POST /admin/ads/add": {
    action: "super-admin/add-ad",
  },
  "POST /admin/ads/delete/:id": {
    action: "super-admin/delete-ad",
  },
  "POST /admin/ads/update/:id": {
    action: "super-admin/edit-ad",
  },
  "POST /admin/store-products/get": {
    action: "super-admin/get-store-products",
  },
  "POST /admin/store-products/get/:id": {
    action: "super-admin/get-store-product",
  },
  "POST /admin/store-products/add": {
    action: "super-admin/add-store-product",
  },
  "POST /admin/store-products/delete/:id": {
    action: "super-admin/delete-store-product",
  },
  "POST /admin/store-products/update/:id": {
    action: "super-admin/edit-store-product",
  },
  "POST /admin/store-categories/get": {
    action: "super-admin/get-store-categories",
  },
  "POST /admin/store-categories/get/:id": {
    action: "super-admin/get-store-category",
  },
  "POST /admin/store-categories/add": {
    action: "super-admin/add-store-category",
  },
  "POST /admin/store-categories/delete/:id": {
    action: "super-admin/delete-store-category",
  },
  "POST /admin/store-categories/update/:id": {
    action: "super-admin/edit-store-category",
  },

  "POST /admin/admins/get": {
    action: "super-admin/get-admins",
  },
  "POST /admin/admins/get/:id": {
    action: "super-admin/get-admin",
  },
  "POST /admin/admins/add": {
    action: "super-admin/add-admin",
  },
  "POST /admin/admins/update/:id": {
    action: "super-admin/edit-admin",
  },
  "POST /admin/admins/delete/:id": {
    action: "super-admin/delete-admin",
  },
  //#endregion

  ////User routes
  "POST /user": { action: "user" },
  "GET /user/get/:id": { action: "user/get" },
  "POST /user/create": { action: "user/create" },
  "PUT /user/update": { action: "user/update" },
  "DELETE /user/delete": { action: "user/delete" },
  "POST /user/signup-request": { action: "user/signup-request" },
  "POST /user/resend-otp": { action: "user/resend-otp" },
  "POST /user/forget-password": { action: "user/forget-password" },
  "POST /user/verify-reset-password": { action: "user/verify-reset-password" },
  "POST /user/reset-password": { action: "user/reset-password" },
  "POST /user/change-password": { action: "user/change-password" },
  "POST /user/change-language": { action: "user/change-language" },
  "POST /user/signup": { action: "user/signup" },
  "POST /user/login": { action: "user/login" },
  "POST /user/logout": { action: "user/logout" },
  "POST /user/social-login": { action: "user/social-login" },
  "POST /user/resume-access-token": { action: "user/resume-access-token" },
  "POST /user/create-rfp": { action: "user/create-rfp" },
  "POST /user/cancel-rfp": { action: "user/cancel-rfp" },
  "POST /user/respond-proposal": { action: "user/respond-proposal" },
  "POST /user/create-review-rating": { action: "user/create-review-rating" },
  "POST /user/get-nearby-stores": { action: "user/get-nearby-stores" },
  "POST /user/store-quick-info": { action: "user/store-quick-info" },
  "POST /user/store-detail-info": { action: "user/store-detail-info" },
  "POST /user/store-policy": { action: "user/store-policy" },
  "POST /user/get-assigned-stores": { action: "user/get-assigned-stores" },
  "POST /user/store-reviews-ratings": { action: "user/store-reviews-ratings" },
  "POST /user/store-categories": { action: "user/store-categories" },
  "POST /user/category-detail": { action: "user/category-detail" },
  "POST /user/search-products": { action: "user/search-products" },
  "POST /user/store-products": { action: "user/store-products" },
  "POST /user/edit-profile": { action: "user/edit-profile" },
  "POST /user/add-location": { action: "user/add-location" },
  "POST /user/edit-location": { action: "user/edit-location" },
  "POST /user/delete-location": { action: "user/delete-location" },
  "POST /user/locations": { action: "user/locations" },
  "POST /user/order-listing": { action: "user/order-listing" },
  "POST /user/order-detail": { action: "user/order-detail" },
  "POST /user/order-status": { action: "user/order-status" },
  "POST /user/my-rfp-listing": { action: "user/my-orders-listing" },
  "POST /user/my-order-detail": { action: "user/my-order-detail" },
  "POST /user/my-order-proposals": { action: "user/my-order-proposals" },
  "POST /user/my-order-proposal-detail": {
    action: "user/my-order-proposal-detail",
  },
  "POST /user/my-order-history": { action: "user/my-order-history" },
  "POST /user/my-order-history-detail": {
    action: "user/my-order-history-detail",
  },
  "POST /user/revise-proposal": { action: "user/revise-proposal" },
  "POST /user/submit-contact-us": { action: "user/submit-contact-us" },
  "POST /user/faq-listing": { action: "user/faq-listing" },
  "POST /user/update-avatar": { action: "user/update-avatar" },
  "POST /user/close-rfp": { action: "user/close-rfp" },
  "POST /user/make-payment": { action: "user/make-payment" },
  "POST /user/device-token": { action: "user/device-token" },
  "POST /user/queue-status": { action: "user/queue-status" },
  "POST /user/reviews-ratings": { action: "user/reviews-ratings" },
  "POST /user/waspha-terms-n-conditions": {
    action: "user/waspha-terms-n-conditions",
  },
  "POST /user/waspha-privacy-policy": { action: "user/waspha-privacy-policy" },
  "POST /user/waspha-cookie-policy": { action: "user/waspha-cookie-policy" },
  "POST /user/waspha-copyright-policy": {
    action: "user/waspha-copyright-policy",
  },
  "POST /user/waspha-gdpr-compliance": {
    action: "user/waspha-gdpr-compliance",
  },
  "POST /user/notification-listing": { action: "user/notification-listing" },
  "POST /user/mark-as-read": { action: "user/mark-as-read" },
  "POST /user/is-order-rated": { action: "user/is-order-rated" },
  "POST /user/get-wallet": { action: "user/get-wallet" },
  "POST /user/app-settings": { action: "user/app-settings" },
  "POST /user/translations": { action: "user/translations" },
  //"POST /user/verify-payment": { action: "user/verify-payment" },
  "POST /user/verify-payment/:proposal_id": { action: "user/verify-payment" },
  "POST /user/promo-codes": { action: "user/promo-codes" },
  "POST /user/apply-promo-code": { action: "user/apply-promo-code" },
  "POST /user/active-orders": { action: "user/active-orders" },
  "POST /user/save-is-device-active": { action: "user/save-is-device-active" },
  "POST /user/get-ad": { action: "user/get-ad" },
  "POST /user/change-contact-or-email": {
    action: "user/change-contact-or-email",
  },
  "POST /user/verify-contact-or-email": {
    action: "user/verify-contact-or-email",
  },

  "POST /user/test-api": { action: "user/test-api" },
  "GET /user/test-view": { action: "user/test-view" },

  ////Vendor routes
  "POST /vendor/app-settings": { action: "vendor/app-settings" },
  "POST /vendor/signup-request": { action: "vendor/signup-request" },
  "POST /vendor/signup": { action: "vendor/signup" },
  "POST /vendor/login": { action: "vendor/login" },
  "POST /vendor/logout": { action: "vendor/logout" },
  "POST /vendor/device-token": { action: "vendor/device-token" },
  "POST /vendor/social-login": { action: "vendor/social-login" },
  "POST /vendor/resume-access-token": { action: "vendor/resume-access-token" },
  "POST /vendor/resend-otp": { action: "vendor/resend-otp" },
  "POST /vendor/forget-password": { action: "vendor/forget-password" },
  "POST /vendor/verify-reset-password": {
    action: "vendor/verify-reset-password",
  },
  "POST /vendor/reset-password": { action: "vendor/reset-password" },
  "POST /vendor/change-password": { action: "vendor/change-password" },
  "POST /vendor/add-store": { action: "vendor/add-store" },
  "POST /vendor/business-registration": { action: "vendor/add-store" },
  "POST /vendor/edit-business-profile": { action: "vendor/edit-store" },
  "POST /vendor/edit-profile": { action: "vendor/edit-profile" },
  "POST /vendor/update-store-attributes": {
    action: "vendor/update-store-attributes",
  },
  "POST /vendor/add-business-category": {
    action: "vendor/add-business-category",
  },
  "POST /vendor/edit-business-category": {
    action: "vendor/edit-business-category",
  },
  "POST /vendor/delete-business-category": {
    action: "vendor/delete-business-category",
  },
  "POST /vendor/business-category-listing": {
    action: "vendor/business-category-listing",
  },
  "POST /vendor/store-products": { action: "vendor/store-products" },
  "POST /vendor/store-catalog": { action: "vendor/store-products" },
  "POST /vendor/add-product": { action: "vendor/add-product" },
  "POST /vendor/edit-product": { action: "vendor/edit-product" },
  "POST /vendor/delete-product": { action: "vendor/delete-product" },
  "POST /vendor/create-proposal": { action: "vendor/create-proposal" },
  "POST /vendor/update-proposal": { action: "vendor/update-proposal" },
  "POST /vendor/confirm-bill": { action: "vendor/confirm-bill" },
  "POST /vendor/change-proposal-delivery-mode": {
    action: "vendor/change-proposal-delivery-mode",
  },
  "POST /vendor/proposal-listing": { action: "vendor/proposal-listing" },
  "POST /vendor/proposal-detail": { action: "vendor/proposal-detail" },
  "POST /vendor/proposal-invoice": { action: "vendor/proposal-invoice" },
  "POST /vendor/rfp-listing": { action: "vendor/rfp-listing" },
  "POST /vendor/rfp-detail": { action: "vendor/rfp-detail" },
  "POST /vendor/store-reviews-ratings": {
    action: "vendor/store-reviews-ratings",
  },
  "POST /vendor/create-review-rating": {
    action: "vendor/create-review-rating",
  },
  "POST /vendor/store-profile": { action: "vendor/store-profile" },
  "POST /vendor/store-dashboard": { action: "vendor/store-dashboard" },
  "POST /vendor/store-earning": { action: "vendor/store-earning" },
  "POST /vendor/add-driver": { action: "vendor/add-driver" },
  "POST /vendor/edit-driver": { action: "vendor/edit-driver" },
  "POST /vendor/delete-driver": { action: "vendor/delete-driver" },
  "POST /vendor/store-drivers": { action: "vendor/store-drivers" },
  "POST /vendor/assign-driver": { action: "vendor/assign-driver" },
  "POST /vendor/faq-listing": { action: "vendor/faq-listing" },
  "POST /vendor/respond-rfp": { action: "vendor/respond-rfp" },
  "POST /vendor/submit-contact-us": { action: "vendor/submit-contact-us" },
  "POST /vendor/change-language": { action: "vendor/change-language" },
  "POST /vendor/search-products": { action: "vendor/search-products" },
  "POST /vendor/trending-products": { action: "vendor/trending-products" },
  "POST /vendor/notification-listing": {
    action: "vendor/notification-listing",
  },
  "POST /vendor/mark-as-read": { action: "vendor/mark-as-read" },
  "POST /vendor/mark-as-viewed": { action: "vendor/mark-as-viewed" },
  "POST /vendor/get-count-marked-as-viewed": {
    action: "vendor/get-count-marked-as-viewed",
  },
  "POST /vendor/change-proposal-status": {
    action: "vendor/change-proposal-status",
  },
  "POST /vendor/waspha-terms-n-conditions": {
    action: "vendor/waspha-terms-n-conditions",
  },
  "POST /vendor/waspha-privacy-policy": {
    action: "vendor/waspha-privacy-policy",
  },
  "POST /vendor/waspha-cookie-policy": {
    action: "vendor/waspha-cookie-policy",
  },
  "POST /vendor/waspha-copyright-policy": {
    action: "vendor/waspha-copyright-policy",
  },
  "POST /vendor/waspha-gdpr-compliance": {
    action: "vendor/waspha-gdpr-compliance",
  },
  "POST /vendor/is-order-rated": { action: "vendor/is-order-rated" },
  "POST /vendor/translations": { action: "vendor/translations" },
  "POST /vendor/promo-codes": { action: "vendor/promo-codes" },
  "POST /vendor/active-orders": { action: "vendor/active-orders" },
  "POST /vendor/create-traditional-order": {
    action: "vendor/create-traditional-order",
  },
  "POST /vendor/traditional-order-listing": {
    action: "vendor/traditional-order-listing",
  },
  "POST /vendor/traditional-order-detail": {
    action: "vendor/traditional-order-detail",
  },
  "POST /vendor/assign-waspha-driver": {
    action: "vendor/assign-waspha-driver",
  },
  "POST /vendor/cancel-order": {
    action: "vendor/cancel-order",
  },
  "POST /vendor/get-waspha-driver-vehicles": {
    action: "vendor/get-waspha-driver-vehicles",
  },
  "POST /vendor/is-order-assigned": {
    action: "vendor/is-order-assigned",
  },
  "POST /vendor/save-is-device-active": {
    action: "vendor/save-is-device-active",
  },
  "POST /vendor/get-ad": { action: "vendor/get-ad" },
  "POST /vendor/change-contact-or-email": {
    action: "vendor/change-contact-or-email",
  },
  "POST /vendor/verify-contact-or-email": {
    action: "vendor/verify-contact-or-email",
  },

  ////Driver routes
  "POST /driver/app-settings": { action: "driver/app-settings" },
  "POST /driver/signup-request": { action: "driver/signup-request" },
  "POST /driver/resend-otp": { action: "driver/resend-otp" },
  "POST /driver/signup": { action: "driver/signup" },
  "POST /driver/login": { action: "driver/login" },
  "POST /driver/device-token": { action: "driver/device-token" },
  "POST /driver/logout": { action: "driver/logout" },
  "POST /driver/social-login": { action: "driver/social-login" },
  "POST /driver/resume-access-token": { action: "driver/resume-access-token" },
  "POST /driver/forget-password": { action: "driver/forget-password" },
  "POST /driver/verify-reset-password": {
    action: "driver/verify-reset-password",
  },
  "POST /driver/reset-password": { action: "driver/reset-password" },
  "POST /driver/change-password": { action: "driver/change-password" },
  "POST /driver/change-language": { action: "driver/change-language" },
  "POST /driver/submit-contact-us": { action: "driver/submit-contact-us" },
  "POST /driver/faq-listing": { action: "driver/faq-listing" },
  "POST /driver/change-online-status": {
    action: "driver/change-online-status",
  },
  "POST /driver/order-request": { action: "driver/order-request" },
  "POST /driver/respond-order-request": {
    action: "driver/respond-order-request",
  },
  "POST /driver/cancel-order-request": {
    action: "driver/cancel-order-request",
  },
  "POST /driver/change-ride-status": { action: "driver/change-ride-status" },
  "POST /driver/earnings": { action: "driver/earnings" },
  "POST /driver/trips-earnings": { action: "driver/trips-earnings" },
  "POST /driver/trips-n-orders": { action: "driver/trips-n-orders" },
  "POST /driver/profile": { action: "driver/profile" },
  "POST /driver/edit-profile": { action: "driver/edit-profile" },
  "POST /driver/change-vehicle": { action: "driver/change-vehicle" },
  "POST /driver/reviews-ratings": { action: "driver/reviews-ratings" },
  "POST /driver/create-review-rating": {
    action: "driver/create-review-rating",
  },
  "POST /driver/notification-listing": {
    action: "driver/notification-listing",
  },
  "POST /driver/mark-as-read": { action: "driver/mark-as-read" },
  "POST /driver/add-to-wallet": { action: "driver/add-to-wallet" },
  "POST /driver/waspha-terms-n-conditions": {
    action: "driver/waspha-terms-n-conditions",
  },
  "POST /driver/waspha-privacy-policy": {
    action: "driver/waspha-privacy-policy",
  },
  "POST /driver/waspha-cookie-policy": {
    action: "driver/waspha-cookie-policy",
  },
  "POST /driver/waspha-copyright-policy": {
    action: "driver/waspha-copyright-policy",
  },
  "POST /driver/waspha-gdpr-compliance": {
    action: "driver/waspha-gdpr-compliance",
  },
  "POST /driver/is-order-rated": {
    action: "driver/is-order-rated",
  },
  "POST /driver/update-avatar": { action: "driver/update-avatar" },
  "POST /driver/translations": { action: "driver/translations" },
  "POST /driver/active-orders": { action: "driver/active-orders" },
  "POST /driver/save-zone": { action: "driver/save-zone" },
  "POST /driver/get-ad": { action: "driver/get-ad" },
  "POST /driver/change-contact-or-email": {
    action: "driver/change-contact-or-email",
  },
  "POST /driver/verify-contact-or-email": {
    action: "driver/verify-contact-or-email",
  },
};
