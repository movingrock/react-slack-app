import React, { useEffect, useState } from "react";
import { Badge, Button, Form, Modal } from "react-bootstrap";
import { FaPlus, FaRegSmileWink } from "react-icons/fa";
import { db } from "../../../firebase";
import { child, off, onChildAdded, onValue, push, ref, update } from "firebase/database";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentChatRoom, setPrivateChatRoom } from "../../../store/chatRoomSlice";

const ChatRooms = () => {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [chatRooms, setChatRooms] = useState([]);
  const [firstLoad, setFirstLoad] = useState(true);
  const [activeChatRoomId, setActiveChatRoomId] = useState("");
  const [notifications, setNotifications] = useState([]);

  const chatRoomsRef = ref(db, "chatrooms");
  const messagesRef = ref(db, "messages");

  const { currentUser } = useSelector((state) => state.user);
  const { currentChatRoom } = useSelector((state) => state.chatRoom);
  const dispatch = useDispatch();

  useEffect(() => {
    addChatRoomsListeners();
    return () => {
      off(chatRoomsRef);
      chatRooms.forEach((chatRoom) => off(child(messagesRef, chatRoom.id)));
    };
  }, []);

  const handleSubmit = async (e) => {
    if (name && description) {
      const key = push(chatRoomsRef).key;
      const newChatRoom = {
        id: key,
        name: name,
        description: description,
        createdBy: {
          name: currentUser.displayName,
          image: currentUser.photoURL,
        },
      };

      try {
        await update(child(chatRoomsRef, key), newChatRoom);
        setName("");
        setDescription("");
        setShow(false);
      } catch (error) {
        alert(error);
      }
    }
  };

  const addChatRoomsListeners = () => {
    let chatRoomsArray = [];

    onChildAdded(chatRoomsRef, (DataSnapshot) => {
      chatRoomsArray.push(DataSnapshot.val());
      const newChatRooms = [...chatRoomsArray];
      setChatRooms(newChatRooms);
      setFirstChatRoom(newChatRooms);
      addNotificationListner(DataSnapshot.key);
    });
  };

  const addNotificationListner = (chatRoomId) => {
    onValue(child(messagesRef, chatRoomId), (DataSnapshot) => {
      if (currentChatRoom) {
        handleNotification(chatRoomId, currentChatRoom.id, notifications, DataSnapshot);
      }
    });
  };

  const handleNotification = (chatRoomId, currentChatRoomId, notifications, DataSnapshot) => {
    let index = notifications.findIndex((notification) => notification.id === chatRoomId);

    if (index === -1) {
      notifications.push({
        id: chatRoomId,
        total: DataSnapshot.size,
        lastKnowTotal: DataSnapshot.size,
        count: 0,
      });
    } else {
      if (chatRoomId !== currentChatRoomId) {
        let lastTotal = notifications[index].lastKnowTotal;
        if (DataSnapshot.size - lastTotal > 0) {
          notifications[index].count = DataSnapshot.size - lastTotal;
        }
      }
      notifications[index].total = DataSnapshot.size;
    }

    setNotifications([...notifications]);
  };

  const getNotificationCount = (chatRoom) => {
    let count = 0;

    notifications.forEach((notification) => {
      if (notification.id === chatRoom.id) {
        count = notification.count;
      }
    });

    if (count > 0) return count;
  };

  const setFirstChatRoom = (chatRooms) => {
    const firstChatRoom = chatRooms[0];
    if (firstLoad && chatRooms.length > 0) {
      dispatch(setCurrentChatRoom(firstChatRoom));
      setActiveChatRoomId(firstChatRoom.id);
    }
    setFirstLoad(false);
  };

  const changeChatRoom = (room) => {
    dispatch(setCurrentChatRoom(room));
    dispatch(setPrivateChatRoom(false));
    setActiveChatRoomId(room.id);
    clearNotifications(room);

    addNotificationListner(room.id);
  };

  const clearNotifications = (room) => {
    let index = notifications.findIndex((notification) => notification.id === room.id);

    if (index !== -1) {
      let updatedNotifications = [...notifications];
      updatedNotifications[index].lastKnowTotal = notifications[index].total;
      updatedNotifications[index].count = 0;
      setNotifications(updatedNotifications);
    }
  };

  const renderChatRooms = () => {
    return (
      chatRooms.length > 0 &&
      chatRooms.map((room) => (
        <li
          key={room.id}
          onClick={() => changeChatRoom(room)}
          style={{
            backgroundColor: room.id === activeChatRoomId ? "#ffffff45" : "",
          }}
        >
          # {room.name}
          <Badge style={{ float: "right", marginRight: "4px" }} bg="danger">
            {getNotificationCount(room)}
          </Badge>
        </li>
      ))
    );
  };

  return (
    <div>
      <div
        style={{
          position: "relative",
          width: "100%",
          display: "flex",
          alignItems: "center",
        }}
      >
        <FaRegSmileWink style={{ marginRight: 5 }} />
        CHAT ROOMS {`(${chatRooms.length})`}
        <FaPlus onClick={() => setShow(!show)} style={{ position: "absolute", right: 0, cursor: "pointer" }} />
      </div>
      <ul style={{ listStyleType: "none", padding: 0 }}>{renderChatRooms()}</ul>
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>채팅 방 생성하기</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>방 이름</Form.Label>
              <Form.Control
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder="채팅 방 이름을 입력하세요."
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>방 설명</Form.Label>
              <Form.Control
                onChange={(e) => setDescription(e.target.value)}
                type="text"
                placeholder="채팅 방 설명을 작성하세요."
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            취소
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            생성
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ChatRooms;
