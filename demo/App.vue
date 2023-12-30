<script setup lang="ts">
import Tokenizer from "../src/Tokenizer";
import kuromoji from "../src/kuromoji";
import { ref, onMounted } from "vue";
import { IpadicFormatterToken } from "../src/util/IpadicFormatter";

const DIC_URL = "dict/";

const inputText = ref("");
const tokens = ref<IpadicFormatterToken[]>([]);
const svgStyle = ref("");
const message = ref("");
const isLoading = ref(false);
let tokenizer: Tokenizer | undefined = undefined;

const tokenize = () => {
  if (inputText.value == "" || tokenizer === undefined) {
    tokens.value = [];
    // lattice = null;
    return;
  }
  try {
    // lattice = tokenizer.getLattice(inputText);
    tokens.value = tokenizer.tokenize(inputText.value);
  } catch (e) {
    console.log(e);
    // lattice = null;
    tokens.value = [];
  }
};

// フォームの内容が変化したらtokenizeする
const onChangeInput = () => {
  // vm.graphEnabled = false;
  svgStyle.value = "hidden";
  tokenize();
};

onMounted(() => {
  // Load and prepare tokenizer
  kuromoji.builder({ dicPath: DIC_URL }).build((error, _tokenizer) => {
    if (error != null) {
      console.log(error);
    }
    tokenizer = _tokenizer;

    message.value = "Ready";

    inputText.value = "すもももももももものうち";
    isLoading.value = false;
  });
});
</script>

<template>
  <div class="row">
    <div class="small-12 columns">
      <h1>kuromoji.js demo</h1>

      <div id="demo" class="row">
        <div class="large-12 columns">
          <div v-show="isLoading" data-alert="" class="alert-box radius">
            <div v-text="message"></div>
          </div>

          <form v-show="!isLoading">
            <label
              >解析対象
              <input
                type="text"
                placeholder="解析したい文字列を入力してください"
                v-model="inputText"
                @input="onChangeInput"
              />
              <input type="text" name="dummy" style="display: none" />
            </label>

            <table v-show="tokens.length" width="100%">
              <thead>
                <tr>
                  <th>表層形</th>
                  <th>品詞</th>
                  <th>品詞細分類1</th>
                  <th>品詞細分類2</th>
                  <th>品詞細分類3</th>
                  <th>活用型</th>
                  <th>活用形</th>
                  <th>基本形</th>
                  <th>読み</th>
                  <th>発音</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="token in tokens">
                  <td>{{ token.surface_form }}</td>
                  <td>{{ token.pos }}</td>
                  <td>{{ token.pos_detail_1 }}</td>
                  <td>{{ token.pos_detail_2 }}</td>
                  <td>{{ token.pos_detail_3 }}</td>
                  <td>{{ token.conjugated_type }}</td>
                  <td>{{ token.conjugated_form }}</td>
                  <td>{{ token.basic_form }}</td>
                  <td>{{ token.reading }}</td>
                  <td>{{ token.pronunciation }}</td>
                </tr>
              </tbody>
            </table>

            <!--
                    <a href="#" v-on="click: drawGraph" v-show="svgStyle=='hidden'" class="radius button">ラティスを表示する</a>
                    -->

            <!-- <svg style="{ visibility: svgStyle }" width="100%" height="800px">
              <g id="lattice" transform="translate(20,20)"></g>
            </svg> -->
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
text {
  font-weight: 300;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 12px;
}

.node rect {
  stroke: #999;
  stroke-width: 1px;
  fill: #fff;
}

.edgeLabel rect {
  fill: #fff;
}

.edgePath path {
  stroke: #333;
  stroke-width: 1.5px;
  fill: none;
}
</style>
../src/Tokenizer.ts../src/kuromoji.ts../src/util/IpadicFormatter.ts
