/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/debounce-animation-frame/dist/debounceAnimationFrame.js":
/*!******************************************************************************!*\
  !*** ./node_modules/debounce-animation-frame/dist/debounceAnimationFrame.js ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, exports) => {

Object.defineProperty(exports, "__esModule", ({ value: true }));
const debounceAnimationFrame = (fn) => {
    let timeout;
    const debouncedFn = (...args) => {
        cancelAnimationFrame(timeout);
        return new Promise(resolve => {
            timeout = requestAnimationFrame(() => {
                const result = fn(...args);
                resolve(result);
            });
        });
    };
    return debouncedFn;
};
exports["default"] = debounceAnimationFrame;


/***/ }),

/***/ "./node_modules/debounce-animation-frame/dist/index.js":
/*!*************************************************************!*\
  !*** ./node_modules/debounce-animation-frame/dist/index.js ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const debounceAnimationFrame_1 = __importDefault(__webpack_require__(/*! ./debounceAnimationFrame */ "./node_modules/debounce-animation-frame/dist/debounceAnimationFrame.js"));
exports["default"] = debounceAnimationFrame_1.default;


/***/ }),

/***/ "./node_modules/instant.page/instantpage.js":
/*!**************************************************!*\
  !*** ./node_modules/instant.page/instantpage.js ***!
  \**************************************************/
/***/ (() => {

/*! instant.page v5.1.1 - (C) 2019-2020 Alexandre Dieulot - https://instant.page/license */

let mouseoverTimer
let lastTouchTimestamp
const prefetches = new Set()
const prefetchElement = document.createElement('link')
const isSupported = prefetchElement.relList && prefetchElement.relList.supports && prefetchElement.relList.supports('prefetch')
                    && window.IntersectionObserver && 'isIntersecting' in IntersectionObserverEntry.prototype
const allowQueryString = 'instantAllowQueryString' in document.body.dataset
const allowExternalLinks = 'instantAllowExternalLinks' in document.body.dataset
const useWhitelist = 'instantWhitelist' in document.body.dataset
const mousedownShortcut = 'instantMousedownShortcut' in document.body.dataset
const DELAY_TO_NOT_BE_CONSIDERED_A_TOUCH_INITIATED_ACTION = 1111

let delayOnHover = 65
let useMousedown = false
let useMousedownOnly = false
let useViewport = false

if ('instantIntensity' in document.body.dataset) {
  const intensity = document.body.dataset.instantIntensity

  if (intensity.substr(0, 'mousedown'.length) == 'mousedown') {
    useMousedown = true
    if (intensity == 'mousedown-only') {
      useMousedownOnly = true
    }
  }
  else if (intensity.substr(0, 'viewport'.length) == 'viewport') {
    if (!(navigator.connection && (navigator.connection.saveData || (navigator.connection.effectiveType && navigator.connection.effectiveType.includes('2g'))))) {
      if (intensity == "viewport") {
        /* Biggest iPhone resolution (which we want): 414 × 896 = 370944
         * Small 7" tablet resolution (which we don’t want): 600 × 1024 = 614400
         * Note that the viewport (which we check here) is smaller than the resolution due to the UI’s chrome */
        if (document.documentElement.clientWidth * document.documentElement.clientHeight < 450000) {
          useViewport = true
        }
      }
      else if (intensity == "viewport-all") {
        useViewport = true
      }
    }
  }
  else {
    const milliseconds = parseInt(intensity)
    if (!isNaN(milliseconds)) {
      delayOnHover = milliseconds
    }
  }
}

if (isSupported) {
  const eventListenersOptions = {
    capture: true,
    passive: true,
  }

  if (!useMousedownOnly) {
    document.addEventListener('touchstart', touchstartListener, eventListenersOptions)
  }

  if (!useMousedown) {
    document.addEventListener('mouseover', mouseoverListener, eventListenersOptions)
  }
  else if (!mousedownShortcut) {
      document.addEventListener('mousedown', mousedownListener, eventListenersOptions)
  }

  if (mousedownShortcut) {
    document.addEventListener('mousedown', mousedownShortcutListener, eventListenersOptions)
  }

  if (useViewport) {
    let triggeringFunction
    if (window.requestIdleCallback) {
      triggeringFunction = (callback) => {
        requestIdleCallback(callback, {
          timeout: 1500,
        })
      }
    }
    else {
      triggeringFunction = (callback) => {
        callback()
      }
    }

    triggeringFunction(() => {
      const intersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const linkElement = entry.target
            intersectionObserver.unobserve(linkElement)
            preload(linkElement.href)
          }
        })
      })

      document.querySelectorAll('a').forEach((linkElement) => {
        if (isPreloadable(linkElement)) {
          intersectionObserver.observe(linkElement)
        }
      })
    })
  }
}

