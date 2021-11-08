import go from './moduleB.js';

export default class Demo {
    constructor(params) {
        this.name = params.name;
    }
    say() {
        console.log(`hello ${this.name}`);
    }
    go() {
        go();
    }
}