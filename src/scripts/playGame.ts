import { app } from './app';
import { reels } from './elements';
import { stopReels } from './events';
import { iReals, iTween } from './interfaces';

let running = false;
let stopCombination : boolean = false
const tweening: iTween[] = [];
let phase!: number

export function startPlay() {
  if (running) return;
  running = true;

  for (let i = 0; i < reels.length; i++) {
    const r = reels[i];
    const extra = Math.floor(Math.random() * 300000);
    const target = +r.position + 10 + i * 5 + extra;
    const time = 2500 + i * 600 + extra * 600;
    tweenTo(r, 'position', target, time, backout(0.5));
  }
}

function reelsComplete() {
  running = false;
}

function tweenTo(object: iReals, property: string, target: number, time: number, easing: Function) {
  const tween: iTween = {
    object,
    property,
    propertyBeginValue: object[(property as keyof object)],
    target,
    easing,
    time,
    start: Date.now(),
  };

  tweening.push(tween);
  return tween;
}

export const loadGame = () => {
  app.ticker.add(() => {
    const now = Date.now();
    const remove = [];

    for (let i = 0; i < tweening.length; i++) {
      const t: iTween = tweening[i];
      if(!stopReels) phase = (now - t.start) / t.time;
      if(stopReels) {
        phase = 0.4 + (now - t.start) / t.time
        setTimeout(() => {
          stopCombination = true
        }, 2000)
      }

      t.object['position'] = lerp(+t.propertyBeginValue, t.target, t.easing(phase));

      if (stopReels && stopCombination) {
        reelsComplete()
        t.object['position'] = t.target;
        remove.push(t);
        stopCombination = false
      }
    }
    for (let i = 0; i < remove.length; i++) {
      tweening.splice(tweening.indexOf(remove[i]), 1);
    }
  });
}

function lerp(a1: number, a2: number, t: number): number {
  return a1 * (1 - t) + a2 * t;
}

function backout(amount: number) {
  return (t: number) => (--t * t * ((amount + 1) * t + amount) + 1);
}
