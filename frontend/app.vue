<template>
  <Head>
    <Title>Malleable App</Title>
    <Meta name="description" content="Malleable App" />
  </Head>
  <main class="container section">
    <div><h1 class="is-size-2 mb-4">Malleable App</h1></div>
    <form @submit.prevent="requestChanges">
      <label for="prompt" class="label mr-4">Prompt:</label>
      <div class="field has-addons">
        <div class="control is-expanded">
          <input v-model="prompt" id="prompt" type="text" placeholder="Faz tudo melhor" class="input is-medium" />
        </div>
        <div class="control">
          <button :class="{ 'is-loading': status === 'pending' }" type="submit" class="button is-medium is-info">Melhorar</button>
        </div>
      </div>
    </form>
    <hr />
    <malleable-component />
  </main>
</template>

<script lang="ts" setup>
import { firebaseFunctions } from '~/config/firebase';

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

  console.log('Novo Estado: ', response.data.malleables);

  for (const key in response.data.malleables) {
    malleables[key] = response.data.malleables[key];
  }
  status.value = 'idle';
}
</script>
