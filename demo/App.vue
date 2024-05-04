<script setup lang="ts">
import Tokenizer from "../src/Tokenizer";
import kuromoji from "../src/kuromoji";
import { ref, onMounted } from "vue";
import { IpadicFormatterToken } from "../src/util/IpadicFormatter";
import ResultTable from "./components/ResultTable.vue";

const DIC_URL = "/";

const inputText = ref("");
const tokens = ref<IpadicFormatterToken[]>([]);
const svgStyle = ref("");
const messageBeforeLoaded = ref("ロード中です。");
const isLoading = ref(true);
let tokenizer: Tokenizer | undefined = undefined;

const tokenize = () => {
  if (inputText.value == "" || tokenizer === undefined) {
    tokens.value = [];
    return;
  }
  try {
    tokens.value = tokenizer.tokenize(inputText.value);
  } catch (e) {
    console.error(e);
    tokens.value = [];
  }
};

// フォームの内容が変化したらtokenizeする
const onChangeInput = () => {
  svgStyle.value = "hidden";
  tokenize();
};

onMounted(async () => {
  // Load and prepare tokenizer
  // tokeniserの生成・読み込み
  await kuromoji
    .builder({ dicPath: DIC_URL })
    .buildBrowser((errors, _tokenizer) => {
      if (errors.find((e) => e !== null)) {
        for (const error of errors) {
          if (error === null) continue;
          console.error(error);
        }
      }
      tokenizer = _tokenizer;

      inputText.value = "すもももももももものうち";
      isLoading.value = false;
    });
  tokenize();
});
</script>

<template>
  <div id="app">
    <header>
      <span class="title">kuromoji<span class="accent">.ts</span> demo</span>
    </header>

    <main>
      <div v-show="isLoading" data-alert="" class="alert-box radius">
        <div class="text-area">
          <p>{{ messageBeforeLoaded }}</p>
        </div>
      </div>

      <div v-show="!isLoading" class="demo">
        <div class="input">
          <label class="label">解析対象</label>
          <div class="input-area">
            <input
              type="text"
              placeholder="解析したい文字列を入力してください"
              v-model="inputText"
              @input="onChangeInput"
            />
            <div class="outline" />
          </div>
        </div>

        <ResultTable :tokens="tokens"></ResultTable>
      </div>
    </main>
  </div>
</template>

<style scoped>
#app {
  --color-1: hsl(211 84% 50% / 1);
  --color-w: hsl(80 50% 90% / 1);
  --color-2: hsl(51 84% 50% / 1);
}

header {
  margin: 0.5em 0 1em;
  padding: 0 1em;
  /* box-shadow: 0px 3px 1px -1px hsl(160 0% 80% / 1); */
}

.title {
  padding-bottom: 0.1em;
  display: inline-block;
  width: 100%;
  letter-spacing: -1px;
  font-size: 2.5em;
  font-family: "Nunito Sans", sans-serif;
  font-weight: 700;

  * {
    font-family: "Nunito Sans", sans-serif;
  }

  .accent {
    font-weight: 800;
    background: linear-gradient(
      120deg,
      var(--color-1) 48%,
      color-mix(in srgb-linear, var(--color-1), var(--color-w)) 53%,
      color-mix(in srgb-linear, var(--color-w), var(--color-2)) 62%,
      var(--color-2) 67%
    );
    background-clip: text;
    color: transparent;
  }
}

main {
  padding: 0 2em;
}

.demo {
  display: flex;
  flex-direction: column;
  gap: 2em;
}

.input {
  display: flex;
  flex-direction: column;

  .label {
    font-size: 0.9em;
  }

  .input-area {
    /* width: 100%;
    height: fit-content; */
    padding-left: 0.5em;
  }

  input {
    border: none;
    padding: 0;
    outline: none;
    width: 100%;
    font-size: 1.2em;
    font-weight: 600;
    border-image: linear-gradient(90deg, #ccc, #ccc) 1;
  }

  .outline {
    margin-right: auto;
    border-bottom: 2px solid #ccc;
    display: block;
    width: 100%;
    height: 0;
    border-radius: 3px;

    &::after {
      content: "";
      border-bottom: 2px solid hsl(211 77% 65% / 1);
      display: block;
      width: 0%;
      transition: all 0.3s 0s ease;
    }
  }

  input:focus-visible ~ .outline::after {
    width: 100%;
  }
}
</style>
