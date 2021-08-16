# REACT RENDERING

## Element

React에서 표현되는 element는 사실 객체로 다뤄진다.

```html
<div>
    <p> hello world </p> 
</div>
```

```json
{
    type: 'div',
    props: {
        className: 'wrap',
        children: {
            type: 'p',
            props: {
                children: 'hello world'
            }
        }
    }
}
```

### Element Type

#### Host component 

> 순수한 html element로 div, span, button 등

host component도 그대로 사용되는 것이 아니고 하나의 객체형태의 컴포넌트로 랩핑된다.

#### Custom component 

> `<MyCompnent>` , `<Div>`등

class component, function component등과 같은 더 자세한 type으로 나눠진다.

## Rendering Phases

### Reconciliation phase

> React가 각 구성 요소 인스턴스의 렌더링 메소드를 실행하여 생성 한 가상 DOM을 브라우저에 구성된 실제 DOM과 동기화하는 프로세스이다.

- 탐색과정을 통해 변경사항을 추출해서 변경 정보를 list로 생성한다.
  - 변경사항 탐지 시, type이 다르면 비교 안하고 바꿔버린다.
  - [key](https://paulgray.net/keys-in-react/) 속성을 활용해서 변경사항을 잘 재사용할 수 있도록 한다.
- reconciliation 단계는 비동기적으로 처리되고, chunk로 나눠서 처리된다.
  - [Fiber 아키텍처](https://github.com/acdlite/react-fiber-architecture)

### Commit phase

> 실제 DOM에 반영하는 단계이다. 

- node의 추가/삭제/변경/이동이 일어난다.
- 이 작업은 동기적으로 처리되며 한방에 진행된다.
- 이 때 useEffect가 실행된다.