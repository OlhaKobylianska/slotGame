import { iTween } from './interfaces';
import { containerReels, containerSpin, spinRunFunc, startGame } from './playGame';

export const tweening: iTween[] = [];
let arr: string[][] = [[], [], []]

export const loadGame = (): void => {
  const now = Date.now();
  const remove: iTween[] = [];

  for (let i = 0; i < tweening.length; i++) {
    let t = tweening[i];
    const phase = Math.min(1, (now - t.start) / t.time)
    t.object['position'] = +t.propertyBeginValue * (1 - t.easing(phase)) + t.target * t.easing(phase);

    if (phase === 1) {
      startGame ? spinRunFunc(containerSpin, containerReels) : null
      t.object['position'] = t.target;
      remove.push(t);
    }
  }

  for (let i = 0; i < remove.length; i++) {
    tweening.splice(tweening.indexOf(remove[i]), 1);
    tweening.length === 0 ? gameOver() : null
  }
}

const gameOver = (): void => {
  containerSpin.children[1].interactive = true

  containerReels.children.forEach((elements) => {
    (elements as PIXI.Container).children.forEach(elem => {
      if (Math.floor((elem as PIXI.Sprite).position.y) === 120) arr[0].push((elem as PIXI.Sprite).texture.textureCacheIds[0]);
      if (Math.floor((elem as PIXI.Sprite).position.y) === 0) arr[1].push((elem as PIXI.Sprite).texture.textureCacheIds[0]);
      if (Math.floor((elem as PIXI.Sprite).position.y) === -120) arr[2].push((elem as PIXI.Sprite).texture.textureCacheIds[0]);
    })
  })

  arr.forEach(row => {
    if (row.every((elem) => elem === row[0])) alert('You won!!! Congratulations :)')
  })

  arr = arr.map(() => [])
}