import React, { useState } from "react";

export default function ChatBox({ demand, logs = [], onSend, onAddFriend }) {
  const [input, setInput] = useState("");

  if (!demand) {
    return (
      <div className="chatbox">
        <div className="chat-placeholder">请选择一个需求开始聊天</div>
      </div>
    );
  }

  const send = () => {
    if (input.trim()) {
      onSend({ from: "我", text: input, timestamp: Date.now() });
      setInput("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="chatbox">
      <div><strong>与"{demand.type}"相关需求聊天</strong></div>
      <div className="chat-messages">
        {logs.length === 0 ? (
          <div className="chat-placeholder">暂无聊天记录，开始对话吧！</div>
        ) : (
          logs.map((m, i) => (
            <div key={i}><b>{m.from}:</b> {m.text}</div>
          ))
        )}
      </div>
      <div className="chat-input-row">
        <input 
          value={input} 
          onChange={e => setInput(e.target.value)} 
          onKeyPress={handleKeyPress}
          placeholder="说点什么..." 
        />
        <button className="chat-btn" onClick={send}>发送</button>
      </div>
      <button className="chat-btn" onClick={() => onAddFriend(demand)}>搭成，加入搭子</button>
    </div>
  );
}