import {
  child,
  push,
  ref as dbRef,
  serverTimestamp,
  set,
  remove,
} from "firebase/database";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { db, storage } from "../../../firebase";
import {
  getDownloadURL,
  ref as strRef,
  uploadBytesResumable,
} from "firebase/storage";
import { ProgressBar } from "react-bootstrap";

const MessageForm = () => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [percentage, setPercentage] = useState(0);

  const messagesRef = dbRef(db, "messages");
  const typingRef = dbRef(db, "typing");

  const inputOpenImageRef = useRef(null);

  const { currentChatRoom } = useSelector((state) => state.chatRoom);
  const { isPrivateChatRoom } = useSelector((state) => state.chatRoom);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    setContent("");
  }, [currentChatRoom.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content) {
      setErrors((prev) => prev.concat("Type contents first"));
      return;
    }
    setLoading(true);

    try {
      await set(push(child(messagesRef, currentChatRoom.id)), createMessage());
      await remove(
        child(typingRef, `${currentChatRoom.id}/${currentUser.uid}`)
      );
      setLoading(false);
      setContent("");
      setErrors([]);
    } catch (error) {
      setErrors((prev) => prev.concat(error.message));
      setLoading(false);
      setTimeout(() => {
        setErrors([]);
      }, 5000);
    }
  };

  const createMessage = (fileUrl = null) => {
    const message = {
      timestamp: serverTimestamp(),
      user: {
        id: currentUser.uid,
        name: currentUser.displayName,
        image: currentUser.photoURL,
      },
    };

    if (fileUrl !== null) {
      message["image"] = fileUrl;
    } else {
      message["content"] = content;
    }

    return message;
  };

  const handleOpenImageRef = () => {
    inputOpenImageRef.current.click();
  };

  const getPath = () => {
    if (isPrivateChatRoom) {
      return `/message/private/${currentChatRoom.id}`;
    } else {
      return `/message/public`;
    }
  };

  const handleUploadImage = (event) => {
    const file = event.target.files[0];

    // Create the file metadata
    /** @type {any} */
    const metadata = {
      contentType: file.type,
    };

    // Upload file and metadata to the object 'images/mountains.jpg'
    const storageRef = strRef(storage, `${getPath()}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setPercentage(Math.round(progress));
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        switch (error.code) {
          case "storage/unauthorized":
            break;
          case "storage/canceled":
            break;
          case "storage/unknown":
            break;
        }
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);

          set(
            push(child(messagesRef, currentChatRoom.id)),
            createMessage(downloadURL)
          );
          setLoading(false);
        });
      }
    );
  };

  const handleChange = (event) => {
    setContent(event.target.value);

    if (event.target.value) {
      set(dbRef(db, `typing/${currentChatRoom.id}/${currentUser.uid}`), {
        userUid: currentUser.displayName,
      });
    } else {
      remove(dbRef(db, `typing/${currentChatRoom.id}/${currentUser.uid}`));
    }
  };

  const handleKeyDown = (event) => {
    // Shift + Enter: 줄 바꿈
    if (event.key === "Enter" && event.shiftKey) {
      return;
    }
    // Enter: 메시지 전송
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <textarea
          style={{
            width: "100%",
            height: 90,
            border: "0.2rem solid rgb(236, 236, 236)",
            borderRadius: 4,
          }}
          value={content}
          onChange={handleChange}
          onKeyDown={handleKeyDown} // 엔터키 감지
        />
        {!(percentage === 0 || percentage === 100) && (
          <ProgressBar
            variant="warning"
            label={`${percentage}%`}
            now={percentage}
          />
        )}

        <div>
          {errors.map((errorMsg, i) => (
            <p style={{ color: "red" }} key={i}>
              {errorMsg}
            </p>
          ))}
        </div>

        <div style={{ display: "flex", gap: 16 }}>
          <div style={{ flexGrow: 1 }}>
            <button
              className="message-form-button"
              type="submit"
              style={{ width: "100%", fontSize: 20, fontWeight: "bold" }}
              disabled={loading}
            >
              보내기
            </button>
          </div>
          <div style={{ flexGrow: 1 }}>
            <button
              className="message-form-button"
              type="button"
              onClick={handleOpenImageRef}
              style={{ width: "100%", fontSize: 20, fontWeight: "bold" }}
              disabled={loading}
            >
              이미지
            </button>
          </div>
        </div>
      </form>
      <input
        type="file"
        accept="image/jpeg, image/png"
        style={{ display: "none" }}
        ref={inputOpenImageRef}
        onChange={handleUploadImage}
      />
    </div>
  );
};

export default MessageForm;
