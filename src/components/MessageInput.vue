<script setup lang="ts">

import {defineEmits, ref} from "vue";
import {SubmitMessagePayload} from "@/types/message";

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
const fileContainer = ref<HTMLInputElement|null>(null)
const emit = defineEmits<{
  (e: 'submit', payload: SubmitMessagePayload): void
}>()
const filePreview = ref<string|null>(null) // Ref for the file preview
const fileName = ref<string|null>(null) // New ref for the file name
const selectedFile = ref<File|null>(null) // Ref for the selected file


// Add this method to handle file selection
const handleFileChange = (event: Event) => {
  const files = (event.target as HTMLInputElement).files;
  if (files) {
    const file = files[0];
    selectedFile.value = file; // Store the selected file in the ref
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        filePreview.value = e.target?.result as string; // Store the file Data URL in the ref
      };
      reader.readAsDataURL(file);
    } else {
      filePreview.value = null; // Clear the file preview
      fileName.value = file.name; // Store the file name in the ref
    }
  }
}

const selectFile = () => {
    fileContainer.value?.click()
}


const submitMessage = () => {
    if (message.value) {
      emit('submit',  {
        message: message.value,
        file: selectedFile.value || null,
        fileName: fileName.value || null,
        filePreview: filePreview.value || null
      });
      message.value = "";
      selectedFile.value = null;
      filePreview.value = null;
      fileName.value = null;
    }
}

</script>

<template>
  <div class="message-input">
      <div v-if="filePreview || fileName" class="file-preview">
        <img v-if="filePreview" :src="filePreview" alt="File preview">
        <div v-else>
          <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJcAAACUCAMAAACp1UvlAAAASFBMVEXS0tLy8vL///+AgID29vba2trn5+fq6uq5ubnExMSEhITV1dV5eXn5+fl8fHzOzs6lpaWYmJiKiopzc3OxsbGenp6QkJDh4eFQLFKGAAABh0lEQVR4nO3cSXLDMAwFUVnwKNOUx/j+Nw2TvSWCCgClqvsErz64sRfq+nXW9f12ff26NusLly5cunDp+q+uQ2vGrrFr6/Tcbi1djazuJNfNEpiZa0ivywKYnUvSksUMXZJe7W/M0rVkMVOXpFvrYrauAju0wYxdkm9tp7R2lcfftJi5S9K9ZTF7V9sbc3BJ+tqrYR4uyXqYi0vyoIX5uMpibx3MyVUWe1/W6JJ8V53SzVVkOwXM0zUo3pijq3SufmOurjxUn9J3r5xqF/N1lSoXc3elsQrm7iqL1ZwywJVOFbAAl+SKU0a4ahYLcZXHPweLcUk6zpwyyDV7yijXkI6TsCiXyGNysTiXTC4W6JLHxOOPdEl6flws1DWxmJHrXOf6+efOd6/xWNfzw68kK1d3rqvb++5VHS5cuHDhwoULFy5cuHDhwoULFy5cuHDhwoULFy5cuHDhwoULFy5cuHDhwoULFy5cuHDhwoULFy5cf+jaWffh2ydzrqhw6cKlC5cuXLr6/hueekawV2U6rwAAAABJRU5ErkJggg==" alt="Default thumbnail">
          <p>{{ fileName }}</p>
        </div>
      </div>
        <div class="input-container">
          <!-- Modified div for the file preview -->
          <input type="file" style="display:none" ref="fileContainer"  @change="handleFileChange">
          <button @click.prevent="selectFile" class="select-file-button">
            <i class="fa fa-file-o"></i>
          </button>
            <textarea rows="4" placeholder="Type your message here..." v-model="message"></textarea>
            <button class="send-button" @click.prevent="submitMessage" :disabled="!message">
                <i class="fas fa-paper-plane"></i>send
            </button>
        </div>
    </div>

</template>

<style scoped lang="scss">

.message-input {
  width: 100%;

  .file-preview{
    margin: 0 auto;
    display: flex;
    justify-content: start;
    width: 64%;
    img{
      max-height: 100px;
      box-shadow: #414142 2px 2px 5px;
    }
  }


  .input-container {
    width: 80%;
    margin: 0 auto;
    display: flex;
    justify-content: center;

    textarea {
      padding: 5px;
      width: 80%;
      border-left: none;
      border-right: none;
    }

    button.select-file-button {
      border: 1px solid gray;
      border-bottom-left-radius: 10px;
      border-top-left-radius: 10px;
    }
    button.send-button {
      border: 1px solid gray;
      border-bottom-right-radius: 10px;
      border-top-right-radius: 10px;
    }
  }
}
</style>
