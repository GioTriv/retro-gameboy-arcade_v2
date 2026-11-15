// ======================================
// AUDIO CONFIG
// ======================================

function createAudio(basePath) {

    const audio = new Audio();

    const wavPath = `${basePath}.wav`;
   /* const mp3Path = `${basePath}.mp3`; */

    audio.src = wavPath;

  /*  audio.addEventListener("error", () => {
        audio.src = mp3Path;
    }  );*/

    audio.volume = 0.7;

    return audio;
}

// ======================================
// SOUND LIBRARY
// ======================================

const sounds = {

    startup: createAudio(
        "assets/audio/startup"
    ),

    move: createAudio(
        "assets/audio/menu-move"
    ),

    select: createAudio(
        "assets/audio/menu-select"
    ),

    eat: createAudio(
        "assets/audio/snake-eat"
    ),

    gameover: createAudio(
        "assets/audio/game-over"
    ),

    pause: createAudio(
        "assets/audio/pause"
    )
};

// ======================================
// PLAY SOUND
// ======================================

function playSound(soundName) {

    const sound = sounds[soundName];

    if (!sound) return;

    sound.pause();

    sound.currentTime = 0;

    sound.play()
        .catch(() => {});
}

// ======================================
// STOP SOUND
// ======================================

function stopSound(soundName) {

    const sound = sounds[soundName];

    if (!sound) return;

    sound.pause();

    sound.currentTime = 0;
}

// ======================================
// VOLUME CONTROL
// ======================================

function setVolume(volume) {

    Object.values(sounds)
        .forEach(sound => {

            sound.volume = volume;
        });
}

// ======================================
// BROWSER AUDIO UNLOCK
// ======================================

function unlockAudio() {

    Object.values(sounds)
        .forEach(sound => {

            sound.volume = 0;

            sound.play()
                .then(() => {

                    sound.pause();

                    sound.currentTime = 0;

                    sound.volume = 0.7;
                })
                .catch(() => {});
        });
}

document.addEventListener(
    "click",
    unlockAudio,
    { once: true }
);

document.addEventListener(
    "keydown",
    unlockAudio,
    { once: true }
);