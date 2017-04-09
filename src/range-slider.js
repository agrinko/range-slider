"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*!
 * Range-slider 1.0.0
 * Customizable slider (range) component for JavaScript.
 *
 * Copyright: Alexey Grinko, 2017
 * Git repository: https://github.com/agrinko/range-slider.git
 *
 * @license MIT - https://opensource.org/licenses/MIT
 */
(function (global) {
    /**
     * Default settings
     */
    var DEFAULTS = {
        value: 0, // <number>
        min: 0, // <number>
        max: 100, // <number>
        step: 1, // <number>
        unit: null, // <string>
        width: null, // <number, string>
        design: "3d", // <"3d", "2d">
        theme: "default", // <"default", "positive", "attention">
        size: "medium", // <"small", "medium", "large">
        handle: "square", // <"square", "rect", "round">
        popup: "top", // <"top", "bottom", null>
        showMinMaxLabels: true, // <boolean>
        showCurrentValueLabel: false, // <boolean>
        labelsPosition: "top", // <"top", "bottom">
        onstart: function onstart() {}, // <(value: number) => boolean>
        onmove: function onmove() {}, // <(value: number) => boolean>
        onfinish: function onfinish() {} // <(value: number) => void>
    };
    /**
     * Main class responsible for creating the component
     * @class
     */

    var RangeSlider = function () {
        function RangeSlider(element, settings) {
            _classCallCheck(this, RangeSlider);

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

        _createClass(RangeSlider, [{
            key: "getValue",
            value: function getValue() {
                return this.value;
            }
        }, {
            key: "getElement",
            value: function getElement() {
                return this.el;
            }
        }, {
            key: "labelValue",
            value: function labelValue() {
                var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.value;

                var unit = this.s.unit || '';
                return value + ' ' + unit;
            }
        }, {
            key: "setValue",
            value: function setValue(value) {
                value = this._normalize(value);

                if (value < this.s.min || value > this.s.max) return;

                if (this.value === null || value != this.value && this.s.onmove.call(this, value) !== false) {
                    this.value = value;
                    this._updatePopup();
                    this._updateLabel();
                    this._moveToValue(value);
                }
            }
        }, {
            key: "setWidth",
            value: function setWidth(width) {
                if (arguments.length) {
                    if (typeof width === "number") {
                        width += "px";
                    }
                    this.el.style.width = width;
                }
            }

            // currently works only for numeric settings: tries formatting strings to numbers or uses defaults

        }, {
            key: "_validateSettings",
            value: function _validateSettings() {
                this.s.value = RangeSlider.toNumber(this.s.value, DEFAULTS.value);
                this.s.min = RangeSlider.toNumber(this.s.min, DEFAULTS.min);
                this.s.max = RangeSlider.toNumber(this.s.max, DEFAULTS.max);
                this.s.step = RangeSlider.toNumber(this.s.step, DEFAULTS.step);
            }
        }, {
            key: "_buildDOM",
            value: function _buildDOM() {
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
        }, {
            key: "_setClasses",
            value: function _setClasses() {
                var _this = this;

                ["range-slider", "rs-theme-" + this.s.theme, "rs-size-" + this.s.size, "rs-design-" + this.s.design, "rs-handle-" + this.s.handle, this.s.showMinMaxLabels || this.s.showCurrentValueLabel ? "rs-labels-" + this.s.labelsPosition : null].forEach(function (className) {
                    if (className) {
                        _this.el.className += " " + className;
                    }
                });
            }
        }, {
            key: "_createBar",
            value: function _createBar() {
                var bar = RangeSlider._el();
                var progress = RangeSlider._el();
                var handleWrap = RangeSlider._el();
                var handle = RangeSlider._el();

                bar.className = "rs-bar";
                progress.className = "rs-progress";
                handleWrap.className = "rs-wrap";
                handle.className = "rs-handle";

                bar.appendChild(handleWrap);
                handleWrap.appendChild(progress);
                handleWrap.appendChild(handle);

                this.el.appendChild(bar);

                this.bar = bar;
                this.progressBar = progress;
                this.range = handleWrap;
                this.handle = handle;
            }
        }, {
            key: "_createLabels",
            value: function _createLabels() {
                var labels = RangeSlider._el();
                var labelWrap = RangeSlider._el();
                var labelLeft = RangeSlider._el();
                var labelMiddle = RangeSlider._el();
                var labelRight = RangeSlider._el();

                labels.className = "rs-labels";
                labelWrap.className = "rs-wrap";
                labelLeft.className = "rs-label-left";
                labelMiddle.className = "rs-label-middle";
                labelRight.className = "rs-label-right";

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
        }, {
            key: "_updateLabels",
            value: function _updateLabels() {
                if (this.s.showMinMaxLabels) {
                    this.labels.left.innerText = this.labelValue(this.s.min);
                    this.labels.right.innerText = this.labelValue(this.s.max);
                }
            }
        }, {
            key: "_updateLabel",
            value: function _updateLabel() {
                if (this.s.showCurrentValueLabel) {
                    this.labels.middle.innerText = this.labelValue(this.value);
                }
            }
        }, {
            key: "_createPopup",
            value: function _createPopup() {
                var popup = RangeSlider._el();

                popup.className = "rs-popup rs-hidden rs-popup-" + this.s.popup;

                this.handle.appendChild(popup);
                this.popup = popup;
            }
        }, {
            key: "_updatePopup",
            value: function _updatePopup() {
                if (this.s.popup) {
                    this.popup.innerText = this.labelValue(this.value);
                }
            }
        }, {
            key: "_togglePopup",
            value: function _togglePopup(visible) {
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
        }, {
            key: "_bindEvents",
            value: function _bindEvents() {
                var _this2 = this;

                this.bar.addEventListener("mousedown", function (e) {
                    if (e.button != 0) return;

                    e.preventDefault();
                    _this2._begin(e.clientX, e.target);
                });

                this.bar.addEventListener("touchstart", function (e) {
                    if (e.changedTouches && e.changedTouches[0]) {
                        e.preventDefault();
                        _this2._begin(e.changedTouches[0].clientX, e.target);
                    }
                });
            }
        }, {
            key: "_begin",
            value: function _begin(clientX, target) {
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
        }, {
            key: "_initHandle",
            value: function _initHandle(clientX) {
                var _this3 = this;

                var bounds = this.handle.getBoundingClientRect();
                var dx = clientX - (bounds.left + bounds.width / 2);
                var move = function move(e) {
                    var ex = e.changedTouches ? e.changedTouches[0].clientX : e.clientX; // consider touch events
                    _this3._move(ex - dx); // fix movement position relative to initial cursor position when handle was pressed
                    e.preventDefault();
                };
                var end = function end() {
                    document.removeEventListener("mousemove", move);
                    document.removeEventListener("touchmove", move);
                    document.removeEventListener("mouseup", end);
                    document.removeEventListener("touchend", end);
                    document.removeEventListener("touchcancel", end);

                    _this3._end();
                };

                document.addEventListener("mousemove", move);
                document.addEventListener("touchmove", move);
                document.addEventListener("mouseup", end);
                document.addEventListener("touchend", end);
                document.addEventListener("touchcancel", end);
            }
        }, {
            key: "_end",
            value: function _end() {
                if (this.value != this.prevValue) {
                    this.s.onfinish.call(this, this.value);
                }

                this.el.className = this.el.className.replace("rs-active", "");

                this._togglePopup(false);
                this._ensureNoElementsIntersection();
            }
        }, {
            key: "_move",
            value: function _move(clientX) {
                var x = this._getRelX(clientX);
                var value = this._toValue(x);

                this.setValue(value);
            }
        }, {
            key: "_moveToValue",
            value: function _moveToValue(x) {
                x = this._toFraction(x) * 100;

                this.progressBar.style.width = this.handle.style.left = x + "%";

                this._moveLabel(x);
            }
        }, {
            key: "_moveLabel",
            value: function _moveLabel(x) {
                if (this.s.showCurrentValueLabel) {
                    this.labels.middle.style.left = x + "%";
                }
                this._ensureNoElementsIntersection();
            }
        }, {
            key: "_ensureNoElementsIntersection",
            value: function _ensureNoElementsIntersection() {
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
        }, {
            key: "_normalize",
            value: function _normalize(x) {
                x = Math.round(Math.min(Math.max(x, this.s.min), this.s.max));
                var rem = (x - this.initialValue) % this.s.step;

                if (rem >= this.s.step / 2) {
                    x += this.s.step;
                }
                x -= rem;

                return x;
            }
        }, {
            key: "_getRelX",
            value: function _getRelX(clientX) {
                var bounds = this.range.getBoundingClientRect();
                var relX = (clientX - bounds.left) / bounds.width;

                return Math.min(Math.max(relX, 0), 1); //ensure relative value is in [0; 1] range
            }
        }, {
            key: "_toValue",
            value: function _toValue(x) {
                return this.s.min + (this.s.max - this.s.min) * x;
            }
        }, {
            key: "_toFraction",
            value: function _toFraction(x) {
                return (x - this.s.min) / (this.s.max - this.s.min);
            }
        }], [{
            key: "_el",
            value: function _el() {
                var tagName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "DIV";
                // used to shorten minified code
                return document.createElement(tagName);
            }
        }, {
            key: "ensureNoIntersection",
            value: function ensureNoIntersection(el1, el2) {
                el2.className = el2.className.replace("rs-hidden", "");

                if (el1.className.indexOf("rs-hidden") == -1 && RangeSlider.intersects(el1, el2)) {
                    el2.className += " rs-hidden";
                }
            }
        }, {
            key: "toNumber",
            value: function toNumber(x) {
                var def = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

                x = +x;
                if (!x && x !== 0) {
                    x = def;
                }

                return x;
            }
        }, {
            key: "intersects",
            value: function intersects(el1, el2) {
                var rect1 = el1.getBoundingClientRect();
                var rect2 = el2.getBoundingClientRect();

                return (this._intersectsRectH(rect1, rect2) || this._intersectsRectH(rect2, rect1)) && (this._intersectsRectV(rect1, rect2) || this._intersectsRectV(rect2, rect1));
            }
        }, {
            key: "_intersectsRectH",
            value: function _intersectsRectH(rect1, rect2) {
                return rect1.left <= rect2.right && (rect1.left >= rect2.left || rect1.right >= rect2.left);
            }
        }, {
            key: "_intersectsRectV",
            value: function _intersectsRectV(rect1, rect2) {
                return rect1.top <= rect2.bottom && (rect1.top >= rect2.top || rect1.bottom >= rect2.top);
            }
        }]);

        return RangeSlider;
    }();

    // HELPER FUNCTIONS
    /**
     * Emulate ES6 Object.assign behaviour if native function is not defined
     */


    var assign = Object.assign || function (target) {
        for (var i = 1; i < arguments.length; i++) {
            for (var key in arguments[i]) {
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
        define(function () {
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