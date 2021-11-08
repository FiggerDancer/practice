import _ from 'lodash.js';

console.log(_);

const go = () => {
    console.log('gogogogogogo');
}

export const send = () => {
    console.log(_, _.concat([1, 2], 3, 4, [5]));
}

send();

export default go;