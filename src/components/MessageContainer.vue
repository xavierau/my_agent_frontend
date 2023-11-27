<script setup lang="ts">

import {Component, nextTick, ref} from "vue";
import MyMessage from "@/components/MyMessage.vue";
import AssistantMessage from "@/components/AssistantMessage.vue";
import {DBMessage, Message} from "@/types/message";
import MessageInput from "@/components/MessageInput.vue";
import {generateUUID, scrollToBottom} from "@/utils";
import axios from "axios";
import * as config from "@/config";


const messages = ref<Array<Message>>([])
const messagesContainer = ref<HTMLElement | null>(null)

const components = {
    MyMessage,
    AssistantMessage
}

axios.get(config.host + '/messages?page=1&limit=25&session_id:1212a')
    .then(({data}) => {
        messages.value = data.map((m: DBMessage): Message => {
            return {
                id: m.message.id,
                role: m.role,
                content: Array.isArray(m.message.content) ? m.message.content[0].text : m.message.content,
            }
        }).reverse()

        nextTick(() => scrollToBottom(messagesContainer.value))
    })

const messageSubmit = (payload: string) => {

    const data = {
        content: payload
    }
    const user_message: Message = {
        id: generateUUID(),
        role: "user",
        content: payload
    }

    const temp_message: Message = {
        id: generateUUID(),
        role: "assistant",
        content: "<i class=\"fa fa-spinner fa-spin fa-3x fa-fw\"></i>Loading.."
    }

    messages.value.push(user_message)
    messages.value.push(temp_message)
    nextTick(() => scrollToBottom(messagesContainer.value))


    axios.post(config.host + '/call', data)
        .then(({data}) => {
            messages.value.pop()
            messages.value.push({
                id: data.id,
                role: "assistant",
                content: data.message
            } as Message)

            nextTick(() => scrollToBottom(messagesContainer.value))
        })
}
const getComponent = (role: string): Component => {
    return role === "user" ?
        components['MyMessage'] :
        components['AssistantMessage']
}
</script>

<template>
    <div class="messages-container" ref="messagesContainer">
        <div class="messages">
            <component v-for="msg in messages"
                       :key="msg.id"
                       :is="getComponent(msg.role)"
                       :message="msg"></component>
        </div>

        <MessageInput @submit="messageSubmit"></MessageInput>
    </div>

</template>

<style scoped lang="scss">
.messages-container {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  width: 100%;
  max-width: 900px;
  height: 90vh;
  overflow-y: scroll;
  transition: all 0.5s ease-in-out;
  padding-bottom: 100px;

  code {
    background-color: #1e1e1e;
    color: #fff;
    padding: 10px;
    border-radius: 5px;
    margin: 10px;
  }

  & .my-message, & .assistant-message {
    display: block;
    margin: 10px;
    text-align: left;
  }

  & .my-message {
    margin-left: auto;
    margin-right: 0;
    text-align: right;
  }


  .message-input {
    max-width: 100%;
    position: sticky;
    bottom: 0;
    margin-top: -80px;
  }

  .messages {
    padding-bottom: 100px;
  }

}


</style>
