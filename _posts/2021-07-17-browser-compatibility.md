# BROWSER COMPATIBILITY

> 내가 작성한 코드가 모든 브라우저에서 동작할 거라는 기대는 하지 말아야 한다.

[Can I use ___?](https://caniuse.com/#search=array)

##### 지원하지 않는 CSS 속성

Calc 함수의 지원 범위?

##### ES Modules & [].includes

지원 범위?

ES classes 의 브라우저 지원범위는?



## 전략

### Transpiling

> 하위 브라우저에서도 동작하게 문법을 바꾼다.

최신 문법 사용이 가능하다.

제안된 기능도 쓸 수 있다.

- TC39 Process(https://tc39.es/process-document/)

JavaScript superset, TypeScript 문법

JSX와 같은 template 문법

보다 윤택한 javascript 개발 가능

() => {}를 function() {}로 바꿔준다.



### Polyfill

> 지원하지 않는 native API를 다른 코드로 동작하게 한다.

Feature detection을 기반으로 동작한다.

걷어내기 쉽다.

flat() 메소드의 브라우저 지원 범위?

* Core-js 모듈로 해결해보기(babel에서 권장)





## 적용

- NPM 프로젝트 생성
- babel로 트랜스파일링
- polyfill 적용(core-js)
- webpack 빌드환경구성(babel연동, plugin적용)