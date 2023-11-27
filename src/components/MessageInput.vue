<script setup lang="ts">

import {defineEmits, ref} from "vue";

interface Props {
    message: {
        type: string,
        message: {
            id: number,
            content: string
        }
    }
}

const message = ref("")
const emit = defineEmits<{
    (e: 'submit', payload: string): void
}>()
const submitMessage = () => {
    if (message.value) {
        emit('submit', message.value)
        message.value = ""
    }
}

</script>

<template>
    <div class="message-input">
        <div class="input-container">
            <textarea rows="4" placeholder="Type your message here..." v-model="message"></textarea>
            <button @click.prevent="submitMessage" :disabled="!message">
                <i class="fas fa-paper-plane"></i>send
            </button>
        </div>
    </div>

</template>

<style scoped lang="scss">

.message-input {
  width: 100%;
  display: flex;
  justify-content: center;

  .input-container {
    width: 80%;
    display: flex;
    justify-content: center;

    textarea {
      padding: 5px;
      width: 80%;
      border-bottom-left-radius: 10px;
      border-top-left-radius: 10px;
    }

    button {
      border: 1px solid gray;
      border-bottom-right-radius: 10px;
      border-top-right-radius: 10px;
    }
  }
}
</style>
