# ASYNC & DEFER

> script를 HTML에 포함하는 방법은 여러가지이다. 
>
> 1) head에 작성하는 경우 - async, defer 속성
>
> 2) body에 작성하는 경우



## <head>에 작성하는 경우

> async, defer은 script 태그에 쓰이는 속성으로 script의 실행 시점을 지정해줌으로써 브라우저 렌더링 시간을 줄이거나 js파일이 먼저load되어 발생하는 오류를 줄일 수 있다.

**async**

script를 다운로드 할 때는 HTML parsing이 멈추지 않는다.



**defer**

HTML parsing이 끝나고 나서 script를 실행한다.



![script 태그의 async와 defer 속성 | 김로그](https://kimlog.me/static/7b56046cd820d53017f5fa7124ba2255/44a54/script_load.png)



## <body> 맨 뒤에 작성하는 경우

**장점**

html이 parsing이 완료 된 후에 js파일을 읽고 실행하기 때문에 js파일이 먼저 로드되어 발생하는 문제점이 생기지 않는다. 

사용자의 경우 브라우저에 출력되는 html파일을 js로드 없이 먼저 볼 수 있게 된다.



**단점**

웹 사이트가 js파일의 의존도가 높아지게 되면 사용자는 브라우저 렌더링을 오랜시간 기다려야 하는 문제가 있다.