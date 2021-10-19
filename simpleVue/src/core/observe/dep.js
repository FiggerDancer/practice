import { remove } from './../../util';

let uid = 0;

class Dep {
    constructor() {
        this.id = ++uid;
        this.subs = [];
    }
    depend() {
        if (Dep.target) {
            Dep.target.addDep(this)
        }
    }
    addSub(sub) {
        this.subs.push(sub);
    }
    removeSub(sub) {
        remove(this.subs, sub);
    }
    notify() {
        const subs = [...this.subs];
        for (let i = 0; i < subs.length; i++) {
            subs[i].update();
        }
    }
}

Dep.target = null;
const targetStack = [];

export const pushTarget = (target) => {
    if (Dep.target) {
        targetStack.push(Dep.target);
    }
    Dep.target = target;
}

export const popTarget = () => {
    Dep.target = targetStack.pop();
}


export default Dep;