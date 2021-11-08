import Demo from './moduleA.js';
import go from './moduleB.js';

const hello  = 'world';

console.log('hello wolrd!');

const demo = new Demo({name: 'DangDang'});

demo.say();

go();