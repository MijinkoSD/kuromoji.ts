<script setup lang="ts">
import { IpadicFormatterToken } from "../../src/util/IpadicFormatter";

defineProps<{
  tokens: IpadicFormatterToken[];
}>();
</script>

<template>
  <table v-show="tokens.length" class="result">
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
</template>

<style scoped>
.result {
  box-sizing: content-box;
  border: 1px solid transparent;
  border-collapse: collapse;
  width: 100%;
  max-width: 1200px;
  border-radius: 3px;
  overflow: hidden;
}

thead {
  background-color: hsl(0 0% 55% / 1);
  color: white;

  th {
    font-weight: normal;
  }
}

tbody tr:nth-child(even) {
  background-color: hsl(0 0% 90% / 1);
}

th,
td {
  border: 1px solid hsl(0 0% 80% / 1);
  padding: 0.25em;
}
</style>
