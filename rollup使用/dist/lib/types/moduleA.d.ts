interface DemoInterface {
    name: string;
    sex: Sex;
    say?: () => void;
}
declare type Sex = '男' | '女';
export default class Demo implements DemoInterface {
    name: string;
    sex: Sex;
    constructor(params: DemoInterface);
    say(): void;
}
export {};
