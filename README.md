# react-slack-app

## 프로젝트 구성

### 프로젝트 설명

- firebase를 이용한 로그인/회원가입, 유효성 체크
- 채팅방 생성, 설명 추가, 즐겨찾기 추가/삭제
- 메시지 알림 개수 표시, 채팅 검색, 스켈레톤
- 상대방 대화 입력 시 알려주기
- 이미지 업로드, 업로드 퍼센테이지 보여주기
- 유저 랜덤 아이콘, 아이콘 이미지 교체
- firebase로 애플리케이션 배포

### 배포

- [https://react-chat-app-278eb.web.app/](https://react-chat-app-278eb.web.app/)

### 사용기술

- firebase, vite
- react.js, javascript

### 파일 구조

```
📦src
┣ 📂assets
┃ ┗ 📜react.svg
┣ 📂components
┃ ┣ 📜Skeleton.css
┃ ┗ 📜Skeleton.jsx
┣ 📂pages
┃ ┣ 📂ChatPage
┃ ┃ ┣ 📂MainPanel
┃ ┃ ┃ ┣ 📜MainPanel.jsx
┃ ┃ ┃ ┣ 📜Message.jsx
┃ ┃ ┃ ┣ 📜MessageForm.jsx
┃ ┃ ┃ ┗ 📜MessageHeader.jsx
┃ ┃ ┣ 📂SidePanel
┃ ┃ ┃ ┣ 📜ChatRooms.jsx
┃ ┃ ┃ ┣ 📜DirectMessages.jsx
┃ ┃ ┃ ┣ 📜Favorite.jsx
┃ ┃ ┃ ┣ 📜SidePanel.jsx
┃ ┃ ┃ ┗ 📜UserPanel.jsx
┃ ┃ ┗ 📜ChatPage.jsx
┃ ┣ 📂LoginPage
┃ ┃ ┗ 📜LoginPage.jsx
┃ ┗ 📂RegisterPage
┃ ┃ ┗ 📜RegisterPage.jsx
┣ 📂store
┃ ┣ 📜chatRoomSlice.js
┃ ┣ 📜index.js
┃ ┗ 📜userSlice.js
┣ 📜App.css
┣ 📜App.jsx
┣ 📜firebase.js
┣ 📜index.css
┗ 📜main.jsx
```

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
5. 오토스크롤이 typing시 자동으로 제일 밑까지 안내려감
   - typing시 안내 메세지를 span이 아닌 div로 바꿔서 해결
6. 방 이동시 textarea 비워주기
   - useEffect로 새로운 방으로 이동시 setContent를 빈 문자로 바꿔줘기

# 개선해야할 점

2.  typing 지우기
3.  여러명이 typing 시 (test4님이 채팅을 입력하고 있습니다...test2님이 채팅을 입력하고 있습니다...) 수정하기
4.  왼쪽 사이드 패널 하이라이트 적절히 설정(favorite과 chatroom 동기화, directMessage 클릭시 chatroom 비활성화)
5.  내가 읽은 부분 표시 안읽은 메세지 개수 보여주기
6.  firebase rules problem
