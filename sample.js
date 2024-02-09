// let numbers = [1, 2, 3, 4, 5];
// let doubledNumbers = numbers.map(function (num) {
//     return num * 2;
// });
// console.log(doubledNumbers); 

// 偶数だけを抽出する
// let numbers = [1, 2, 3, 4, 5];
// let evenNumbers = numbers.filter(function (num) {
//     return num % 2 === 0;
// });
// console.log(evenNumbers); 

// 配列の合計を計算する
// let numbers = [1, 2, 3, 4, 5];
// let sum = numbers.reduce(function (acc, num) {
//     return acc + num;
// }, 0);
// console.log(sum); 


const parentElement = document.querySelector('.list-group');
const card01 = document.querySelectorAll('.card')[0]
const card02 = document.querySelectorAll('.card')[1]
const card03 = document.querySelectorAll('.card')[2]

parentElement.appendChild(card02)
parentElement.insertBefore(card03, card01)
