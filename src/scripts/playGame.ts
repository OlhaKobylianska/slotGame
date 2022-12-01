import { app } from './app';
import { reels } from './elements';
import { iReals, iTween } from './interfaces';

let running = false;
const tweening: iTween[] = [];

export function startPlay() {
  if (running) return;
  running = true;

  for (let i = 0; i < reels.length; i++) {
    const r = reels[i];
    const extra = Math.floor(Math.random() * 3);
    const target = +r.position + 10 + i * 5 + extra;
    const time = 2500 + i * 600 + extra * 600;
    tweenTo(r, 'position', target, time, backout(0.5), null, i === reels.length - 1 ? reelsComplete : null);
  }
}

function reelsComplete() {
  running = false;
}

function tweenTo(object: iReals, property: string, target: number, time: number, easing: Function, onchange: Function | null, oncomplete: Function | null) {
  const tween: iTween = {
    object,
    property,
    propertyBeginValue: object[(property as keyof object)],
    target,
    easing,
    time,
    change: onchange,
    complete: oncomplete,
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
      const phase = Math.min(1, (now - t.start) / t.time);

      t.object['position'] = lerp(+t.propertyBeginValue, t.target, t.easing(phase));
      if (t.change) t.change(t);
      if (phase === 1) {
        t.object['position'] = t.target;
        if (t.complete) t.complete(t);
        remove.push(t);
      }
    }
    for (let i = 0; i < remove.length; i++) {
      tweening.splice(tweening.indexOf(remove[i]), 1);
    }
  });
}

function lerp(a1: number, a2: number, t: number) {
  return a1 * (1 - t) + a2 * t;
}

function backout(amount: number) {
  return (t: number) => (--t * t * ((amount + 1) * t + amount) + 1);
}
