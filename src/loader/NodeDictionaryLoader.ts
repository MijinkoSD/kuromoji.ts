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

var fs = require("fs");
var node_zlib = require("zlib");
import DictionaryLoader from "./DictionaryLoader";

/**
 * @callback NodeDictionaryLoader~onLoad
 * @param {Object} err Error object
 * @param {Uint8Array} buffer Loaded buffer
 */
export type NodeDictionaryLoaderOnLoad = (
  err: Error | null,
  buffer?: Uint8Array,
) => void;

class NodeDictionaryLoader extends DictionaryLoader {
  /**
   * NodeDictionaryLoader inherits DictionaryLoader
   * @param {string} dic_path Dictionary path
   * @constructor
   */
  constructor(dic_path: string) {
    super(dic_path);
  }

  /**
   * Utility function
   * @param {string} file Dictionary file path
   * @param {NodeDictionaryLoader~onLoad} callback Callback function
   */
  loadArrayBuffer(file: string, callback: NodeDictionaryLoaderOnLoad) {
    fs.readFile(file, function (err, buffer) {
      if (err) {
        return callback(err);
      }
      node_zlib.gunzip(buffer, function (err2, decompressed) {
        if (err2) {
          return callback(err2);
        }
        var typed_array = new Uint8Array(decompressed);
        callback(null, typed_array.buffer);
      });
    });
  }
}

export default NodeDictionaryLoader;
