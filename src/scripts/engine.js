const state = {
    views: {
        squares: document.querySelectorAll(".square"),
        enemy: document.querySelector(".enemy"),
        timeLeft: document.querySelector("#time-left"),
        score: document.querySelector("#score"),
        life: document.querySelector("#life"),
        buttonStartDisabled: (toDisabled) => {
            const startButton = document.querySelector("#start");
            startButton.disabled = toDisabled;
            startButton.className = "";
            startButton.className = toDisabled ? "disable" : "enable";
        },
        showModal: (metaData) => {
            const { toShow, title, message } = metaData;
            document.querySelector("#modal-title").textContent = title;
            document.querySelector("#modal-message").textContent = message;
            document.querySelector(".modal").style.visibility = toShow ? "visible" : "hidden";
        }
    },
    values: {
        resultPoint: 0,
        actualSquare: 0,
        lifeResult: 3,
        timeLeftCounterDownInSeconds: 30,
        intervalToTransition: 1000,
        gameRunning: true
    },
    tasks: {
        initTransitionForNatoOnSquare: async () => setInterval(randomSquare, state.values.intervalToTransition),
        initTimeLeftCountDown: async () => setInterval(() => {
            state.views.timeLeft.textContent = state.values.timeLeftCounterDownInSeconds -= 1;
            state.tasks.monitoringWinner();
        }, 1000)
        ,
        monitoringWinner: () => {
            if (state.values.timeLeftCounterDownInSeconds === 0) {
                state.views.showModal({
                    toShow: true,
                    title: "Game over!!!",
                    message: "Vamos lá, não desista, adorei correr de você. Vamos nos manter vivo."
                });
                playSound("game-over");
                state.views.life.textContent = `x${(state.values.lifeResult -= 1)}`;
                state.values.intervalToTransition += 200;
                stopAndClear();

            } else if (state.values.resultPoint >= 15) {
                state.views.showModal({
                    toShow: true,
                    title: "Você venceu /O/  !!!",
                    message: "Você é feraaaaaaaaa demais, da próxima vez eu não vou ser tão lento assim..."
                });
                playSound("win");
                state.values.intervalToTransition -= 200;
                stopAndClear();
            }
        }
    }
}

const randomSquare = () => {
    state.views.squares.forEach(square => {
        square.classList.remove("enemy");
    });

    let randomSquare = state.views.squares[Math.floor(Math.random() * 9)];
    state.values.actualSquare = randomSquare.id;
    randomSquare.classList.add("enemy");
}

const playSound = (fileName) => {
    const sound = new Audio(`./src/assets/sounds/${fileName}.m4a`);
    sound.volume = 0.2;
    sound.play();
}


const addListenerHitBox = () => {
    state.views.squares.forEach(square => {
        square.addEventListener("mousedown", () => {
            //quero que minha pontuação seja somada quando clicar no square aonde o Nato aparece
            if (square.id === state.values.actualSquare) {
                state.views.score.textContent = state.values.resultPoint += 1;;
                let sounds = ["essa-doeu", "na-cara-nao"];
                let soundToPlayIndex = Math.floor(Math.random() * sounds.length);
                playSound(sounds[soundToPlayIndex]);
            }
            else {
                state.views.score.textContent = state.values.resultPoint -= 1;
            }
        });
    });
}


let taskTrasitionForNatoOnSquareId;
let taskInitTimeLeftCountDownId;

const init = async () => {
    state.views.score.textContent = 0;
    document.querySelector(".panel").classList.remove("disableContent");
    state.views.buttonStartDisabled(true);
    taskTrasitionForNatoOnSquareId = await state.tasks.initTransitionForNatoOnSquare();
    taskInitTimeLeftCountDownId = await state.tasks.initTimeLeftCountDown();
    if(state.values.gameRunning) addListenerHitBox();
}

const stopAndClear = () => {
    state.values.resultPoint = 0;
    state.values.timeLeftCounterDownInSeconds = 30;

    clearInterval(taskTrasitionForNatoOnSquareId);
    clearInterval(taskInitTimeLeftCountDownId);
    state.views.buttonStartDisabled(false);
    document.querySelector(".panel").classList.add("disableContent");
    state.values.gameRunning = false;

}
