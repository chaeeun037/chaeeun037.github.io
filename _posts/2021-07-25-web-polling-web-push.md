# WEB POLLING & WEB PUSH

> 클라이언트에서 서버로부터 실시간 데이터를 가져오기 위해서 사용한다.



## Polling

> 기존 HTTP 요청/응답에서 클라이언트가 주기적으로 데이터를 가져오는 기술

충돌 회피와 동기화 처리 등을 목적으로 상태를 주기적으로 검사하여 조건을 만족할 때 자료를 처리한다.

### polling

> 클라이언트가 주기적으로 서버로 요청해서 정보를 전달한다.

실시간 메시지 전달이 크게 중요하지 않은 서비스에 사용된다.

불필요한 요청/응답이 많이 발생할 수 있다.

<img src="https://t1.daumcdn.net/cfile/tistory/136F123A50FF6F2F23" width=400px />

### long polling

> 요청을 서버가 가지고있다가 이벤트가 발생하면 전달해준다.

실시간 메시지 전달이 중요한 서비스에서 사용된다.

polling 방식에 비해 불필요한 요청/응답을 덜 발생한다.

<img src="https://t1.daumcdn.net/cfile/tistory/2204653A50FF706405" width=400px />



## Push

> 요청 없이 서버에서 클라이언트로 정보 전달한다.

<img src="https://viswanathl.in/assets/sse_concept.png" width="600" />

### WebSocket

> TCP 연결을 통해 양방향 데이터 통신을 제공한다.

upgrade 속성 사용, http에서 ws로 전환





### Server Sent Events(sse)

> HTTP 연결을 통해 서버에서 클라이언트로 데이터를 수신 가능하게 한다.

연결된 상태를 유지하고 서버가 일방적으로 데이터를 전송하는 단방향 통신이다.

사용자는 메시지를 subscribe하는 과정이 필요하다.

자동 재 연결(연결이 닫힐 때 브라우저가 자동으로 연결)