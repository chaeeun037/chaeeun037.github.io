# REACT MAIN CONCEPTS

## [JSX](https://ko.reactjs.org/docs/introducing-jsx.html)

> JSX는 javascript xml로 javascript를 확장한 문법이다.

### Why?

React에서 마크업과 로직을 둘 다포함하기 위해서 사용되곤 한다. 

컴포넌트라고 부르는 느슨하게 연결된 유닛으로 관심사를 분리해서 React 엘리먼트를 생성하여 UI가 어떻게 생겨야 하는지 설명한다.



### 표현식

중괄호 안에 유효한 모든 javascript 표현식을 넣을 수 있다.

자동 세미콜론 삽입을 피하기 위해 괄호로 묶는다.

```jsx
const element = (
  <h1>
    Hello, {formatName(user)}!
  </h1>
);
```

jsx도 표현식이기 때문에 변수에 할당, 반환 등 가능하다.

```jsx
function getGreeting(user) {
  if (user) {
    return <h1>Hello, {formatName(user)}!</h1>;
  }
  return <h1>Hello, Stranger.</h1>;
}
```



### 속성 정의

> 따옴표(문자열 값에 사용) 또는 중괄호(표현식에 사용) 중 하나만 사용한다.

속성에 따옴표를 이용해 문자열 리터럴을 정의할 수 있다.

```jsx
const element = <div tabIndex="0"></div>;
```

중괄호를 사용하여 어트리뷰트에 JavaScript 표현식을 삽입할 수 있다.

```jsx
const element = <img src={user.avatarUrl}></img>;
```



### 주입 공격 방지

기본적으로 React Dom은 JSX에 삽입된 모든 값을 렌더링 하기 전에 문자열로 변환되어 이스케이프하므로 XSS(cross-site-scripting) 공격을 방지할 수 있다.



### 객체 표현

> Babel은 JSX를 `React.createElement()`호출로 컴파일한다.

아래 두 예시는 동일하다.

```jsx
const element = (
  <h1 className="greeting">
    Hello, world!
  </h1>
);
```

```jsx
const element = React.createElement(
  'h1',
  {className: 'greeting'},
  'Hello, world!'
);
```

이후에 몇가지 검사를 수행해서 React 엘리먼트 객체를 생성한다.

React는 이 객체를 읽어서 DOM을 구성하고, 최신 상태로 유지한다.