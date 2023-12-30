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

import { chai, describe, beforeAll, it } from "vitest";
const expect = chai.expect;
import DictionaryLoader from "../../src/loader/DictionaryLoader";
import DynamicDictionaries from "../../src/dict/DynamicDictionaries";
import { resolve } from "path";

const DIC_DIR = "dict/";

describe("DictionaryLoader", () => {
  let dictionaries: DynamicDictionaries; // target object

  beforeAll(
    async () =>
      new Promise((resolve) => {
        const loader = new DictionaryLoader(DIC_DIR);
        loader.load((err, dic) => {
          if (dic === undefined) {
            throw new TypeError("dic must not be undefined");
          }
          dictionaries = dic;
          resolve();
        });
      }),
    1 * 60 * 1000 // To timeout after a minutes
  );

  it("Unknown dictionaries are loaded properly", () => {
    expect(dictionaries.unknown_dictionary.lookup(" ")).to.deep.equal({
      class_id: 1,
      class_name: "SPACE",
      is_always_invoke: 0,
      is_grouping: 1,
      max_length: 0,
    });
  });
  it("TokenInfoDictionary is loaded properly", () => {
    expect(
      dictionaries.token_info_dictionary.getFeatures("0")
    ).to.have.length.above(1);
  });
});

describe("DictionaryLoader about loading", () => {
  it(
    "could load directory path without suffix /",
    async () =>
      new Promise<void>((resolve) => {
        var loader = new DictionaryLoader("dict"); // not have suffix /
        loader.load((err, dic) => {
          expect(err).to.be.null;
          expect(dic).to.not.be.undefined;
          resolve();
        });
      }),
    {
      timeout: 1 * 60 * 1000, // 1 minutes
    }
  );
  it("couldn't load dictionary, then call with error", async () =>
    new Promise<void>((resolve) => {
      var loader = new DictionaryLoader("non-exist/dictionaries");
      loader.load((err, dic) => {
        expect(err).to.be.an.instanceof(Error);
        resolve();
      });
    }));
});
