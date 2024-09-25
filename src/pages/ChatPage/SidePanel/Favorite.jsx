import {
  child,
  off,
  onChildAdded,
  onChildRemoved,
  ref,
} from "firebase/database";
import React, { useEffect, useState } from "react";
import { FaRegSmileBeam } from "react-icons/fa";
import { db } from "../../../firebase";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentChatRoom,
  setPrivateChatRoom,
} from "../../../store/chatRoomSlice";

const Favorite = () => {
  const dispatch = useDispatch();
  const [newFavoriteChatRooms, setNewFavoriteChatRooms] = useState([]);
  const [activeChatRoomId, setActiveChatRoomId] = useState("");
  const usersRef = ref(db, "users");
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentUser?.uid) addListener(currentUser.uid);

    return () => {
      if (currentUser?.uid) {
        removeListener(currentUser.uid);
      }
    };
  }, [currentUser?.uid]);

  const removeListener = (userId) => {
    off(child(usersRef, `${userId}/favorite`));
  };

  const addListener = (userId) => {
    let favoriteArray = [];
    onChildAdded(child(usersRef, `${userId}/favorite`), (DataSnapshot) => {
      favoriteArray.push({ id: DataSnapshot.key, ...DataSnapshot.val() });
      const newFavoriteChatRooms = [...favoriteArray];

      setNewFavoriteChatRooms(newFavoriteChatRooms);
    });

    onChildRemoved(child(usersRef, `${userId}/favorite`), (DataSnapshot) => {
      const filteredChatRooms = favoriteArray.filter((chatRoom) => {
        return chatRoom.id !== DataSnapshot.key;
      });

      favoriteArray = filteredChatRooms;

      setNewFavoriteChatRooms(filteredChatRooms);
    });
  };

  const changeChatRoom = (room) => {
    dispatch(setCurrentChatRoom(room));
    dispatch(setPrivateChatRoom(false));
    setActiveChatRoomId(room.id);
  };

  const renderFavoriteChatRooms = (favoriteChatRooms) => {
    return (
      favoriteChatRooms.length > 0 &&
      favoriteChatRooms.map((chatRoom) => (
        <li
          key={chatRoom.id}
          onClick={() => changeChatRoom(chatRoom)}
          style={{
            backgroundColor:
              chatRoom.id === activeChatRoomId ? "#ffffff45" : "",
          }}
        >
          # {chatRoom.name}
        </li>
      ))
    );
  };

  return (
    <div>
      <span style={{ display: "flex", alignItems: "center" }}>
        <FaRegSmileBeam style={{ marginRight: 5 }} />
        FAVORITE {`(${newFavoriteChatRooms.length})`}
      </span>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {renderFavoriteChatRooms(newFavoriteChatRooms)}
      </ul>
    </div>
  );
};

export default Favorite;
