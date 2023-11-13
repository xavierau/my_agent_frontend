<template>
    <div class="audio">
        <h1>Audio Playing</h1>
        <audio ref="music" preload="all">
            <source src="http://localhost:8000/audio">
        </audio>
    </div>
</template>

<script lang="ts" setup>

import {onMounted, ref} from "vue";

const music = ref<HTMLAudioElement | null>(null)

onMounted(() => {
    music.value!.play();
})

</script>
