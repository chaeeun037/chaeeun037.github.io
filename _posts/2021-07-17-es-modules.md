---
search: true
comments: true
categories: [Javascript]
---


# ES MODULES

> Modular programming은 복잡한 애플리케이션을 모듈 단위로 만들어서 의존성을 관리하는 프로그래밍 방법이다.

### why?

js는 태생이 브라우저에 종속적이었기 때문에 자체적인 모듈 시스템이 없었지만 SPA의 등장으로 모듈라 프로그래밍의 필요성이 커졌다. SPA는 특성 상 한개의 html 파일에서 계속 늘어나는 js 파일에서 선언되는 순서와 전역 변수 관리 등의 위험이 존재하기 때문이다.



## Modular pattern

> 의존성 관리를 위해서 표준적인 모듈 관리 방법으로 [ES Modules](https://www.sitepoint.com/understanding-es6-modules/) 방법이 제시되어있다. 대표적으로 Webpack이 있다.

### entry point

> type을 module로 해야 한다.

```html
//todo.html
<head>
    <script type="module" src="./app.js"></script>
</head>
```



### export

>필요한 클래스/객체리터럴/함수를 export해서 외부에서 사용가능하도록 한다. 
>
>file한 개에 한 개의 class(객체)를 구현하는 것이 좋다.

```javascript
//todo.js
class TodoModel{}
class ListView{}
class TodoController{}

export {TodoModel, ListView, TodoController}
```



### import

> 의존 관계 표현이 가능하다.  app.js는 todo.js를 의존하고 있다.

```javascript
//app.js
import {TodoModel, ListView, TodoController} from "./todo.js";
```



#### 다양한 import 방식

````js
//export된 객체 중 foo만 사용한다(destructuring)
import { foo } from "./foo.js";

//bar라는 객체를 활용할 수 있다.
//같은 도메인이라면 URL방식도 사용가능하다. 다른 도메인은 CORS때문에 지원 불가능
import  * as bar from "http://127.0.0.1:8080/bar.js";
````

