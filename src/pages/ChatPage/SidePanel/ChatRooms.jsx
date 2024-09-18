import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { FaPlus, FaRegSmileWink } from "react-icons/fa";

const ChatRooms = () => {
  const [show, setShow] = useState(false);
  return (
    <div>
      <div style={{ position: "relative", width: "100%", display: "flex", alignItems: "center" }}>
        <FaRegSmileWink style={{ marginRight: 3 }} />
        CHAT ROOMS
        <FaPlus onClick={() => setshow(!show)} />
      </div>

      <Modal>
        <Modal.Header closeButton>
          <Modal.Title>채팅 방 생성하기</Modal.Title>
        </Modal.Header>
      </Modal>
    </div>
  );
};

export default ChatRooms;
