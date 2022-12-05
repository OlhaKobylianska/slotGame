import { gsap } from "gsap";
import { reels } from "./elements";
import { EnumBetContainer, EnumSpinContainer, iTween } from "./interfaces";
import { tweening, winner } from "./loadGame";

const betAmountArray = [0.2, 0.5, 1.0, 5.0, 10.0, 20.0, 50.0, 100.0]
export let startGame: boolean = false
export let containerSpin!: PIXI.Container
export let containerReels!: PIXI.Container
export let containerBet!: PIXI.Container
export let countBet: number = betAmountArray[0]
export let countBalance: number = 1000
let counter: number = 0
let rotateSpin!: GSAPAnimation

class RunSpin {
  private count: number = 0
  currentState: Bet

  constructor() {
    this.currentState = new Bet(this)
  }

  change = (state: Bet | Jump | SpeedSpin | ChangeTitle): void => {
    if (this.count++ >= 3) return;
    this.currentState = state;
    this.currentState.go()
  };

  startGame = (): void => {
    this.currentState.go();
  };
}

class Bet {
  step: RunSpin

  constructor(step: RunSpin) {
    this.step = step
  }

  go = (): void => {
    startGame = !startGame

    if (startGame) {

      if (countBet > countBalance) {
        alert('Not enough funds on the balance :(')
        containerSpin.children[EnumSpinContainer.MainPic].interactive = false
        containerBet.children[EnumBetContainer.Value].interactive = true
        startGame = !startGame
        return
      }

      countBalance = countBalance - countBet
    }

    setTimeout(() => { this.step.change(new Jump(this.step)) }, 500)
  }
};

class Jump {
  step: RunSpin

  constructor(step: RunSpin) {
    this.step = step
  }

  go = (): void => {
    if (startGame) {
      containerReels.children.forEach((elem) => {
        gsap.fromTo(elem, { y: - Math.random() * 100 }, { y: 0, direction: 2 });
      })
    }

    setTimeout(() => { this.step.change(new SpeedSpin(this.step)) }, 1000)
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

    setTimeout(() => { this.step.change(new ChangeTitle(this.step)) }, 1000)
  }
};

export class ChangeTitle {
  step: RunSpin

  constructor(step: RunSpin) {
    this.step = step;
  }

  go = (): void => {
    containerSpin.children[EnumSpinContainer.TextStart].visible = !startGame
    containerSpin.children[EnumSpinContainer.TextStop].visible = startGame

    if (!startGame) {
      containerSpin.children[EnumSpinContainer.MainPic].interactive = true
      containerBet.children[EnumBetContainer.Value].interactive = true

      winner ? countBalance += countBet * 2 : null
    }
  };
}

export const spinRunFunc = (spinContainer: PIXI.Container, reelsContainer: PIXI.Container, betContainer: PIXI.Container): void => {
  spinContainer.children[EnumSpinContainer.MainPic].interactive = false
  betContainer.children[EnumBetContainer.Value].interactive = false
  containerSpin = spinContainer
  containerReels = reelsContainer
  containerBet = betContainer

  if (!rotateSpin) {
    rotateSpin = gsap
      .to([spinContainer.children[EnumSpinContainer.MainPic], spinContainer.children[EnumSpinContainer.Arrow]], {
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

export const changeBetAmount = (): void => {
  counter === 7 ? counter = 0 : counter++;
  countBet = betAmountArray[counter];

  containerSpin.children[EnumSpinContainer.MainPic].interactive = true
}