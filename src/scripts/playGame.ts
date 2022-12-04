import { gsap } from "gsap";
import { reels } from "./elements";
import { iTween } from "./interfaces";
import { tweening } from "./loadGame";

export let startGame: boolean = false
export let containerSpin!: PIXI.Container
export let containerReels!: PIXI.Container
let rotateSpin!: GSAPAnimation

class RunSpin {
  count: number = 0
  currentState: Jump

  constructor() {
    this.currentState = new Jump(this)
  }

  change = (state: Jump | SpeedSpin | ChangeTitle): void => {
    if (this.count++ >= 2) return;
    this.currentState = state;
    this.currentState.go()
  };

  startGame = (): void => {
    this.currentState.go();
  };
}

class Jump {
  step: RunSpin

  constructor(step: RunSpin) {
    this.step = step
  }

  go = (): void => {
    startGame = !startGame

    if (startGame) {
      containerReels.children.forEach((elem) => {
        gsap.fromTo(elem, { y: - Math.random() * 30 }, { y: 0 });
      })
    }

    setTimeout(() => { this.step.change(new SpeedSpin(this.step)) }, 500)
  }
};

class SpeedSpin {
  step: RunSpin

  constructor(step: RunSpin) {
    this.step = step;
  }

  go = (): void => {
    if (startGame) {
      rotateSpin.play();
      gsap.to(rotateSpin, { timeScale: 1, duration: 1 });

      for (let i = 0; i < reels.length; i++) {
        const r = reels[i];
        const extra = Math.floor(Math.random() * 3);
        const target = +r.position + 10 + i * 5 + extra;
        const time = 2500 + i * 600 + extra * 600;
        const tween: iTween = {
          object: r,
          property: 'position',
          propertyBeginValue: r['position'],
          target,
          easing: (t: number) => (--t * t * ((0.5 + 1) * t + 0.5) + 1),
          time,
          start: Date.now(),
        };

        tweening.push(tween);
      }

    } else {
      gsap.to(rotateSpin,
        { timeScale: 0, duration: 1, onComplete: function () { this.pause(); } }
      );
    }

    this.step.change(new ChangeTitle(this.step));
  }
};

export class ChangeTitle {
  step: RunSpin

  constructor(step: RunSpin) {
    this.step = step;
  }

  go = (): void => {
    containerSpin.children[2].visible = !startGame
    containerSpin.children[3].visible = startGame
  }
};

export const spinRunFunc = (spinContainer: PIXI.Container, reelsContainer: PIXI.Container): void => {
  spinContainer.children[1].interactive = false
  containerSpin = spinContainer
  containerReels = reelsContainer

  if (!rotateSpin) {
    rotateSpin = gsap
      .to([spinContainer.children[1], spinContainer.children[4]], {
        rotation: 360,
        duration: 0.3,
        ease: 'none',
        repeat: -1,
        paused: true
      })
      .timeScale(0);
  }

  new RunSpin().startGame()
}