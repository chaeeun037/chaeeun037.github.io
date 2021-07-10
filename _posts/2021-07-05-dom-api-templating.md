# DOM API & TEMPLATING

## Why?

FE개발의 대부분의 작업은 결국 화면을 변경시키는 것이다.
화면의 변경은 HTML구조와 각 Node가 가지고 있는 스타일의 변경을 통해서 이루어 진다.
HTML은 DOM(document object model) 이라는 개념으로 존재하고, API를 통해서 JavaScript로 제어할 수 있다.
다양한 DOM APIs를 잘 이해하는 것은 화면의 변경, 즉 렌더링의 방법을 알게되는 것이다.

현대의 SPAs 프레임워크 개발과정에서는 DOM 렌더링을 직접하지 않게 된다.
그럼에도 DOM APIs를 잘 익히는 것은 바닐라 환경에서의 개발에 대비하기 위함이기도 하다.
또한 표준 렌더링 방식의 이해를 통해서 어느 개발 환경에서도 최적화된 렌더링을 방식을 짐작해서 구현할 수 있다.

------

## 학습 목표

- DOM제어를 할 수 있다.
  - node를 탐색 할 줄 안다.
  - node를 찾을 수 있다.
  - node의 구조를 변경(추가,삭제등)할 수 있다.

------

## 배경 지식

### DOM

```video
https://youtu.be/VaVzi-g5dls
```

브라우저에서는 HTML코드를 DOM(Document Object Model)이라는 객체형태의 모델로 저장합니다.

그렇게 저장된 정보를 DOM Tree 라고 함. 결국 HTML element는 Tree형태로 저장됩니다.
(dom tree 에 대해서 이미지 검색을 해보자)

------

### node탐색 API

##### css selector 부터 이해

css 스타일을 부여했을 때 익혔던 selector문법과 같습니다.
selector문법을 사용해서 원하는 엘리먼트를 찾을 수 있습니다.
querySelector와 querySelectorAll메서드에서 사용할 수 있습니다.

##### getElementById()

ID정보를 통해서 찾을 수 있습니다. MDN사이트를 참고해서 이를 테스트해보자.
테스트를 할 때는 특정 웹사이트에 접속한 후, 크롬개발자도구-콘솔을 열어서 그곳에서 코딩을 해보면서 찾을 수 있다.

##### Element.querySelector()

DOM을 찾는데 특히 유용한 querySelector 메서드 !
CSS 스타일을 결정할 때 사용하던, Selector 문법을 활용해 DOM에 접근할 수 있다.
DOM을 찾을때 querySelector만 써도 충분하고 빠르다.

참고로, 비슷하지만 다른 querySelectorAll이 있다.
이녀석은 어떤 역할을 하는지, 그 반환값은 무엇인지 확인.
특정 웹사이트에 접속한 후, 크롬개발자도구를 열어 콘솔창에서 querySelectorAll을 활용해서 다양한 UI 영역을 찾아보자.

------

### node 탐색 방법

node를 이동하면서 탐색해야하는 경우가 생긴다. 어떻게 node를 탐색하는지 영상을 참고하고,
직접 실습을 한다.

```video
https://youtu.be/8BvFB1HqUy4
```

------

### nodeType의 이해

DOM node는 여러가지 type 이 있다. 어떤 타입이 있는지 이해한다.

```video
https://youtu.be/Fskui7ua1kY
```

------

### node 생성과 추가.

```video
https://youtu.be/m8mXKjxIyeI
```

------

### DOM APIs 요약

##### 1. document 와 Element 객체에 따라 좀 다름

document. 으로 사용할 수 있는 APIs
: https://www.w3schools.com/jsref/dom_obj_document.asp

element. 으로 사용할 수 있는 APIs
: https://www.w3schools.com/jsref/dom_obj_all.asp

##### 2. 노드의 속성정보 얻기

- tagName
- textContent
- nodeType

##### 3. DOM 탐색

DOM 속성 정보 얻기

노드 이동

- childNodes
- firstChild
- firstElementChild
- parentElement
- nextSibling
- nextElementSibling

##### 4. DOM 조작

삭제,추가,이동,교체를 위해서는 아래 API사용법을 잘 익혀두면 좋다.

- removeChild()
- appendChild()
- insertBefore()
- cloneNode()
- replaceChild()
- closest() //상위로 올라가면서 근접 엘리먼트 찾기

------

### 좀더 쉽고 강력한 DOM조작방법

DOM에 node를 추가할때는 **문자열 기반의 작업이 편리**하다.
가급적 아래 방법을 해서 좀더 쉬운 DOM 조작을 한다.

- innerText //getter, setter 역할을 모두 한다
- innerHTML //getter, setter 역할을 모두 한다
- insertAdjacentHTML

```video
https://youtu.be/M-_CMcFoXfM
```

------

### html문자열 손쉽게 만들기

실무에서는 서버로부터 전달 받은 JSON데이터를 결국 화면렌더링에 포함해야 한다.
이렇게 JSON + HTML 구조를 섞어서 새로운 HTML문자열을 만드는 과정을 templating 이라고 한다.

[template literal](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) 문법을 활용하면 손쉽게 문자열 조작이 가능하다.

```javascript
const data = {
   hour : new Date().getHours(),
   name : "codesquad"
} 

const template = `<div><span>hello! ${data.name}</span></div>`;
console.log(template); //<div><span>hello! codesquad</span></div>
코드복사
```

------

## 정리

DOM API를 사용한 DOM접근은, 현대의 개발에서는 개발자가 직접 잘 안한다.

이 작업은 꽤 번거롭고 성능이 느릴 수 있는 부분이라, 라이브러리에서 직접 처리하고 있는 추세이다.

하지만 성능이 중요한 경우에는 라이브러리나 프레임워크 없이 직접 DOM조작을 해야하는 경우도 있다.

DOM처리에 대한 기본적인 처리방법을 익히는 것은 웹프론트엔드 개발자에게 앞으로도 필수지식이라고 할 수 있다.