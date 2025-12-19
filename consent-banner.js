// Check if user has already made a choice
document.addEventListener("DOMContentLoaded", function () {
    const consent = localStorage.getItem("urbanThreadsConsent");

    if (!consent) {
        showBanner();
    } else {
        if (consent === "granted") {
            grantConsent();
        }
        // If denied, defaults from consent-init.js stay in effect.
    }
});

function showBanner() {
    const banner = document.createElement("div");
    banner.id = "cookie-consent-banner";
    banner.innerHTML = `
      <div class="cookie-banner-content">
        <h3>We respect your privacy</h3>
        <p>We use cookies to analyze traffic and personalize content. <a href="privacy_policy.html" style="color: var(--primary-color); text-decoration: underline;">Read our policy</a>.</p>
        <div class="cookie-buttons">
            <button id="btn-deny" class="btn-secondary">Deny</button>
            <button id="btn-accept" class="btn-primary">Accept All</button>
        </div>
      </div>
    `;
    document.body.appendChild(banner);

    document.getElementById("btn-accept").addEventListener("click", function () {
        localStorage.setItem("urbanThreadsConsent", "granted");
        grantConsent();
        banner.remove();
    });

    document.getElementById("btn-deny").addEventListener("click", function () {
        localStorage.setItem("urbanThreadsConsent", "denied");
        banner.remove();
    });
}

function grantConsent() {
    gtag('consent', 'update', {
        'ad_storage': 'granted',
        'ad_user_data': 'granted',
        'ad_personalization': 'granted',
        'analytics_storage': 'granted'
    });
    // Push a custom event so GTM knows consent is updated immediately
    window.dataLayer.push({ event: 'consent_update' });
    console.log("Consent Granted");
}
