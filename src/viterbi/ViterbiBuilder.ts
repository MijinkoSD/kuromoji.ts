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

import ViterbiNode from "./ViterbiNode";
import ViterbiLattice from "./ViterbiLattice";
import SurrogateAwareString from "../util/SurrogateAwareString";
import DynamicDictionaries from "../dict/DynamicDictionaries";
import DoubleArray from "doublearray.ts/dist/doubleArrayClass";
import TokenInfoDictionary from "../dict/TokenInfoDictionary";
import UnknownDictionary from "../dict/UnknownDictionary";

class ViterbiBuilder {
  trie: DoubleArray;
  token_info_dictionary: TokenInfoDictionary;
  unknown_dictionary: UnknownDictionary;

  /**
   * ViterbiBuilder builds word lattice (ViterbiLattice)
   * @param {DynamicDictionaries} dic dictionary
   * @constructor
   */
  constructor(dic: DynamicDictionaries) {
    this.trie = dic.trie;
    this.token_info_dictionary = dic.token_info_dictionary;
    this.unknown_dictionary = dic.unknown_dictionary;
  }

  /**
   * Build word lattice
   * @param {string} sentence_str Input text
   * @returns {ViterbiLattice} Word lattice
   */
  build(sentence_str: string): ViterbiLattice {
    var lattice = new ViterbiLattice();
    var sentence = new SurrogateAwareString(sentence_str);

    let trie_id: number | undefined,
      left_id: number,
      right_id: number,
      word_cost: number;
    for (var pos = 0; pos < sentence.length; pos++) {
      var tail = sentence.slice(pos);
      var vocabulary = this.trie.commonPrefixSearch(tail);
      for (var n = 0; n < vocabulary.length; n++) {
        // Words in dictionary do not have surrogate pair (only UCS2 set)
        trie_id = vocabulary[n].v;
        let key = vocabulary[n].k;
        if (key === null || key === undefined) continue;

        if (trie_id == null) continue;

        var token_info_ids = this.token_info_dictionary.target_map[trie_id];
        for (var i = 0; i < token_info_ids.length; i++) {
          // FIXME parseInt要らない説
          var token_info_id = parseInt(token_info_ids[i].toString());

          left_id =
            this.token_info_dictionary.dictionary.getShort(token_info_id);
          right_id = this.token_info_dictionary.dictionary.getShort(
            token_info_id + 2
          );
          word_cost = this.token_info_dictionary.dictionary.getShort(
            token_info_id + 4
          );

          // node_name, cost, start_index, length, type, left_id, right_id, surface_form
          lattice.append(
            new ViterbiNode(
              token_info_id,
              word_cost,
              pos + 1,
              key.length,
              "KNOWN",
              left_id,
              right_id,
              key
            )
          );
        }
      }

      // Unknown word processing
      var surrogate_aware_tail = new SurrogateAwareString(tail);
      var head_char = new SurrogateAwareString(surrogate_aware_tail.charAt(0));
      var head_char_class = this.unknown_dictionary.lookup(
        head_char.toString()
      );
      if (head_char_class === undefined) continue;
      if (
        vocabulary == null ||
        vocabulary.length === 0 ||
        head_char_class.is_always_invoke === 1
      ) {
        // Process unknown word
        let key = head_char.toString();
        if (
          head_char_class.is_grouping === 1 &&
          1 < surrogate_aware_tail.length
        ) {
          for (var k = 1; k < surrogate_aware_tail.length; k++) {
            var next_char = surrogate_aware_tail.charAt(k);
            var next_char_class = this.unknown_dictionary.lookup(next_char);
            if (head_char_class.class_name !== next_char_class?.class_name) {
              break;
            }
            key += next_char;
          }
        }

        var unk_ids =
          this.unknown_dictionary.target_map[head_char_class.class_id];
        for (var j = 0; j < unk_ids.length; j++) {
          // FIXME parseInt要らない説
          var unk_id = parseInt(unk_ids[j].toString());

          left_id = this.unknown_dictionary.dictionary.getShort(unk_id);
          right_id = this.unknown_dictionary.dictionary.getShort(unk_id + 2);
          word_cost = this.unknown_dictionary.dictionary.getShort(unk_id + 4);

          // node_name, cost, start_index, length, type, left_id, right_id, surface_form
          lattice.append(
            new ViterbiNode(
              unk_id,
              word_cost,
              pos + 1,
              key.length,
              "UNKNOWN",
              left_id,
              right_id,
              key.toString()
            )
          );
        }
      }
    }
    lattice.appendEos();

    return lattice;
  }
}

export default ViterbiBuilder;