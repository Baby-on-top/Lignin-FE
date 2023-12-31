/** @jsxImportSource @emotion/react */
import { widgetTitleUpdate } from "../../utils/apis";
import { useEffect, useContext } from "react";
import { SocketContext } from "../../utils/socket";

export default function InputTitle({
  widgetId,
  fetch,
  text,
  setText,
  setIsMod,
}) {
  const socket = useContext(SocketContext);
  const sendChanges = (id, title) => {
    socket.emit("title-changes", {
      id,
      title,
    });
  };

  const changeTitle = async (id, change) => {
    try {
      const response = await widgetTitleUpdate(id, change);
      fetch();
      sendChanges(response.data.id, response.data.widgetTitle);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    socket.on("data", (data) => {
      if (data.id == widgetId) {
        setText(data.title);
      }
    });
  }, [socket]);

  return (
    <input
      css={{
        width: "100%",
        height: 52,
        margin: "21.4px 0px",
        fontSize: "2.11em",
        fontWeight: "bolder",
        border: "none",
        padding: 0,
        ":focus": {
          outline: "none",
        },
      }}
      onClick={(e) => {
        e.stopPropagation();
        setIsMod(true);
      }}
      value={text}
      onChange={(event) => {
        setText(event.target.value);
        changeTitle(widgetId, event.target.value);
      }}
    />
  );
}
