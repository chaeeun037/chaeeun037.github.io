---
title:  "es-classes"
search: true
categories: 
  - frontend
last_modified_at: 2021-01-26T08:06:00-05:00
---

# ES Classes

class는 ES6에서 클래스를 정의하는 한 방법이다.  class도 객체이다.



여러개의 객체를 생성할 필요가 없을 경우, 특정 구조의 객체를 여러곳에서 사용해야 하는 경우에 재사용성, 유지보수 편리한 등의 장점이 있다.



```javascript
var MyClass = class [className] [extends] {
  // class body
};
```



[예시]

```javascript
const Rectangle = class {
  constructor(height, width) {
    this.height = height;
    this.width = width;
  }
  area() {
    return this.height * this.width;
  }
};

console.log(new Rectangle(5, 8).area());
// expected output: 40
```

