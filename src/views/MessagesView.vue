<template>
    <div class="home">
        <router-link :to="{name:'audio'}">Audio Mode</router-link>
        <div class="main-container">
            <MessageContainer></MessageContainer>
        </div>


    </div>
</template>

<script lang="ts" setup>
import MessageContainer from "@/components/MessageContainer.vue";
import {ref} from "vue";
import {Message} from "@/types/message";


const messages = ref<Array<Message>>([])


</script>

<style scoped lang="scss">
.home {
  width: 100%;
  min-height: 80vh;
  max-width: 900px;
  margin: 0 auto;
  position: relative;

  .main-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .messages-container {
      padding: 20px;

    }
  }
}

</style>



