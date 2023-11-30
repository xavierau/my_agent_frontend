<script setup lang="ts">
import {computed, defineProps} from "vue";
import {Message} from "@/types/message";
import showdown from "showdown";

interface Props {
    message: Message
}

const props = defineProps<Props>()
const converter = new showdown.Converter();
converter.setOption('tables', true);
converter.setOption('ghCodeBlocks', true);


const getProgrammingLanguage = (context: string) => {

// Regular expression to match code blocks with language specifier
    const regex = /```(\w+)\n([\s\S]*?)```/g;

// Extract matches
    let match;
    while ((match = regex.exec(context)) !== null) {
        return {
            language: match[1].toLowerCase(),
            code: match[0]
        };
    }
    return null;

}

const convertContent = computed(() => converter.makeHtml(props.message.content))

</script>

<template>
    <div class="assistant-message message">
        <div class="message-container" v-html="convertContent"></div>
    </div>

</template>

<style  lang="scss">
.assistant-message {
  max-width: 80%;
  min-height: 10px;

  .message-container {
    display: inline-block;
    padding: 10px;
    border-radius: 10px;
    background-color: lightgrey;

    img {
      max-width: 100% ;
    }

    table {
      border-collapse: collapse;
      border-spacing: 0;
      border: 1px solid #ddd;
      background: lightgray;
      th, td{
        border: 1px solid #ddd;
        padding: 5px !important;

      }
    }
  }
}

h1 {
  font-size: 1.2em;
}

</style>
