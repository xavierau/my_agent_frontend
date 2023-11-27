<template>
    <div class="home">
        <MainNav/>
        <div class="main-container">
            <h1>Personal Agent</h1>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {ref} from "vue";
import MainNav from "@/components/MainNav.vue";


const messages = ref([
    {
        type: "user",
        message: {
            id: 1,
            content: "my content"
        }
    },
    {
        type: "assistant",
        message: {
            id: 1,
            content: "assistant content"
        }
    }
])

const messageSubmit = (payload: string) => {
    console.log(payload)
    messages.value.push({
        type: "user",
        message: {
            id: 10,
            content: payload
        }
    })

}
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
      padding: 100px;
    }
  }

  .message-input {
    max-width: 100%;
    position: sticky;
    bottom: 0;
    margin-top: -80px;
  }
}

</style>



