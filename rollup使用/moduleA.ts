import { go, sum } from './moduleB';

interface DemoInterface {
    name: string
    sex: Sex
    say?: () => void
}

type Sex = '男'|'女';

export default class Demo implements DemoInterface {
    name: string;
    sex: Sex;
    constructor(params:DemoInterface) {
        this.name = params.name;
        this.sex = params.sex;
    }
    say():void {
        console.log(`Hello! My Name is ${this.name}, sex: ${this.sex}`);
        go(3);
        const a:number = sum([1, 2, 3]);
        console.log(a ,3);
    }
}