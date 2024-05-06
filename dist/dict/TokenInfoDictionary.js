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
import ByteBuffer from "../util/ByteBuffer.js";
class TokenInfoDictionary {
    /**
     * TokenInfoDictionary
     * @constructor
     */
    constructor() {
        Object.defineProperty(this, "dictionary", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "target_map", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "pos_buffer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.dictionary = new ByteBuffer(10 * 1024 * 1024);
        this.target_map = {}; // trie_id (of surface form) -> token_info_id (of token)
        this.pos_buffer = new ByteBuffer(10 * 1024 * 1024);
    }
    // left_id right_id word_cost ...
    // ^ this position is token_info_id
    buildDictionary(entries) {
        var dictionary_entries = {}; // using as hashmap, string -> string (word_id -> surface_form) to build dictionary
        for (var i = 0; i < entries.length; i++) {
            var entry = entries[i];
            if (entry.length < 4) {
                continue;
            }
            var surface_form = entry[0].toString();
            var left_id = Number(entry[1]);
            var right_id = Number(entry[2]);
            var word_cost = Number(entry[3]);
            var feature = entry.slice(4).join(","); // TODO Optimize
            // Assertion
            if (!isFinite(left_id) || !isFinite(right_id) || !isFinite(word_cost)) {
                console.log(entry);
            }
            var token_info_id = this.put(left_id, right_id, word_cost, surface_form, feature);
            dictionary_entries[token_info_id] = surface_form;
        }
        // Remove last unused area
        this.dictionary.shrink();
        this.pos_buffer.shrink();
        return dictionary_entries;
    }
    put(left_id, right_id, word_cost, surface_form, feature) {
        var token_info_id = this.dictionary.position;
        var pos_id = this.pos_buffer.position;
        this.dictionary.putShort(left_id);
        this.dictionary.putShort(right_id);
        this.dictionary.putShort(word_cost);
        this.dictionary.putInt(pos_id);
        this.pos_buffer.putString(surface_form + "," + feature);
        return token_info_id;
    }
    addMapping(source, target) {
        const mapping = this.target_map[source] ?? [];
        // if (mapping == null) {
        //   mapping = [];
        // }
        mapping.push(target);
        this.target_map[source] = mapping;
    }
    targetMapToBuffer() {
        var buffer = new ByteBuffer();
        var map_keys_size = Object.keys(this.target_map).length;
        buffer.putInt(map_keys_size);
        for (var key in this.target_map) {
            var values = this.target_map[key]; // Array
            var map_values_size = values.length;
            buffer.putInt(parseInt(key));
            buffer.putInt(map_values_size);
            for (var i = 0; i < values.length; i++) {
                buffer.putInt(values[i]);
            }
        }
        return buffer.shrink(); // Shrink-ed Typed Array
    }
    // from tid.dat
    loadDictionary(array_buffer) {
        this.dictionary = new ByteBuffer(array_buffer);
        return this;
    }
    // from tid_pos.dat
    loadPosVector(array_buffer) {
        this.pos_buffer = new ByteBuffer(array_buffer);
        return this;
    }
    // from tid_map.dat
    loadTargetMap(array_buffer) {
        const buffer = new ByteBuffer(array_buffer);
        buffer.position = 0;
        this.target_map = {};
        buffer.readInt(); // map_keys_size
        while (buffer.buffer.length > buffer.position) {
            // if (buffer.buffer.length < buffer.position + 1) {
            //   break;
            // }
            const key = buffer.readInt();
            const map_values_size = buffer.readInt();
            for (let i = 0; i < map_values_size; i++) {
                const value = buffer.readInt();
                this.addMapping(key, value);
            }
        }
        return this;
    }
    /**
     * Look up features in the dictionary
     * @param {string} token_info_id_str Word ID to look up
     * @returns {string} Features string concatenated by ","
     */
    getFeatures(token_info_id_str) {
        var token_info_id = parseInt(token_info_id_str);
        if (isNaN(token_info_id)) {
            // TODO throw error
            return "";
        }
        var pos_id = this.dictionary.getInt(token_info_id + 6);
        return this.pos_buffer.getString(pos_id);
    }
}
export default TokenInfoDictionary;
//# sourceMappingURL=TokenInfoDictionary.js.map