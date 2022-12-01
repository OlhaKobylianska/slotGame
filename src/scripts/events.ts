import { gsap } from "gsap";
import { startPlay } from "./playGame";

let startGame: boolean = false
let rotateSpin!: GSAPAnimation

class RunSpin {
  count: number = 0
  container: PIXI.Container
  currentState: Jump

  constructor(container: PIXI.Container) {
    this.container = container
    this.currentState = new Jump(this, this.container)
  }

  change = (state: Jump | SpeedSpin | ChangeTitle) => {
    if (this.count++ >= 2) return;
    this.currentState = state;
    this.currentState.go()
  };

  startGame = () => {
    this.currentState.go();
    this.container.children[1].interactive = false
  };
}

class Jump {
  step: RunSpin
  container: PIXI.Container

  constructor(step: RunSpin, container: PIXI.Container) {
    this.step = step
    this.container = container
  }

  go = () => {
    const delay = () => new Promise((r) => setTimeout(() => r('done'), 50));

    if (!startGame) {
      delay()
        .then(() => {
          this.container.position.y = 250
          return delay()
        }).then(() => {
          this.container.position.y = 230
          return delay()
        })
    }

    this.step.change(new SpeedSpin(this.step, this.container));
  }
};

class SpeedSpin {
  step: RunSpin
  container: PIXI.Container

  constructor(step: RunSpin, container: PIXI.Container) {
    this.step = step;
    this.container = container
  }

  go = () => {
    if (!startGame) {
      rotateSpin.play();
      gsap.to(rotateSpin, { timeScale: 1, duration: 1 });
    } else {
      gsap.to(rotateSpin, {
        timeScale: 0,
        duration: 1,
        onComplete: function () { this.pause(); }
      });
    }

    setTimeout(() => {
      this.step.change(new ChangeTitle(this.step, this.container));
      this.container.children[1].interactive = true
    }, 500)
  }
};

class ChangeTitle {
  step: RunSpin
  container: PIXI.Container

  constructor(step: RunSpin, container: PIXI.Container) {
    this.step = step;
    this.container = container
  }

  go = () => {
    this.container.children[2].visible = startGame
    this.container.children[3].visible = !startGame

    startGame ? this.step.change(new Jump(this.step, this.container)) : startPlay()
    startGame = !startGame
  }
};

export const spinRunFunc = (container: PIXI.Container): void => {
  if (!rotateSpin) {
    rotateSpin = gsap
      .to([container.children[1], container.children[4]], {
        rotation: 360,
        duration: 0.3,
        ease: 'none',
        repeat: -1,
        paused: true
      })
      .timeScale(0);
  }

  new RunSpin(container).startGame()
}