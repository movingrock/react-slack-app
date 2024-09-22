import React from "react";
import { Image } from "react-bootstrap";

const Message = ({ message, user }) => {
  return (
    <div>
      <Image
        roundedCircle
        style={{ width: 40, height: 40, marginTop: 3 }}
        src={message.user.image}
        alt={message.user.name}
      />
      <div>
        <h6>{message.user.name}</h6>
      </div>
    </div>
  );
};

export default Message;
