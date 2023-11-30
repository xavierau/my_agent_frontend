<script setup lang="ts">

import {Message} from "@/types/message";
import {computed, defineProps, onMounted, ref} from "vue";

const props = defineProps<{ message: Message }>()
const image_url = ref<string| null>(null)
const extract_image_url = ()=>{
// regex to extract the url from the message the patteren is `````\n<url>\n`````
  const regex = /`````\nimage_url: (.*)\n`````/g
  const match = regex.exec(props.message.content)
  if (match) {
    image_url.value = match[1]
  }
}

onMounted(()=>{
  extract_image_url()
})

const no_image_url_content = computed(()=>{
  return props.message.content.replace(/\n`````\nimage_url: (.*)\n`````/g,"")
})

</script>

<template>
    <div class="my-message message">
        <div class="message-container" >
          <div class="message" v-html="no_image_url_content"></div>
          <div v-if="image_url || message.urls?.length" class="image-container">
            <img :src="image_url" alt="image" style="max-width: 100%;max-height: 100%">
          </div>
        </div>

    </div>
</template>

<style scoped lang="scss">

.my-message {
  max-width: 80%;
  min-height: 10px;
  color: white;

  & .message-container {
    display: inline-block;
    padding: 10px;
    border-radius: 10px;
    background-color: #2c3e50;
    .message{
      text-align: left;
    }
  }

  .image-container {
    margin:15px;
    img {
      max-height: 200px;
      max-width: 80%;
    }
  }
}

</style>

