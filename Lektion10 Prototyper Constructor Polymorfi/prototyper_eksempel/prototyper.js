let p = {y: 2};
let o = Object.create(p);
o.x = 1;
Object.prototype.z = 3;
console.log(o.x); // => 1
console.log(o.y); // => 2
console.log(o.z); // => 3
o.y = 1;
console.log(o.y); // => 1
console.log(p.y); // => 2
