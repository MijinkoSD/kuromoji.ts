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
class IpadicFormatter {
    /**
     * Mappings between IPADIC dictionary features and tokenized results
     * @constructor
     */
    constructor() { }
    formatEntry(word_id, position, type, features) {
        let token = {
            word_id,
            word_type: type,
            word_position: position,
            surface_form: features[0],
            pos: features[1],
            pos_detail_1: features[2],
            pos_detail_2: features[3],
            pos_detail_3: features[4],
            conjugated_type: features[5],
            conjugated_form: features[6],
            basic_form: features[7],
            reading: features[8],
            pronunciation: features[9],
        };
        return token;
    }
    formatUnknownEntry(word_id, position, type, features, surface_form) {
        let token = {
            word_id,
            word_type: type,
            word_position: position,
            surface_form: surface_form,
            pos: features[1],
            pos_detail_1: features[2],
            pos_detail_2: features[3],
            pos_detail_3: features[4],
            conjugated_type: features[5],
            conjugated_form: features[6],
            basic_form: features[7],
            // reading: features[8],
            // pronunciation: features[9],
        };
        return token;
    }
}
export default IpadicFormatter;
//# sourceMappingURL=IpadicFormatter.js.map