function touchstartListener(event) {
  /* Chrome on Android calls mouseover before touchcancel so `lastTouchTimestamp`
   * must be assigned on touchstart to be measured on mouseover. */
  lastTouchTimestamp = performance.now()

  const linkElement = event.target.closest('a')

  if (!isPreloadable(linkElement)) {
    return
  }

  preload(linkElement.href)
}

function mouseoverListener(event) {
  if (performance.now() - lastTouchTimestamp < DELAY_TO_NOT_BE_CONSIDERED_A_TOUCH_INITIATED_ACTION) {
    return
  }

  if (!('closest' in event.target)) {
    // Without this check sometimes an error “event.target.closest is not a function” is thrown, for unknown reasons
    // That error denotes that `event.target` isn’t undefined. My best guess is that it’s the Document.

    // Details could be gleaned from throwing such an error:
    //throw new TypeError(`instant.page non-element event target: timeStamp=${~~event.timeStamp}, type=${event.type}, typeof=${typeof event.target}, nodeType=${event.target.nodeType}, nodeName=${event.target.nodeName}, viewport=${innerWidth}x${innerHeight}, coords=${event.clientX}x${event.clientY}, scroll=${scrollX}x${scrollY}`)

    return
  }
  const linkElement = event.target.closest('a')

  if (!isPreloadable(linkElement)) {
    return
  }

  linkElement.addEventListener('mouseout', mouseoutListener, {passive: true})

  mouseoverTimer = setTimeout(() => {
    preload(linkElement.href)
    mouseoverTimer = undefined
  }, delayOnHover)
}

function mousedownListener(event) {
  const linkElement = event.target.closest('a')

  if (!isPreloadable(linkElement)) {
    return
  }

  preload(linkElement.href)
}

function mouseoutListener(event) {
  if (event.relatedTarget && event.target.closest('a') == event.relatedTarget.closest('a')) {
    return
  }

  if (mouseoverTimer) {
    clearTimeout(mouseoverTimer)
    mouseoverTimer = undefined
  }
}

function mousedownShortcutListener(event) {
  if (performance.now() - lastTouchTimestamp < DELAY_TO_NOT_BE_CONSIDERED_A_TOUCH_INITIATED_ACTION) {
    return
  }

  const linkElement = event.target.closest('a')

  if (event.which > 1 || event.metaKey || event.ctrlKey) {
    return
  }

  if (!linkElement) {
    return
  }

  linkElement.addEventListener('click', function (event) {
    if (event.detail == 1337) {
      return
    }

    event.preventDefault()
  }, {capture: true, passive: false, once: true})

  const customEvent = new MouseEvent('click', {view: window, bubbles: true, cancelable: false, detail: 1337})
  linkElement.dispatchEvent(customEvent)
}

function isPreloadable(linkElement) {
  if (!linkElement || !linkElement.href) {
    return
  }

  if (useWhitelist && !('instant' in linkElement.dataset)) {
    return
  }

  if (!allowExternalLinks && linkElement.origin != location.origin && !('instant' in linkElement.dataset)) {
    return
  }

  if (!['http:', 'https:'].includes(linkElement.protocol)) {
    return
  }

  if (linkElement.protocol == 'http:' && location.protocol == 'https:') {
    return
  }

  if (!allowQueryString && linkElement.search && !('instant' in linkElement.dataset)) {
    return
  }

  if (linkElement.hash && linkElement.pathname + linkElement.search == location.pathname + location.search) {
    return
  }

  if ('noInstant' in linkElement.dataset) {
    return
  }

  return true
}

function preload(url) {
  if (prefetches.has(url)) {
    return
  }

  const prefetcher = document.createElement('link')
  prefetcher.rel = 'prefetch'
  prefetcher.href = url
  document.head.appendChild(prefetcher)

  prefetches.add(url)
}


/***/ }),

/***/ "./src/lutra/assets/scripts/scrollspy.ts":
/*!***********************************************!*\
  !*** ./src/lutra/assets/scripts/scrollspy.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ScrollObserver": () => (/* binding */ ScrollObserver)
/* harmony export */ });
/* harmony import */ var debounce_animation_frame__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! debounce-animation-frame */ "./node_modules/debounce-animation-frame/dist/index.js");
/* harmony import */ var debounce_animation_frame__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(debounce_animation_frame__WEBPACK_IMPORTED_MODULE_0__);

