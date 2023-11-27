<template>
    <div class="audio">

        <div class="audio-recording-container" v-if="!not_support">
            <h1 class="title">Audio Recording</h1>
            <i class="start-recording-button fa fa-microphone"
               aria-hidden="true"
               ref="microphoneButton"
               @click="recordAudio"/>
            <div ref="recordingControlButtonsContainer"
                 class="recording-control-buttons-container"
                 v-if="is_recording || is_stopped">
                <i @click="deleteAudio"
                   class="stop-recording-button fa fa-times-circle-o" style="color:red"></i>
                <div ref="elapsedTimeTag" class="recording-elapsed-time">
                    <i v-if="is_recording" class="red-recording-dot fa fa-circle"></i>
                    <p class="elapsed-time">{{ computed_elapsed_time }}</p>
                </div>
                <i @click="recordingStop"
                   v-if="!is_stopped"
                   class="stop-recording-button fa fa-stop-circle-o" aria-hidden="true"></i>
                <i v-if="show_play_button"
                   @click="playDownloadedAudio"
                   class="stop-recording-button fa fa-play-circle-o" aria-hidden="true"></i>
            </div>
            <div v-if="is_loading">
                <i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
                <span class="sr-only">Loading...</span>
            </div>

            <div ref="textIndicatorOfAudiPlaying" class="text-indication-of-audio-playing-container">
                <p class="text-indication-of-audio-playing" v-if="is_playing">Audio is
                    playing<span>.</span><span>.</span><span>.</span></p>
            </div>
        </div>

        <div ref="overlay" class="overlay" v-if="not_support">
            <div class="browser-not-supporting-audio-recording-box">
                <p>To record audio, use browsers like Chrome and Firefox that support audio recording.</p>
                <button type="button"
                        class="close-browser-not-supported-box">
                    Ok.
                </button>
            </div>
        </div>

    </div>
</template>

<script lang="ts" setup>
import {RecordRTCPromisesHandler} from "recordrtc"
import {computed, nextTick, onMounted, ref} from "vue";
import axios from "axios";
import {sleep} from "@/utils";

const host = "https://agent.anacreation.com/"
// const host = "http://127.0.0.1:8001/"

const is_loading = ref<boolean>(false)
const is_playing = ref<boolean>(false)
const is_recording = ref<boolean>(false)
const is_stopped = ref<boolean>(false)
const show_play_button = ref<boolean>(false)
const not_support = ref<boolean>(false)
const elapsed_time = ref(0.0)
const load_audio = ref(false)
const computed_elapsed_time = computed(() => {

    let minutes: number | string = Math.floor(elapsed_time.value / 60);
    let remainingSeconds: number | string = elapsed_time.value % 60;

    // Padding the minutes and seconds with a zero if they are less than 10
    minutes = minutes < 10 ? '0' + minutes : minutes;
    remainingSeconds = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;

    return minutes + ':' + remainingSeconds;
})
const audioId = ref<string | null>(null)
const audio_src = computed(() => {
    if (audioId.value) {
        return host + `audio/${audioId.value}`
    }
    return null
})

const audioPlayer = ref<HTMLAudioElement | null>(null)

const fetchAudioCounter = ref(0)

let stream
let recorder: RecordRTCPromisesHandler | null = null
let timeinterval: number
let blob: Blob | null

const reset = () => {
    is_stopped.value = false
    is_loading.value = false
}

const deleteAudio = () => {
    blob = null
    reset()
}
const init_recorder = (async () => {

    if (recorder) {
        await recorder.reset()
    }

    try {
        stream = await navigator.mediaDevices.getUserMedia({video: false, audio: true})
        recorder = new RecordRTCPromisesHandler(stream, {
            type: 'audio'
        });
        elapsed_time.value = 0.0
        is_stopped.value = false
    } catch (e) {
        console.log("err", e)
        not_support.value = true

    }
})

onMounted(() => {
    try {
        const audio = new Audio()
        audio.muted = true
        audio.autoplay = true

        audio.addEventListener('canplaythrough', () => {
            console.log('loaded audio');
            console.log(audio.currentSrc);
            show_play_button.value = true

            nextTick(() => {
                audio.play()
                    .then(() => {
                        audio.muted = false
                        audio.volume = 1
                        is_playing.value = true
                        load_audio.value = true
                        is_loading.value = false
                    })
                    .catch(err => {
                        console.log("play audio err", err)
                    })
            })

        });
        audio.addEventListener('ended', () => {
            is_playing.value = false
            audio.muted = true
        });

        audioPlayer.value = audio
    } catch (e) {
        not_support.value = true
    }
})


const recordAudio = async () => {
    await init_recorder()
    recorder?.startRecording();
    is_recording.value = true
    timeinterval = setInterval(() => {
        elapsed_time.value = elapsed_time.value + 1
    }, 1000)
}

const fetch_audio_file = async (id: string) => {
    await sleep(500)
    if (load_audio.value || fetchAudioCounter.value > 10)
        return

    try {
        const url = `${host}has_audio/${id}`
        const res = await axios.get(url)
        audioId.value = id

        nextTick(() => {
            if (audio_src.value && audioPlayer.value) {

                audioPlayer.value.src = audio_src.value

                audioPlayer.value.load()

            }
        })

    } catch (err) {
        fetchAudioCounter.value = fetchAudioCounter.value + 1
        await fetch_audio_file(id)
        console.log("err", err)
    }

}

const recordingStop = async () => {
    await recorder?.stopRecording();

    is_recording.value = false
    is_stopped.value = true
    is_loading.value = true
    clearInterval(timeinterval)
    console.log("recorder", recorder)
    const blob = await recorder?.getBlob()
    if (blob) {
        load_audio.value = false
        const formData = new FormData();
        formData.append("audio", blob, "testing.mp4")
        formData.append("type", blob.type)
        formData.append("require_audio", true)
        axios.post(`${host}call_with_audio`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(res => {
            fetch_audio_file(res.data.id)
        }).catch(err => {
            console.log("err", err)
        })

    }
}

const playDownloadedAudio = async () => {
    if (audioPlayer.value) {
        audioPlayer.value.play()
    }
}
const playAudio = async () => {
    blob = (await recorder?.getBlob()) ?? null;
    if (blob && blob.size > 0) {
        const data_url = URL.createObjectURL(blob)
        console.log("data_url", data_url)
        const audio = new Audio(data_url)
        audio.onended = () => is_playing.value = false
        await audio.play();
        is_playing.value = true
    }
}


</script>
