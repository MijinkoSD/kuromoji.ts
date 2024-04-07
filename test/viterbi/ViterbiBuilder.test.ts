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

import NodeDictionaryLoader from "../../src/loader/NodeDictionaryLoader";
import ViterbiBuilder from "../../src/viterbi/ViterbiBuilder";
import { beforeAll, chai, describe, it } from "vitest";
const expect = chai.expect;

const DIC_DIR = "dict/";

describe("ViterbiBuilder", () => {
  let viterbi_builder: ViterbiBuilder; // target object

  beforeAll(
    async () => {
      const loader = new NodeDictionaryLoader(DIC_DIR);
      await loader.load((err, dic) => {
        if (dic === undefined) throw TypeError("dic must not be undefined");
        viterbi_builder = new ViterbiBuilder(dic);
      });
    },
    5 * 60 * 1000 // To timeout after 5 minutes
  );

  it("Unknown word", () => {
    // lattice to have "ト", "トト", "トトロ"
    var lattice = viterbi_builder.build("トトロ");
    for (var i = 1; i < lattice.eos_pos; i++) {
      var nodes = lattice.nodes_end_at[i];
      if (nodes == null) {
        continue;
      }
      expect(
        nodes.map((node) => {
          return node.surface_form;
        })
      ).to.include("トトロ".slice(0, i));
    }
  });
});