class ScrollObserver {
    constructor(back_to_top_offset = 64, show_page_title_offset = 128) {
        this.lastScrollTop = window.scrollY || document.documentElement.scrollTop;
        this.back_to_top_offset = back_to_top_offset;
        this.show_page_title_offset = show_page_title_offset;
        this.links = Array.from(document.querySelectorAll(".toc-container ul a[href^='#']:not([href='#'])"));
        this.sections = Array.from(document.getElementsByTagName("section"));
    }
    observe() {
        window.addEventListener("scroll", debounce_animation_frame__WEBPACK_IMPORTED_MODULE_0___default()(this.callback.bind(this)), { passive: true });
        // Trigger it once, to populate the initial state.
        this.callback();
    }
    callback() {
        const position = window.scrollY || document.documentElement.scrollTop;
        this.updateActiveTocAnchor(position);
        this.updatePageTitleAndBackToTop(position);
        this.lastScrollTop = position;
    }
    updateActiveTocAnchor(position) {
        var _a;
        const content = document.getElementById("lutra-main-content");
        const sectionMargin = content.offsetTop;
        // Clear existing links.
        this.links.forEach((anchor) => {
            anchor.classList.remove("previous");
            anchor.classList.remove("current");
        });
        // Locate the first section (from the end) that is visible.
        let current = [...this.sections].reverse().find((section) => {
            return position >= section.offsetTop - sectionMargin;
        });
        if (current === undefined) {
            // console.debug("[ScrollObserver] No relevant section is visible.");
            return;
        }
        const currentLinkIndex = this.links.findIndex((anchor) => {
            return anchor.hash === `#${current === null || current === void 0 ? void 0 : current.id}`;
        });
        if (currentLinkIndex === -1) {
            // console.debug("[ScrollObserver] No link found for section:", current);
            return;
        }
        // Highlight the current link and mark the previous ones.
        // console.debug("[ScrollObserver] Current section:", current);
        // console.debug("[ScrollObserver] Current link index:", currentLinkIndex);
        (_a = this.links[currentLinkIndex]) === null || _a === void 0 ? void 0 : _a.classList.add("current");
        this.links.slice(0, currentLinkIndex).forEach((anchor) => {
            anchor.classList.add("previous");
        });
    }
    updatePageTitleAndBackToTop(position) {
        if (position > this.show_page_title_offset) {
            document.documentElement.classList.add("show-page-title");
            if (!location.hash && position < this.lastScrollTop) {
                document.documentElement.classList.add("show-back-to-top");
            }
            else if (position > this.lastScrollTop) {
                document.documentElement.classList.remove("show-back-to-top");
            }
        }
        else {
            document.documentElement.classList.remove("show-page-title");
        }
        if (position < this.back_to_top_offset) {
            document.documentElement.classList.remove("show-back-to-top");
        }
    }
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
var __webpack_exports__ = {};
/*!*******************************************!*\
  !*** ./src/lutra/assets/scripts/lutra.ts ***!
  \*******************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var instant_page__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! instant.page */ "./node_modules/instant.page/instantpage.js");
/* harmony import */ var instant_page__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(instant_page__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _scrollspy__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./scrollspy */ "./src/lutra/assets/scripts/scrollspy.ts");


