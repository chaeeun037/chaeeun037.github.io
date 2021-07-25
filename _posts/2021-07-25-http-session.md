# HTTP SESSION

### Why?

HTTP 프로토콜은 connectionless, stateless한 특성으로 인해서 서버와 클라이언트가 통신을 할 때마다 클라이언트가 누구인지 서버에게 계속해서 인증을 해야 한다.

이로 인해서 연결/해제에 대한 오버헤드가 발생하는 문제가 있다. 따라서 서버가 클라이언트에 대한 인증을 유지하기 위해 사용하는 방법 중 하나이다.



## 동작 과정

1. 클라이언트가 서버에 HTTP 요청으로 접속한다.
2. 서버는 접근한 클라이언트의 request-header field의 cookie를 확인해서 클라이언트가 session-id를 보냈는지 확인한다.
3. 없으면 서버는 클라이언트에게 session-id를 생성해서 서버의 response-header field인 set-cookie 값으로 session-id를 보낸다.
4. 클라이언트는 대체로 JSESSIONID 쿠키를 사용해서 session-id를 저장하고, 서버에 요청을 보낼 때마다 이 session-id를 서버에 전달한다.
5. 서버는 클라이언트의 session-id로 session에 있는 클라언트 정보를 가져온다.
6. 클라이언트 정보를 가지고 서버 요청을 처리하여 클라이언트에게 응답한다.



## 특징

- 각 클라이언트에게 고유 id를 부여한다.
- session-id로 클라이언트를 구분해서 클라이언트의 요구에 맞는 서비스를 제공한다.
- 보안 면에서 쿠키보다 우수하다.
- 서버에서의 처리 과정이 있기 때문에 쿠키에 비해 느리다.
- 사용자가 많아질수록 서버 메모리를 많이 차지하게 된다.



## 관련 이슈

개발을 하다가 서버에서 session에 데이터를 저장해도 클라이언트에서 session에 저장된 값을 전달받지 못하는 경우가 있었다.

디버깅을 진행하다가 cors 이슈와 관련있다는 것을 알았다.

[참고 포스팅](https://kosaf04pyh.tistory.com/152)

CORS에서는 기본적으로 쿠키를 request headers에 넣어주지 않는 정책이다.

요청시에 withCredentials : true를 해주고, 마찬가지로 서버의 응답헤더에 Access-Control-Allow-Credentials : true를 해주어야 한다.