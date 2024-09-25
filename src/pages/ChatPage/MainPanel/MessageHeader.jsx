import React, { useEffect, useState } from "react";
import { Col, FormControl, Image, InputGroup, Row } from "react-bootstrap";
import { AiOutlineSearch } from "react-icons/ai";
import { FaLock, FaLockOpen } from "react-icons/fa";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { useSelector } from "react-redux";
import { child, onValue, ref, remove, update } from "firebase/database";
import { db } from "../../../firebase";

const MessageHeader = ({ handleSearchChange }) => {
  const { currentChatRoom } = useSelector((state) => state.chatRoom);
  const { isPrivateChatRoom } = useSelector((state) => state.chatRoom);
  const { currentUser } = useSelector((state) => state.user);
  const [isFavorite, setIsFavorite] = useState(false);
  const usersRef = ref(db, "users");

  useEffect(() => {
    if (currentChatRoom?.id && currentUser?.uid)
      addFavoriteListner(currentChatRoom.id, currentUser.uid);
  }, [currentChatRoom?.id, currentUser?.uid]);

  // useEffect로 이미 favorite표시가 되어있는 값을 불러옴.
  // onValue child의 경로값이 바뀌면 뒤에 함수가 실행됨.
  const addFavoriteListner = (chatRoomId, userId) => {
    onValue(child(usersRef, `${userId}/favorite`), (data) => {
      if (data.val() !== null) {
        const chatRoomIds = Object.keys(data.val());
        const isAlreadyFavorite = chatRoomIds.includes(chatRoomId);
        setIsFavorite(isAlreadyFavorite);
      }
    });
  };

  // favorite표시가 된 값을 누르면 해제되고, 아닌값을 누르면 favorite에 넣어줌.
  // remove, update로 db에 users/favorite에 넣고 삭제
  // chatroomId별로 저장하고 객체정보를 갖음.
  const handleFavorite = () => {
    if (isFavorite) {
      setIsFavorite(false);
      remove(
        child(usersRef, `${currentUser.uid}/favorite/${currentChatRoom.id}`)
      );
    } else {
      setIsFavorite(true);
      update(child(usersRef, `${currentUser.uid}/favorite`), {
        [currentChatRoom.id]: {
          name: currentChatRoom.name,
          description: currentChatRoom.description,
          createdBy: {
            name: currentChatRoom.createdBy.name,
            image: currentChatRoom.createdBy.image,
          },
        },
      });
    }
  };
  return (
    <div
      style={{
        width: "100%",
        border: "0.2rem solid #ececec",
        borderRadius: "4px",
        height: "190px",
        padding: "1rem",
        marginBottom: "1rem",
      }}
    >
      <Row>
        <Col>
          <h2>
            {isPrivateChatRoom ? (
              <FaLock style={{ marginBottom: 10 }} />
            ) : (
              <FaLockOpen style={{ marginBottom: 10 }} />
            )}{" "}
            <span>{currentChatRoom?.name}</span> {` `}
            {!isPrivateChatRoom && (
              <span style={{ cursor: "pointer" }} onClick={handleFavorite}>
                {isFavorite ? (
                  <MdFavorite style={{ marginBottom: 10 }} />
                ) : (
                  <MdFavoriteBorder style={{ marginBottom: 10 }} />
                )}
              </span>
            )}
          </h2>
        </Col>
        <Col>
          <InputGroup>
            <InputGroup.Text>
              <AiOutlineSearch />
            </InputGroup.Text>
            <FormControl
              onChange={handleSearchChange}
              placeholder="Search Messages"
            />
          </InputGroup>
        </Col>
      </Row>

      {!isPrivateChatRoom && (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Image
            roundedCircle
            src={currentChatRoom?.createdBy.image}
            style={{ width: 30, height: 30, marginRight: 7 }}
          />
          <p>{currentChatRoom?.createdBy.name}</p>
        </div>
      )}
    </div>
  );
};

export default MessageHeader;
