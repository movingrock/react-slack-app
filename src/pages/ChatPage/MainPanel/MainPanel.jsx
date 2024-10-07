import React, { useEffect, useRef, useState } from "react";
import MessageHeader from "./MessageHeader";
import MessageForm from "./MessageForm";
import {
  child,
  off,
  onChildAdded,
  ref as dbRef,
  onChildRemoved,
  remove,
} from "firebase/database";
import { db } from "../../../firebase";
import { useDispatch, useSelector } from "react-redux";
import Message from "./Message";
import { setUserPosts } from "../../../store/chatRoomSlice";
import Skeleton from "../../../components/Skeleton";

const MainPanel = () => {
  const messagesRef = dbRef(db, "messages");
  const typingRef = dbRef(db, "typing");
  const messageEndRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const [listenerLists, setListenerLists] = useState([]);

  const dispatch = useDispatch();

  const { currentChatRoom } = useSelector((state) => state.chatRoom);
  const { currentUser } = useSelector((state) => state.user);

  const scrollToBottom = () => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]); // 메시지가 추가될 때마다 스크롤

  useEffect(() => {
    if (currentChatRoom.id) {
      addMessagesListner(currentChatRoom.id);
      addTypingListeners(currentChatRoom.id);

      const typingRefForCurrentUser = child(
        typingRef,
        `${currentChatRoom.id}/${currentUser.uid}`
      );
      remove(typingRefForCurrentUser); // Clear typing status when switching rooms
    }
    return () => {
      off(messagesRef);
      removeListeners(listenerLists);
    };
  }, [currentChatRoom.id]);

  const removeListeners = (listeners) => {
    listeners.forEach((listener) => {
      off(dbRef(db, `messages/${listener.id}`), listener.event);
    });
  };

  // 누가 채팅치고 있는지를 db에 불러오고 다른 상대에게 보여줌.
  const addTypingListeners = (chatRoomId) => {
    let typingUsers = [];

    // typing이 새로 들어올때
    onChildAdded(child(typingRef, chatRoomId), (DataSnapshot) => {
      if (DataSnapshot.key !== currentUser.uid) {
        typingUsers = typingUsers.concat({
          id: DataSnapshot.key,
          name: DataSnapshot.val(),
        });
        setTypingUsers(typingUsers);
      }
    });

    addToListenerLists(chatRoomId, typingRef, "child_added");

    onChildRemoved(child(typingRef, chatRoomId), (DataSnapShot) => {
      const index = typingUsers.findIndex(
        (user) => user.id === DataSnapShot.key
      );
      if (index !== -1) {
        typingUsers = typingUsers.filter(
          (user) => user.id !== DataSnapShot.key
        );
        setTypingUsers(typingUsers);
      }
    });
    addToListenerLists(chatRoomId, typingRef, "child_removed");
  };

  const addToListenerLists = (id, ref, event) => {
    //이미 등록된 리스너인지 확인
    const index = listenerLists.findIndex((listener) => {
      return (
        listener.id === id && listener.ref === ref && listener.event === event
      );
    });

    if (index === -1) {
      const newListener = { id, ref, event };
      setListenerLists(listenerLists.concat(newListener));
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setSearchLoading(true);
    handleSearchMessages(event.target.value);
  };

  const handleSearchMessages = (searchTerm) => {
    const chatRooomMessages = [...messages];
    const regex = new RegExp(searchTerm, "gi");
    const searchResults = chatRooomMessages.reduce((acc, message) => {
      if (
        (message.content && message.content.match(regex)) ||
        message.user.name.match(regex)
      ) {
        acc.push(message);
      }
      return acc;
    }, []);
    setSearchResults(searchResults);
    setSearchLoading(false);
  };

  const addMessagesListner = (chatRoomId) => {
    let messagesArray = [];
    setMessages([]);

    onChildAdded(child(messagesRef, chatRoomId), (DataSnapshot) => {
      messagesArray.push(DataSnapshot.val());
      const newMessageArray = [...messagesArray];

      setMessages(newMessageArray);
      setMessagesLoading(false);
      userPostsCount(newMessageArray);
    });
  };

  // 메시지 개수세기
  const userPostsCount = (messages) => {
    const userPosts = messages.reduce((acc, message) => {
      if (message.user.name in acc) {
        acc[message.user.name].count += 1;
      } else {
        acc[message.user.name] = {
          image: message.user.image,
          count: 1,
        };
      }
      return acc;
    }, {});
    dispatch(setUserPosts(userPosts));
  };

  const renderTypingUsers = (typingUsers) => {
    return (
      typingUsers.length > 0 &&
      typingUsers.map((user) => (
        <div key={user.name.userUid}>
          {user.name.userUid}님이 채팅을 입력하고 있습니다...
        </div>
      ))
    );
  };

  const renderMessages = (messages) => {
    return (
      messages.length > 0 &&
      messages.map((message) => (
        <Message
          key={message.timestamp}
          message={message}
          user={currentUser}
          scrollToBottom={scrollToBottom}
        />
      ))
    );
  };

  const renderMessageSkeleton = (loading) => {
    return (
      loading && (
        <>
          {[...Array(13)].map((_, i) => (
            <Skeleton key={i} />
          ))}
        </>
      )
    );
  };

  return (
    <div style={{ padding: "2rem 2rem 0 2rem" }}>
      <MessageHeader handleSearchChange={handleSearchChange} />

      <div
        style={{
          width: "100%",
          height: "450px",
          border: "0.2rem solid #ececec",
          borderRadius: "4px",
          padding: "1rem",
          marginBottom: "1rem",
          overflowY: "auto",
        }}
      >
        {renderMessageSkeleton(messagesLoading)}
        {searchLoading && <div>loading...</div>}
        {searchTerm ? renderMessages(searchResults) : renderMessages(messages)}
        {renderTypingUsers(typingUsers)}
        <div ref={messageEndRef} />
      </div>

      <MessageForm />
    </div>
  );
};

export default MainPanel;