////////////////////////////////////////////////////////////////////////////////
// Scroll Handling
////////////////////////////////////////////////////////////////////////////////
function setupScrollHandler() {
    if (document.getElementById("lutra-main-content") === null) {
        console.debug("No main content, skipping scroll handler.");
        return;
    }
    const observer = new _scrollspy__WEBPACK_IMPORTED_MODULE_1__.ScrollObserver();
    observer.observe();
}
////////////////////////////////////////////////////////////////////////////////
// Theme Toggle
////////////////////////////////////////////////////////////////////////////////
var Theme;
(function (Theme) {
    Theme["LIGHT"] = "light";
    Theme["DARK"] = "dark";
    Theme["AUTO"] = "auto";
})(Theme || (Theme = {}));
function setTheme(mode, class_to_set) {
    // TODO: Tooltips.
    // Sanitize the incoming values.
    if (!Object.values(Theme).includes(mode)) {
        console.error(`Got invalid theme mode: ${mode}. Resetting to auto.`);
        mode = Theme.AUTO;
    }
    if (![Theme.LIGHT, Theme.DARK].includes(class_to_set)) {
        console.error(`Got invalid theme class: ${class_to_set}. Resetting to light.`);
        class_to_set = Theme.LIGHT;
    }
    document.body.dataset.theme = mode;
    localStorage.setItem("theme", mode);
    if (class_to_set == Theme.LIGHT) {
        document.documentElement.classList.remove("dark");
    }
    else {
        document.documentElement.classList.add("dark");
    }
    console.debug(`Changed to ${mode} mode (${class_to_set}).`);
}
function cycleThemeOnce() {
    const currentTheme = localStorage.getItem("theme") || "auto";
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (prefersDark) {
        // Auto (dark) -> Light -> Dark
        if (currentTheme === "auto") {
            setTheme(Theme.LIGHT, Theme.LIGHT);
        }
        else if (currentTheme == Theme.LIGHT) {
            setTheme(Theme.DARK, Theme.DARK);
        }
        else {
            setTheme(Theme.AUTO, Theme.DARK);
        }
    }
    else {
        // Auto (light) -> Dark -> Light
        if (currentTheme === Theme.AUTO) {
            setTheme(Theme.DARK, Theme.DARK);
        }
        else if (currentTheme == Theme.DARK) {
            setTheme(Theme.LIGHT, Theme.LIGHT);
        }
        else {
            setTheme(Theme.AUTO, Theme.LIGHT);
        }
    }
}
function setupTheme() {
    // Attach event handlers for toggling themes.
    const buttons = document.getElementsByClassName("theme-toggle");
    Array.from(buttons).forEach((btn) => {
        btn.addEventListener("click", cycleThemeOnce);
    });
    // Watch for theme changes and update accordingly.
    window
        .matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", (e) => {
        const _currentTheme = localStorage.getItem("theme") || "auto";
        const currentTheme = _currentTheme;
        if (currentTheme === Theme.AUTO) {
            setTheme(Theme.AUTO, e.matches ? Theme.DARK : Theme.LIGHT);
        }
        else {
            // This is necessary to update the tooltips.
            setTheme(currentTheme, currentTheme);
        }
    });
}
function setupHeaderSearch() {
    const search_link = document.getElementById("lutra-header-search-link");
    if (search_link === null) {
        console.debug("No search link, skipping header search.");
        return;
    }
    const search_container = document.getElementById("lutra-header-search-form");
    const search_overlay = document.getElementById("lutra-header-search-overlay");
    function searchDeactivate() {
        search_container.classList.remove("active");
        search_overlay.removeEventListener("click", searchDeactivate);
    }
    function searchDeactivateOnEscape(e) {
        if (e.key === "Escape") {
            searchDeactivate();
            window.removeEventListener("keydown", searchDeactivateOnEscape, true);
        }
    }
    search_overlay.addEventListener("click", searchDeactivate);
    search_link.addEventListener("click", (e) => {
        e.preventDefault();
        search_container.classList.add("active");
        const search_form = search_container.children[0];
        search_form.q.focus();
        window.addEventListener("keydown", searchDeactivateOnEscape, true);
    });
}
////////////////////////////////////////////////////////////////////////////////
// Sidebar collapse
////////////////////////////////////////////////////////////////////////////////
function setupSidebarCollapse() {
    const button = document.getElementById("lutra-site-navigation-collapse-icon");
    if (button === null) {
        console.debug("No sidebar collapse button, skipping sidebar collapse.");
        return;
    }
    const container = document.getElementById("lutra-primary-sidebar-container");
    if (document.body.classList.contains("collapsed-site-navigation")) {
        container.setAttribute("aria-hidden", "true");
    }
    button.addEventListener("click", () => {
        console.debug("Clicked collapse.");
        if (document.body.classList.contains("collapsed-site-navigation")) {
            document.body.classList.remove("collapsed-site-navigation");
            document.body.classList.add("expanded-site-navigation");
            container.setAttribute("aria-hidden", "false");
            localStorage.setItem("collapsed", "false");
        }
        else {
            document.body.classList.remove("expanded-site-navigation");
            document.body.classList.add("collapsed-site-navigation");
            container.setAttribute("aria-hidden", "true");
            localStorage.setItem("collapsed", "true");
        }
        document.body.classList.add("animated");
    });
}
////////////////////////////////////////////////////////////////////////////////
// Main entrypoint
////////////////////////////////////////////////////////////////////////////////
function main() {
    document.documentElement.classList.remove("no-js");
    setupSidebarCollapse();
    setupTheme();
    setupScrollHandler();
    // This is disabled, since we don't have inline search presentation.
    // Without that, this just looks a bit weird.
    // setupHeaderSearch();
}
document.addEventListener("DOMContentLoaded", main);

})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!*******************************************!*\
  !*** ./src/lutra/assets/styles/lutra.css ***!
  \*******************************************/
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin

})();

/******/ })()
;
//# sourceMappingURL=lutra.js.map