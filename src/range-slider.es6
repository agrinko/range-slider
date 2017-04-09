/*!
 * Range-slider 1.0.0
 * Customizable slider (range) component for JavaScript.
 *
 * Copyright: Alexey Grinko, 2017
 * Git repository: https://github.com/agrinko/range-slider.git
 *
 * @license MIT - https://opensource.org/licenses/MIT
 */
((global) => {
    /**
     * Default settings
     */
    const DEFAULTS = {
        value: 0,                       // <number>
        min: 0,                         // <number>
        max: 100,                       // <number>
        step: 1,                        // <number>
        unit: null,                     // <string>
        width: null,                    // <number, string>
        design: "3d",                   // <"3d", "2d">
        theme: "default",               // <"default", "positive", "attention">
        size: "medium",                 // <"small", "medium", "large">
        handle: "square",               // <"square", "rect", "round">
        popup: "top",                   // <"top", "bottom", null>
        showMinMaxLabels: true,         // <boolean>
        showCurrentValueLabel: false,   // <boolean>
        labelsPosition: "top",          // <"top", "bottom">
        onstart: () => {},              // <(value: number) => boolean>
        onmove: () => {},               // <(value: number) => boolean>
        onfinish: () => {}              // <(value: number) => void>
    };
    /**
     * Main class responsible for creating the component
     * @class
     */
    class RangeSlider {
        constructor(element, settings) {
            if (!(element instanceof HTMLElement)) {
                element = RangeSlider._el();
                if (!settings) {
                    settings = element;
                }
            }

            this.el = element;
            this.s = assign({}, DEFAULTS, settings);

            this._validateSettings();
            this._buildDOM();
            this._bindEvents();

            this.initialValue = this.s.value;
            this.value = null;

            this.setValue(this.s.value);
        }

        getValue() {
            return this.value;
        }

        getElement() {
            return this.el;
        }

        labelValue(value=this.value) {
            let unit = this.s.unit || '';
            return value + ' ' + unit;
        }

        setValue(value) {
            value = this._normalize(value);

            if (value < this.s.min || value > this.s.max) return;

            if (this.value === null || (value != this.value && this.s.onmove.call(this, value) !== false)) {
                this.value = value;
                this._updatePopup();
                this._updateLabel();
                this._moveToValue(value);
            }
        }

        setWidth(width) {
            if (arguments.length) {
                if (typeof width === "number") {
                    width += "px";
                }
                this.el.style.width = width;
            }
        }

        // currently works only for numeric settings: tries formatting strings to numbers or uses defaults
        _validateSettings() {
            this.s.value = RangeSlider.toNumber(this.s.value, DEFAULTS.value);
            this.s.min = RangeSlider.toNumber(this.s.min, DEFAULTS.min);
            this.s.max = RangeSlider.toNumber(this.s.max, DEFAULTS.max);
            this.s.step = RangeSlider.toNumber(this.s.step, DEFAULTS.step);
        }

        _buildDOM() {
            this._setClasses();
            this._createBar();
            this.setWidth(this.s.width);

            if (this.s.showMinMaxLabels || this.s.showCurrentValueLabel) {
                this._createLabels();
            }

            if (this.s.popup) {
                this._createPopup();
            }
        }

        _setClasses() {
            [
                `range-slider`,
                `rs-theme-${this.s.theme}`,
                `rs-size-${this.s.size}`,
                `rs-design-${this.s.design}`,
                `rs-handle-${this.s.handle}`,
                (this.s.showMinMaxLabels || this.s.showCurrentValueLabel) ? `rs-labels-${this.s.labelsPosition}` : null
            ].forEach((className) => {
                if (className) {
                    this.el.className += " " + className;
                }
            });
        }

        _createBar() {
            let bar = RangeSlider._el();
            let progress = RangeSlider._el();
            let handleWrap = RangeSlider._el();
            let handle = RangeSlider._el();

            bar.className =         "rs-bar";
            progress.className =    "rs-progress";
            handleWrap.className =  "rs-wrap";
            handle.className =      "rs-handle";

            bar.appendChild(handleWrap);
            handleWrap.appendChild(progress);
            handleWrap.appendChild(handle);

            this.el.appendChild(bar);

            this.bar = bar;
            this.progressBar = progress;
            this.range = handleWrap;
            this.handle = handle;
        }

        _createLabels() {
            let labels = RangeSlider._el();
            let labelWrap = RangeSlider._el();
            let labelLeft = RangeSlider._el();
            let labelMiddle = RangeSlider._el();
            let labelRight = RangeSlider._el();

            labels.className =      "rs-labels";
            labelWrap.className =   "rs-wrap";
            labelLeft.className =   "rs-label-left";
            labelMiddle.className = "rs-label-middle";
            labelRight.className =  "rs-label-right";

            labels.appendChild(labelLeft);
            labels.appendChild(labelRight);
            labels.appendChild(labelWrap);
            labelWrap.appendChild(labelMiddle);

            this.el.appendChild(labels);

            this.labels = {
                left: labelLeft,
                right: labelRight,
                middle: labelMiddle
            };

            this._updateLabels();
        }

        _updateLabels() {
            if (this.s.showMinMaxLabels) {
                this.labels.left.innerText = this.labelValue(this.s.min);
                this.labels.right.innerText = this.labelValue(this.s.max);
            }
        }

        _updateLabel() {
            if (this.s.showCurrentValueLabel) {
                this.labels.middle.innerText = this.labelValue(this.value);
            }
        }

        _createPopup() {
            let popup = RangeSlider._el();

            popup.className = `rs-popup rs-hidden rs-popup-${this.s.popup}`;

            this.handle.appendChild(popup);
            this.popup = popup;
        }

        _updatePopup() {
            if (this.s.popup) {
                this.popup.innerText = this.labelValue(this.value);
            }
        }

        _togglePopup(visible) {
            if (this.s.popup) {
                if (visible) {
                    // we use class names instead of easier approaches to preserve css animation and not break
                    // "ensureNoIntersection()" method
                    this.popup.className = this.popup.className.replace("rs-hidden", "");
                    if (this.s.showCurrentValueLabel) {
                        this.labels.middle.className += " rs-hidden";
                    }

                } else {
                    this.popup.className += " rs-hidden";
                    if (this.s.showCurrentValueLabel) {
                        this.labels.middle.className = this.labels.middle.className.replace("rs-hidden", "");
                    }
                }
            }
        }

        _bindEvents() {
            this.bar.addEventListener("mousedown", (e) => {
                if (e.button != 0) return;

                e.preventDefault();
                this._begin(e.clientX, e.target);
            });

            this.bar.addEventListener("touchstart", (e) => {
                if (e.changedTouches && e.changedTouches[0]) {
                    e.preventDefault();
                    this._begin(e.changedTouches[0].clientX, e.target);
                }
            });
        }

        _begin(clientX, target) {
            if (this.s.onstart.call(this, this.value) === false) return;

            this.prevValue = this.value;
            this.el.className += " rs-active";

            this._togglePopup(true);

            if (target != this.handle) {
                this._move(clientX); // move handle right away when pressed directly on progress bar
            } else {
                this._ensureNoElementsIntersection();
            }

            this._initHandle(clientX);
        }

        _initHandle(clientX) {
            let bounds = this.handle.getBoundingClientRect();
            let dx = clientX - (bounds.left + bounds.width/2);
            let move = (e) => {
                let ex = e.changedTouches ? e.changedTouches[0].clientX : e.clientX; // consider touch events
                this._move(ex - dx); // fix movement position relative to initial cursor position when handle was pressed
                e.preventDefault();
            };
            let end = () => {
                document.removeEventListener("mousemove", move);
                document.removeEventListener("touchmove", move);
                document.removeEventListener("mouseup", end);
                document.removeEventListener("touchend", end);
                document.removeEventListener("touchcancel", end);

                this._end();
            };

            document.addEventListener("mousemove", move);
            document.addEventListener("touchmove", move);
            document.addEventListener("mouseup", end);
            document.addEventListener("touchend", end);
            document.addEventListener("touchcancel", end);
        }

        _end() {
            if (this.value != this.prevValue) {
                this.s.onfinish.call(this, this.value);
            }

            this.el.className = this.el.className.replace("rs-active", "");

            this._togglePopup(false);
            this._ensureNoElementsIntersection();
        }

        _move(clientX) {
            let x = this._getRelX(clientX);
            let value = this._toValue(x);

            this.setValue(value);
        }

        _moveToValue(x) {
            x = this._toFraction(x) * 100;

            this.progressBar.style.width =
                this.handle.style.left = `${x}%`;

            this._moveLabel(x);
        }

        _moveLabel(x) {
            if (this.s.showCurrentValueLabel) {
                this.labels.middle.style.left = `${x}%`;
            }
            this._ensureNoElementsIntersection();
        }

        _ensureNoElementsIntersection() {
            if (this.s.showMinMaxLabels) {
                if (this.s.popup && this.popup.className.indexOf("rs-hidden") == -1) {
                    // no intersection between popup and min-max labels
                    RangeSlider.ensureNoIntersection(this.popup, this.labels.left);
                    RangeSlider.ensureNoIntersection(this.popup, this.labels.right);
                }
                if (this.s.showCurrentValueLabel && this.labels.middle.className.indexOf("rs-hidden") == -1) {
                    // no intersection between current label and min-max labels
                    RangeSlider.ensureNoIntersection(this.labels.middle, this.labels.left);
                    RangeSlider.ensureNoIntersection(this.labels.middle, this.labels.right);
                }
            }
        }

        _normalize(x) {
            x = Math.round(Math.min(Math.max(x, this.s.min), this.s.max));
            let rem = (x - this.initialValue) % this.s.step;

            if (rem >= this.s.step / 2) {
                x += this.s.step;
            }
            x -= rem;

            return x;
        }

        _getRelX(clientX) {
            let bounds = this.range.getBoundingClientRect();
            let relX = (clientX - bounds.left) / bounds.width;

            return Math.min(Math.max(relX, 0), 1); //ensure relative value is in [0; 1] range
        }

        _toValue(x) {
            return this.s.min + (this.s.max - this.s.min) * x;
        }

        _toFraction(x) {
            return (x - this.s.min) / (this.s.max - this.s.min);
        }

        static _el(tagName="DIV") { // used to shorten minified code
            return document.createElement(tagName);
        }

        static ensureNoIntersection(el1, el2) {
            el2.className = el2.className.replace("rs-hidden", "");

            if (el1.className.indexOf("rs-hidden") == -1 && RangeSlider.intersects(el1, el2)) {
                el2.className += " rs-hidden";
            }
        }

        static toNumber(x, def=0) {
            x = +x;
            if (!x && x !== 0) {
                x = def;
            }

            return x;
        }

        static intersects(el1, el2) {
            let rect1 = el1.getBoundingClientRect();
            let rect2 = el2.getBoundingClientRect();

            return (this._intersectsRectH(rect1, rect2) || this._intersectsRectH(rect2, rect1)) &&
                   (this._intersectsRectV(rect1, rect2) || this._intersectsRectV(rect2, rect1));
        }

        static _intersectsRectH(rect1, rect2) {
            return rect1.left <= rect2.right && (rect1.left >= rect2.left || rect1.right >= rect2.left);
        }

        static _intersectsRectV(rect1, rect2) {
            return rect1.top <= rect2.bottom && (rect1.top >= rect2.top || rect1.bottom >= rect2.top);
        }
    }

    // HELPER FUNCTIONS
    /**
     * Emulate ES6 Object.assign behaviour if native function is not defined
     */
    let assign = Object.assign || function (target) {
        for (let i = 1; i < arguments.length; i++ ) {
            for (let key in arguments[i]) {
                if (arguments[i].hasOwnProperty(key)) {
                    target[key] = arguments[i][key];
                }
            }
        }

        return target;
    };


    // EXPOSING THE COMPONENT

    // AMD style
    if (typeof define === "function" && define.amd) {
        define(() => {
            return RangeSlider;
        });
    // CommonJS style
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = RangeSlider;
    // global definition
    } else {
        global.RangeSlider = RangeSlider;
    }
})(window);
