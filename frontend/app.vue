<template>
  <main class="container">
    <form @submit.prevent="requestChanges">
      <label for="prompt">Prompt:</label>
      <input v-model="prompt" type="text" placeholder="Faz tudo melhor" />
      <button :aria-busy="status === 'pending'" type="submit">Melhorar</button>
    </form>
    <br />
    <hr />
    <br />
    <malleable-component />
  </main>
</template>

<script lang="ts" setup>
import '@picocss/pico';
import { firebaseFunctions } from '~/plugins/firebase';

const prompt = ref('');
const status = ref<'idle' | 'pending'>('idle');

const malleables = reactive<Record<string, any>>({
  template: `<div class='container'></div>`,
  script: {
    data: {},
    methods: {},
    computed: {},
    watch: {},
  },
});

const MalleableComponent = defineComponent({
  setup() {
    return () =>
      h({
        data: () => malleables.script?.data,
        methods: Object.fromEntries(
          Object.entries(malleables.script?.methods ?? {}).map(([key, value]) => [key, new Function('return ' + value)()]),
        ),
        computed: Object.fromEntries(
          Object.entries(malleables.script?.computed ?? {}).map(([key, value]) => [key, new Function('return ' + value)()]),
        ),
        watch: Object.fromEntries(
          Object.entries(malleables.script?.watch ?? {}).map(([key, value]) => [key, new Function('return ' + value)()]),
        ),
        template: malleables.template,
      });
  },
});

async function requestChanges() {
  status.value = 'pending';

  const response = <{ data: { malleables: Record<string, unknown> } }>(
    await firebaseFunctions.openaiCompletion({ prompt: prompt.value, malleables: malleables })
  );
  for (const key in response.data.malleables) {
    malleables[key] = response.data.malleables[key];
  }
  status.value = 'idle';
}
</script>
