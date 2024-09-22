import React, { useEffect, useState } from "react";
import MessageHeader from "./MessageHeader";
import MessageForm from "./MessageForm";
import { child, off, onChildAdded, ref as dbRef } from "firebase/database";
import { db } from "../../../firebase";
import { useSelector } from "react-redux";
import Message from "./Message";

const MainPanel = () => {
  const messagesRef = dbRef(db, "messages");
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(true);

  const { currentChatRoom } = useSelector((state) => state.chatRoom);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentChatRoom.id) addMessagesListner(currentChatRoom.id);
    return () => {
      off(messagesRef);
    };
  }, [currentChatRoom.id]);

  const addMessagesListner = (chatRoomId) => {
    let messagesArray = [];

    onChildAdded(child(messagesRef, chatRoomId), (DataSnapshot) => {
      messagesArray.push(DataSnapshot.val());
      const newMessageArray = [...messagesArray];

      setMessages(newMessageArray);
      setMessagesLoading(false);
    });
  };

  const renderMessages = (messages) => {
    return (
      messages.length > 0 &&
      messages.map((message) => (
        <Message key={message.timestamp} message={message} user={currentUser} />
      ))
    );
  };

  return (
    <div style={{ padding: "2rem 2rem 0 2rem" }}>
      <MessageHeader />

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
        {renderMessages(messages)}
      </div>

      <MessageForm />
    </div>
  );
};

export default MainPanel;
