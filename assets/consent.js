/* ==========================================================================
   RA&MTECH — Analytics bootstrap (loaded synchronously in <head>)
   Sets Google Consent Mode v2 defaults BEFORE gtag.js loads, then
   configures GA4. Shared by every page.
   ========================================================================== */
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }

// EEA/UK: everything denied until the user chooses via the consent banner.
gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied'
}, {
    region: [
        'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR',
        'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK',
        'SI', 'ES', 'SE', 'IS', 'LI', 'NO', 'GB', 'UK'
    ]
});

// Everyone else: analytics granted, ads always denied.
gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'granted',
    wait_for_update: 500
});

// GA4 config
gtag('js', new Date());
gtag('config', 'G-NVLK2NJ66N');

// Device type as a user property on all events
gtag('set', 'user_properties', {
    device_type: window.innerWidth <= 768 ? 'mobile' : 'desktop'
});
