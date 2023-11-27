<script setup lang="ts">

import {Message} from "@/types/message";
import {defineProps} from "vue";

const props = defineProps<{ message: Message }>()

</script>

<template>
    <div class="my-message message">
        <div class="message-container" v-html="message.content"></div>
    </div>
</template>

<style scoped lang="scss">

.my-message {
  max-width: 80%;
  min-height: 10px;
  color: white;

  & .message-container {
    display: inline-block;
    padding: 5px;
    border-radius: 10px;
    background-color: #2c3e50;
  }
}

</style>

