import * as _ from 'lodash';

export const go = (n:number):void => {
    console.log(new Array(n).fill('go').join(''));
}

export const sum= (arr:Array<number>):number  => {
    return <number>(_.sum(arr));
}