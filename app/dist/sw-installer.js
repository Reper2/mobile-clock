"use strict";
window.addEventListener("load", () => {
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("/desktop-clock/sw.js")
            .then(reg => {
            console.groupCollapsed("Service Worker Status");
            if (reg.installing)
                console.log("Service worker installing");
            if (reg.waiting)
                console.log("Service worker installed");
            reg.update();
            if (reg.active)
                console.log("Service worker active");
            console.log("Scope:", reg.scope);
            console.groupEnd();
        })
            .catch(console.error);
    }
});
//# sourceMappingURL=sw-installer.js.map