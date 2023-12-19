let itervalToCountDown= 0; 
let intervalToTransition = 0;
const state = {
    views: {
        squares: document.querySelectorAll(".square"),
        enemy: document.querySelector(".enemy"),
        timeLeft: document.querySelector("#time-left"),
        score: document.querySelector("#score")
    },
    values: {
        resultPoint: 0,
        actualSquare: 0,
        lifeResult: 3,
        timeLeftCounterDownInSeconds: 60
    },
    tasks: {
        initTransitionForRalphOnSquare: () => { 
            intervalToTransition = setInterval(randomSquare, 1 * 1000)
        },
        initTimeLeftCountDown: () => {
                itervalToCountDown = setInterval(() => {
                state.values.timeLeftCounterDownInSeconds -= 1;
                state.views.timeLeft.textContent = state.values.timeLeftCounterDownInSeconds;
                state.tasks.monitoringWinner(itervalToCountDown, intervalToTransition);
            }, 1 * 1000);
        },
        monitoringWinner: (itervalToCountDown, intervalToTransition) => {
            if (state.values.timeLeftCounterDownInSeconds === 0 ){
                alert("FIM DE JOGO !!!");
                clearInterval(itervalToCountDown);
                clearInterval(intervalToTransition);
                
            } else if (state.values.resultPoint >= 30) {
                alert("Você venceu!!!!");
                clearInterval(itervalToCountDown);
                clearInterval(intervalToTransition);
            }
        }
       
    }
}

const randomSquare = () => {
    state.views.squares.forEach(square => {
        square.classList.remove("enemy");
    });

    let randomnumber = Math.floor(Math.random() * 9);
    let randomSquare = state.views.squares[randomnumber];
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
            //quero que minha pontuação seja somada quando clicar no square aonde o half aparece
            if (square.id === state.values.actualSquare) {
                state.values.resultPoint += 1;
                state.views.score.textContent = state.values.resultPoint;
                playSound("hit");
            }
            else {
                state.values.resultPoint -= 1;
                state.views.score.textContent = state.values.resultPoint;
            }
        });
    });
}

const init = () => {
    state.tasks.initTransitionForRalphOnSquare();
    state.tasks.initTimeLeftCountDown();
    addListenerHitBox();
}

init();