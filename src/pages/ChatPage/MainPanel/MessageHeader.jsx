import React, { useState } from "react";
import { Col, FormControl, Image, InputGroup, Row } from "react-bootstrap";
import { AiOutlineSearch } from "react-icons/ai";
import { FaLock, FaLockOpen } from "react-icons/fa";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { useSelector } from "react-redux";

const MessageHeader = ({ handleSearchChange }) => {
  const { currentChatRoom } = useSelector((state) => state.chatRoom);
  const { isPrivateChatRoom } = useSelector((state) => state.chatRoom);
  const [isFavorite, setIsFavorite] = useState(false);
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
            {isPrivateChatRoom ? <FaLock style={{ marginBottom: 10 }} /> : <FaLockOpen style={{ marginBottom: 10 }} />}{" "}
            <span>{currentChatRoom?.name}</span> {` `}
            {!isPrivateChatRoom && <span>{isFavorite ? <MdFavorite /> : <MdFavoriteBorder />}</span>}
          </h2>
        </Col>
        <Col>
          <InputGroup>
            <InputGroup.Text>
              <AiOutlineSearch />
            </InputGroup.Text>
            <FormControl onChange={handleSearchChange} placeholder="Search Messages" />
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
