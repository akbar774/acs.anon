const socket = io();
const messages = document.getElementById("messages");
const input = document.getElementById("msg");

let pc;

socket.on("waiting", () => {
  messages.innerHTML = "<i>Waiting for a stranger...</i>";
});

socket.on("paired", () => {
  messages.innerHTML = "<i>You are now connected!</i>";
});

socket.on("message", (msg) => {
  const p = document.createElement("p");
  p.textContent = "Stranger: " + msg;
  messages.appendChild(p);
});

socket.on("skipped", () => {
  messages.innerHTML = "<i>Stranger skipped. Looking for new one...</i>";
  socket.emit("skip");
});

socket.on("disconnected", () => {
  messages.innerHTML += "<p><i>Stranger disconnected.</i></p>";
});

input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const msg = input.value;
    if (msg.trim() === "") return;
    socket.emit("message", msg);
    const p = document.createElement("p");
    p.textContent = "You: " + msg;
    messages.appendChild(p);
    input.value = "";
  }
});

function skip() {
  socket.emit("skip");
  messages.innerHTML = "<i>Searching for new stranger...</i>";
}

// Voice Chat (WebRTC P2P)
function startVoice() {
  pc = new RTCPeerConnection();
  navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
    pc.addTrack(stream.getTracks()[0], stream);
    pc.onicecandidate = e => {
      if (e.candidate) socket.emit("signal", { type: "ice", data: e.candidate });
    };
    pc.createOffer().then(offer => {
      pc.setLocalDescription(offer);
      socket.emit("signal", { type: "offer", data: offer });
    });
  });

  pc.ontrack = e => {
    const audio = document.createElement("audio");
    audio.srcObject = new MediaStream([e.track]);
    audio.autoplay = true;
    document.body.appendChild(audio);
  };
}

socket.on("signal", async (data) => {
  if (!pc) {
    pc = new RTCPeerConnection();
    pc.onicecandidate = e => {
      if (e.candidate) socket.emit("signal", { type: "ice", data: e.candidate });
    };
    pc.ontrack = e => {
      const audio = document.createElement("audio");
      audio.srcObject = new MediaStream([e.track]);
      audio.autoplay = true;
      document.body.appendChild(audio);
    };
  }

  if (data.type === "offer") {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      pc.addTrack(stream.getTracks()[0], stream);
      pc.setRemoteDescription(new RTCSessionDescription(data.data));
      pc.createAnswer().then(answer => {
        pc.setLocalDescription(answer);
        socket.emit("signal", { type: "answer", data: answer });
      });
    });
  } else if (data.type === "answer") {
    pc.setRemoteDescription(new RTCSessionDescription(data.data));
  } else if (data.type === "ice") {
    pc.addIceCandidate(new RTCIceCandidate(data.data));
  }
});
