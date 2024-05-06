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
// import { join } from "path";
import { pathJoin } from "../util/PathJoin.js";
import DynamicDictionaries from "../dict/DynamicDictionaries.js";
import { isNotContainUndefined } from "../util/TypeGuard.js";
class DictionaryLoader {
    /**
     * DictionaryLoader base constructor
     * @param {string} dic_path Dictionary path
     * @constructor
     */
    constructor(dic_path) {
        Object.defineProperty(this, "dic", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "dic_path", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.dic = new DynamicDictionaries();
        this.dic_path = dic_path;
    }
    // @ts-ignore
    async loadArrayBuffer(file, callback) {
        throw new Error("DictionaryLoader#loadArrayBuffer should be overwrite");
    }
    /**
     * Load dictionary files
     * @param {DictionaryLoader~onLoad} load_callback Callback function called after loaded
     */
    async load(load_callback) {
        const dic = this.dic;
        const dic_path = this.dic_path;
        const loadArrayBuffer = this.loadArrayBuffer;
        let prepared_callback_errs = [];
        const prepareCallback = (err) => {
            prepared_callback_errs.push(err);
        };
        const trie = async () => {
            const whenErr = (err, buffers) => {
                if (err || buffers === undefined) {
                    prepareCallback(err);
                    return;
                }
                if (!isNotContainUndefined(buffers)) {
                    return prepareCallback(err);
                }
                const base_buffer = new Int32Array(buffers[0]);
                const check_buffer = new Int32Array(buffers[1]);
                dic.loadTrie(base_buffer, check_buffer);
                prepareCallback(null);
            };
            // const loadFunc: Promise<void>[] = [];
            const buffers = await Promise.all(["base.dat.tgz", "check.dat.tgz"].map(async (filename) => {
                let result;
                await loadArrayBuffer(pathJoin([dic_path, filename]), (err, buffer) => {
                    if (err || buffer === undefined || buffer == null) {
                        return whenErr(err);
                    }
                    result = buffer;
                });
                return result;
            }));
            whenErr(null, buffers);
            // await Promise.all(loadFunc);
        };
        const takeDictionaryInfo = async () => {
            // const buffers: ArrayBufferLike[] = [];
            const whenErr = (err, buffers) => {
                if (err || buffers === undefined || buffers === null) {
                    return prepareCallback(err);
                }
                if (!isNotContainUndefined(buffers)) {
                    return prepareCallback(err);
                }
                const token_info_buffer = new Uint8Array(buffers[0]);
                const pos_buffer = new Uint8Array(buffers[1]);
                const target_map_buffer = new Uint8Array(buffers[2]);
                dic.loadTokenInfoDictionaries(token_info_buffer, pos_buffer, target_map_buffer);
                prepareCallback(null);
            };
            const buffers = await Promise.all(["tid.dat.tgz", "tid_pos.dat.tgz", "tid_map.dat.tgz"].map(async (filename) => {
                let result;
                await loadArrayBuffer(pathJoin([dic_path, filename]), (err, buffer) => {
                    if (err || buffer === undefined || buffer == null) {
                        return whenErr(err);
                    }
                    result = buffer;
                });
                return result;
            }));
            whenErr(null, buffers);
        };
        const connectionCostMatrix = async () => {
            await loadArrayBuffer(pathJoin([dic_path, "cc.dat.tgz"]), (err, buffer) => {
                if (err) {
                    return prepareCallback(err);
                }
                let cc_buffer;
                if (buffer === null || buffer === undefined) {
                    cc_buffer = new Int16Array(0);
                }
                else {
                    cc_buffer = new Int16Array(buffer, 0, Math.floor(buffer.byteLength / 2));
                }
                dic.loadConnectionCosts(cc_buffer);
                prepareCallback(null);
            });
        };
        const unknownDictionaries = async () => {
            // const buffers: ArrayBufferLike[] = [];
            const whenErr = (err, buffers) => {
                if (err || !buffers) {
                    return prepareCallback(err);
                }
                if (!isNotContainUndefined(buffers)) {
                    return prepareCallback(err);
                }
                const unk_buffer = new Uint8Array(buffers[0]);
                const unk_pos_buffer = new Uint8Array(buffers[1]);
                const unk_map_buffer = new Uint8Array(buffers[2]);
                const cat_map_buffer = new Uint8Array(buffers[3]);
                const compat_cat_map_buffer = new Uint32Array(buffers[4]);
                const invoke_def_buffer = new Uint8Array(buffers[5]);
                dic.loadUnknownDictionaries(unk_buffer, unk_pos_buffer, unk_map_buffer, cat_map_buffer, compat_cat_map_buffer, invoke_def_buffer);
                // dic.loadUnknownDictionaries(char_buffer, unk_buffer);
                prepareCallback(null);
            };
            const buffers = await Promise.all([
                "unk.dat.tgz",
                "unk_pos.dat.tgz",
                "unk_map.dat.tgz",
                "unk_char.dat.tgz",
                "unk_compat.dat.tgz",
                "unk_invoke.dat.tgz",
            ].map(async (filename) => {
                let result;
                await loadArrayBuffer(pathJoin([dic_path, filename]), (err, buffer) => {
                    if (err || buffer === undefined || buffer === null) {
                        return whenErr(err);
                    }
                    result = buffer;
                });
                return result;
            }));
            whenErr(null, buffers);
        };
        await Promise.all([
            trie(),
            takeDictionaryInfo(),
            connectionCostMatrix(),
            unknownDictionaries(),
        ]).catch((error) => {
            prepareCallback(error);
        });
        if (prepared_callback_errs.length > 0) {
            // 元々はエラーが複数発生しても、全てのエラー情報を返さずにどれか1つを返すような仕様だったらしい
            // 以下の処理で正しいかはわからないけれど、とりあえず1個だけ返すようにする
            let errIndex = prepared_callback_errs.findIndex((e) => e !== null);
            errIndex = errIndex == -1 ? 0 : errIndex;
            load_callback(prepared_callback_errs[errIndex], dic);
        }
    }
}
export default DictionaryLoader;
//# sourceMappingURL=DictionaryLoader.js.map