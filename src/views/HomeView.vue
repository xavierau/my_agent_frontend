<template>
    <div class="home">
        <div class="audio-recording-container">
            <h1 class="title">Audio Recording API Demo</h1>
            <i class="start-recording-button fa fa-microphone"
               aria-hidden="true"
               ref="microphoneButton"
               @click.prevent="recordAudio"/>
            <div ref="recordingControlButtonsContainer"
                 class="recording-control-buttons-container"
                 v-if="is_recording">
                <div ref="elapsedTimeTag" class="recording-elapsed-time">
                    <i class="red-recording-dot fa fa-circle" aria-hidden="true"></i>
                    <p class="elapsed-time">{{ computed_elapsed_time }}</p>
                </div>
                <i ref="stopRecordingButton"
                   @click.prevent="recordingStop"
                   class="stop-recording-button fa fa-stop-circle-o" aria-hidden="true"></i>
            </div>
            <div ref="textIndicatorOfAudiPlaying" class="text-indication-of-audio-playing-container">
                <p class="text-indication-of-audio-playing" v-if="!is_recording">Audio is
                    playing<span>.</span><span>.</span><span>.</span></p>
            </div>
        </div>
        <div ref="overlay" class="overlay hide">
            <div class="browser-not-supporting-audio-recording-box">
                <p>To record audio, use browsers like Chrome and Firefox that support audio recording.</p>
                <button type="button"
                        ref="closeBrowserNotSupportedBoxButton"
                        class="close-browser-not-supported-box">
                    Ok.
                </button>
            </div>
        </div>

        <audio controls class="audio-element" :src="new_track" v-if="new_track"></audio>
    </div>
</template>

<script lang="ts" setup>

import {computed, ref} from "vue";

const recorder = ref<MediaRecorder | null>(null)
const new_audio = ref<Blob | null>(null)
const is_recording = ref<boolean>(false)
const elapsed_time = ref(0.0)
const timeInterval = ref<number | null>(null)

const new_track = computed(() => {
    return new_audio.value ?
        URL.createObjectURL(new_audio.value) :
        null;
})
const computed_elapsed_time = computed(() => {
    // change second form 75 to 01:15

    const seconds = elapsed_time.value

    let minutes: number | string = Math.floor(seconds / 60);
    let remainingSeconds: number | string = seconds % 60;

    // Padding the minutes and seconds with a zero if they are less than 10
    minutes = minutes < 10 ? '0' + minutes : minutes;
    remainingSeconds = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;

    return minutes + ':' + remainingSeconds;


})

const recordAudio = async () => {
    new_audio.value = null;

    const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false
    });
    is_recording.value = true
    timeInterval.value = setInterval(() => {
        elapsed_time.value = elapsed_time.value + 1
    }, 1000)

    const options = {mimeType: "audio/webm"};
    const recordedChunks: Blob[] = [];
    recorder.value = new MediaRecorder(stream, options);

    recorder.value.addEventListener("dataavailable", e => {
        if (e.data.size > 0) {
            recordedChunks.push(e.data);
        }
    });

    recorder.value.addEventListener("stop", () => {
        new_audio.value = new Blob(recordedChunks);
        console.log(new_audio.value);
    });

    recorder.value.start();
}
// called on button click
const recordingStop = () => {
    recorder.value?.stop();
    recorder.value = null;
    timeInterval.value = null
    is_recording.value = false
}
</script>
