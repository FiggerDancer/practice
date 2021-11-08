import Demo from './moduleA';
import './style.css';

const demo = new Demo({
    name: 'Tom',
    sex:'男'
});

const oDiv = document.createElement('div');
oDiv.className = 'container';

const oBody = document.querySelector('body');

if (oBody) {
    oBody.appendChild(oDiv);
}

oDiv.innerHTML = '134';

demo.say();

const getMap = (a:number, b:Array<number>):Map<number,Array<number>> => {
    const map:Map<number, Array<number>> = new Map();
    map.set(a, b);
    return map;
}

const map = getMap(6, [1, 2]);

console.log(map);

console.log('hello world1!')
