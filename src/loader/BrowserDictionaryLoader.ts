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

import { gunzip } from "node:zlib";
import DictionaryLoader from "./DictionaryLoader";

/**
 * Callback
 * @callback BrowserDictionaryLoader~onLoad
 * @param {Object} err Error object
 * @param {Uint8Array} buffer Loaded buffer
 */
export type BrowserDictionaryLoaderOnLoad = (
  err: string | ProgressEvent<EventTarget> | null,
  buffer: ArrayBufferLike | null
) => void;

class BrowserDictionaryLoader extends DictionaryLoader {
  /**
   * BrowserDictionaryLoader inherits DictionaryLoader, using jQuery XHR for download
   * @param {string} dic_path Dictionary path
   * @constructor
   */
  constructor(dic_path: string) {
    super(dic_path);
  }

  /**
   * Utility function to load gzipped dictionary
   * @param {string} url Dictionary URL
   * @param {BrowserDictionaryLoader~onLoad} callback Callback function
   */
  async loadArrayBuffer(url: string, callback: BrowserDictionaryLoaderOnLoad) {
    return new Promise<void>((resolve) => {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", url, true);
      xhr.responseType = "arraybuffer";
      xhr.onload = function () {
        if (this.status > 0 && this.status !== 200) {
          callback(xhr.statusText, null);
          resolve();
          return;
        }
        const arraybuffer = this.response as ArrayBuffer;

        gunzip(arraybuffer, (_, result) => {
          callback(null, result.buffer);
          resolve();
        });
      };
      xhr.onerror = function (err) {
        callback(err, null);
        resolve();
      };
      xhr.send();
    });
  }
}

export default BrowserDictionaryLoader;
