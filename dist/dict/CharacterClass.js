/*
 * Copyright 2014 Takuya Asano
 * Copyright 2010-2014 Atilika Inc. and contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
"use strict";
class CharacterClass {
    /**
     * CharacterClass
     * @param {number} class_id
     * @param {string} class_name
     * @param {boolean} is_always_invoke
     * @param {boolean} is_grouping
     * @param {number} max_length
     * @constructor
     */
    constructor(class_id, class_name, is_always_invoke, is_grouping, max_length) {
        Object.defineProperty(this, "class_id", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "class_name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "is_always_invoke", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "is_grouping", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "max_length", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.class_id = class_id;
        this.class_name = class_name;
        this.is_always_invoke = is_always_invoke;
        this.is_grouping = is_grouping;
        this.max_length = max_length;
    }
}
export default CharacterClass;
//# sourceMappingURL=CharacterClass.js.map