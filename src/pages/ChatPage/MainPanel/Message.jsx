import moment from "moment";
import React, { useRef } from "react";
import { Image } from "react-bootstrap";

const Message = ({ message, user, scrollToBottom }) => {
  const messageRef = useRef(null);

  const timeFromNow = (timestamp) => moment(timestamp).fromNow();

  const isImage = (message) => {
    return !!message.image;
  };

  const isMessageMine = (message, user) => {
    return user && message.user.id === user.uid;
  };

  // 이미지 로드 후 스크롤을 트리거하는 함수
  const handleImageLoad = () => {
    if (scrollToBottom) {
      scrollToBottom(); // 이미지가 로드되면 스크롤을 아래로 내림
    }
  };

  const renderTextWithLineBreaks = (text) => {
    // \n을 <br />로 변환하여 줄바꿈을 처리
    const convertedText = text.replace(/\n/g, "<br />");
    return { __html: convertedText };
  };

  return (
    <div style={{ margin: "16px 0", display: "flex" }} ref={messageRef}>
      <Image
        roundedCircle
        style={{ width: 40, height: 40, marginTop: 3 }}
        src={message.user.image}
        alt={message.user.name}
      />
      <div style={{ marginLeft: 10 }}>
        <h6
          style={{
            color: isMessageMine(message, user) ? "rgb(123, 131, 235)" : "",
          }}
        >
          {message.user.name}{" "}
          <span style={{ fontSize: 10, color: "gray" }}>
            {timeFromNow(message.timestamp)}
          </span>
        </h6>
        <h6>
          {isImage(message) ? (
            <img
              style={{ maxWidth: 300, borderRadius: 10 }}
              alt="이미지"
              src={message.image}
              onLoad={handleImageLoad} // 이미지 로드 시 스크롤
            />
          ) : (
            <p
              dangerouslySetInnerHTML={renderTextWithLineBreaks(
                message.content
              )}
            />
          )}
        </h6>
      </div>
    </div>
  );
};

export default Message;
