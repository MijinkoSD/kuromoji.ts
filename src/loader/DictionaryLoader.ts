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

import path from "node:path";
import DynamicDictionaries from "../dict/DynamicDictionaries";
import { NodeDictionaryLoaderOnLoad } from "./NodeDictionaryLoader";

// import "../../public/kuromoji/";

/**
 * Callback
 * @callback DictionaryLoader~onLoad
 * @param {Object} err Error object
 * @param {DynamicDictionaries} dic Loaded dictionary
 */
export type DictionaryLoaderOnLoad = (
  err: Object | null,
  dic?: DynamicDictionaries
) => void;

class DictionaryLoader {
  dic: DynamicDictionaries;
  dic_path: string;

  /**
   * DictionaryLoader base constructor
   * @param {string} dic_path Dictionary path
   * @constructor
   */
  constructor(dic_path: string) {
    this.dic = new DynamicDictionaries();
    this.dic_path = dic_path;
  }

  loadArrayBuffer(file: string, callback: NodeDictionaryLoaderOnLoad) {
    throw new Error("DictionaryLoader#loadArrayBuffer should be overwrite");
  }

  /**
   * Load dictionary files
   * @param {DictionaryLoader~onLoad} load_callback Callback function called after loaded
   */
  async load(load_callback: DictionaryLoaderOnLoad) {
    const dic = this.dic;
    const dic_path = this.dic_path;
    const loadArrayBuffer = this.loadArrayBuffer;

    const trie = async (): Promise<void> => {
      const whenErr = (
        err: Object | null,
        buffers?: ArrayBufferLike | null
      ) => {
        if (err || buffers === undefined || buffers === null) {
          load_callback(err);
          return;
        }
        // 型エラーの握り潰し
        const _buffers = buffers as Uint8Array;
        var base_buffer = new Int32Array(_buffers[0]);
        var check_buffer = new Int32Array(_buffers[1]);

        dic.loadTrie(base_buffer, check_buffer);
        load_callback(null);
      };

      const loadFunc: (() => void)[] = [];
      ["base.dat.gz", "check.dat.gz"].map((filename) => {
        loadFunc.push(() =>
          loadArrayBuffer(
            path.join(dic_path, filename),
            function (err, buffer) {
              if (err) {
                return whenErr(err);
              }
              whenErr(null, buffer);
            }
          )
        );
      });
      await Promise.all(loadFunc);
    };

    const takeDictionaryInfo = async (): Promise<void> => {
      const whenErr = (
        err: Object | null,
        buffers?: ArrayBufferLike | null
      ) => {
        if (err || buffers === undefined || buffers === null) {
          return load_callback(err);
        }
        // 型エラーの握り潰し
        const _buffers = buffers as Uint8Array;
        var token_info_buffer = new Uint8Array(_buffers[0]);
        var pos_buffer = new Uint8Array(_buffers[1]);
        var target_map_buffer = new Uint8Array(_buffers[2]);

        dic.loadTokenInfoDictionaries(
          token_info_buffer,
          pos_buffer,
          target_map_buffer
        );
        load_callback(null);
      };

      const loadFunc: (() => void)[] = [];
      ["tid.dat.gz", "tid_pos.dat.gz", "tid_map.dat.gz"].map((filename) => {
        loadFunc.push(() =>
          loadArrayBuffer(
            path.join(dic_path, filename),
            function (err, buffer) {
              if (err) {
                return whenErr(err);
              }
              whenErr(null, buffer);
            }
          )
        );
      });
      await Promise.all(loadFunc);
    };

    const connectionCostMatrix = async (): Promise<void> => {
      loadArrayBuffer(path.join(dic_path, "cc.dat.gz"), function (err, buffer) {
        if (err || buffer === undefined || buffer === null) {
          return load_callback(err);
        }
        var cc_buffer = new Int16Array(buffer);
        dic.loadConnectionCosts(cc_buffer);
        load_callback(null);
      });
    };

    const unknownDictionaries = async (): Promise<void> => {
      const whenErr = (
        err: Object | null,
        buffers?: ArrayBufferLike | null
      ) => {
        if (err || !buffers) {
          return load_callback(err);
        }
        // 型エラーの握り潰し
        const _buffers = buffers as Uint8Array;
        var unk_buffer = new Uint8Array(_buffers[0]);
        var unk_pos_buffer = new Uint8Array(_buffers[1]);
        var unk_map_buffer = new Uint8Array(_buffers[2]);
        var cat_map_buffer = new Uint8Array(_buffers[3]);
        var compat_cat_map_buffer = new Uint32Array(_buffers[4]);
        var invoke_def_buffer = new Uint8Array(_buffers[5]);

        dic.loadUnknownDictionaries(
          unk_buffer,
          unk_pos_buffer,
          unk_map_buffer,
          cat_map_buffer,
          compat_cat_map_buffer,
          invoke_def_buffer
        );
        // dic.loadUnknownDictionaries(char_buffer, unk_buffer);
        load_callback(null);
      };

      [
        "unk.dat.gz",
        "unk_pos.dat.gz",
        "unk_map.dat.gz",
        "unk_char.dat.gz",
        "unk_compat.dat.gz",
        "unk_invoke.dat.gz",
      ].map((filename) => {
        loadArrayBuffer(path.join(dic_path, filename), function (err, buffer) {
          if (err) {
            return whenErr(err);
          }
          whenErr(null, buffer);
        });
      });
    };

    await Promise.all([
      trie,
      takeDictionaryInfo,
      connectionCostMatrix,
      unknownDictionaries,
    ]);
  }
}

export default DictionaryLoader;