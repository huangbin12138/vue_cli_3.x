<template>
  <div class="v-slot">
    <t-slot>
      {{1456}}
      <template #error="{id}">
        <div class="" style="color: red">{{id}}</div>
      </template>
      {{1456}}
    </t-slot>
  </div>
</template>

<script>
  import tSlot from './Vslot_comp'

  export default {
    components: {
      tSlot,
    },
    name: "Vslot"
  }
</script>

<style scoped>

</style>