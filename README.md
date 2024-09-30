# 프로젝트 구성

### 배포

[https://react-chat-app-278eb.web.app/login](https://react-chat-app-278eb.web.app/login)

# 설치

```
npm init vite
npm i
```

```
npm install @reduxjs/toolkit bootstrap firebase md5 moment react-bootstrap react-hook-form react-icons react-redux react-router-dom
```

# 프로젝트 개선한 부분

1. 이미지 업로드시 autoscroll시 적용되지 않음. (onLoad를 활용해 이미지 로드시 autoscroll 되도록 수정)
2. 메세지 입력후 enter키 입력시 메세지 보내지도록 수정 (onKeyDown 사용)
3. shift + enter 입력시 줄바꿈 되도록 수정
4. 메세지 내용이 줄바꿈 되도록 변경 (/n을 <br>로 변경)

# 개선해야할 점

1. 오토스크롤이 typing시 자동으로 제일 밑까지 안내려감
2. 방 이동시 textarea 비워주기, typing 지우기
3. 여러명이 typing 시 (test4님이 채팅을 입력하고 있습니다...test2님이 채팅을 입력하고 있습니다...) 수정하기
4. 왼쪽 사이드 패널 하이라이트 적절히 설정(favorite과 chatroom 동기화, directMessage 클릭시 chatroom 비활성화)
5. firebase rules problem
