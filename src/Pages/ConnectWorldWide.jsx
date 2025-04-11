import React, { useState, useRef } from "react";

const ConnectWorldWide = () => {
  const [peerConnection, setPeerConnection] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const startVideoCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      setIsVideoOn(true);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
      });

      pc.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
          setRemoteStream(event.streams[0]);
        }
      };

      setPeerConnection(pc);
      setIsConnected(true);
    } catch (err) {
      console.error("Error accessing media devices:", err);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOn(videoTrack.enabled);
      }
    }
  };

  const startScreenShare = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      setIsScreenSharing(true);

      const screenTrack = screenStream.getTracks()[0];
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }

      const newStream = new MediaStream([screenTrack, localStream.getAudioTracks()[0]]);
      setLocalStream(newStream);

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = newStream;
      }

      const pc = peerConnection;
      const sender = pc.getSenders().find((sender) => sender.track.kind === "video");
      if (sender) {
        sender.replaceTrack(screenTrack);
      }
    } catch (err) {
      console.error("Error starting screen share:", err);
    }
  };

  const stopScreenShare = () => {
    if (localStream) {
      const screenTrack = localStream.getVideoTracks()[0];
      screenTrack.stop();

      startVideoCall(); // Revert to normal video call
      setIsScreenSharing(false);
    }
  };

  const handleSkip = () => {
    setIsConnected(false);
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }
    if (remoteStream) {
      remoteStream.getTracks().forEach((track) => track.stop());
      setRemoteStream(null);
    }
    if (peerConnection) {
      peerConnection.close();
      setPeerConnection(null);
    }
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
  };

  return (
    <div className="flex flex-col h-screen justify-left items-left bg-white text-black font-sans p-10">
      <div className="flex flex-col items-left w-full max-w-lg gap-4 bg-gray-100 rounded-2xl shadow-xl p-6">
        {/* Cameras in flex container */}
        <div className="flex gap-4 justify-center items-center">
          {/* Local Video (Camera) */}
          <div className="relative w-[400px] h-48 bg-gray-300 rounded-2xl overflow-hidden shadow-lg border-2 border-gray-400">
            <video ref={localVideoRef} autoPlay muted className="absolute inset-0 w-full h-full object-cover rounded-2xl" />
            {isScreenSharing && (
              <div className="absolute inset-0 flex justify-center items-center text-white bg-black/50 rounded-2xl">
                <span className="text-lg">Screen Sharing</span>
              </div>
            )}
            <div className="absolute bottom-2 left-2 text-sm bg-black/70 px-3 py-1 text-white rounded-lg">You</div>
          </div>

          {/* Remote Video (Stranger) */}
          <div className="relative w-80 h-48 bg-gray-300 rounded-2xl overflow-hidden shadow-lg border-2 border-gray-400">
            {isConnected && <video ref={remoteVideoRef} autoPlay className="absolute inset-0 w-full h-full object-cover rounded-2xl" />}
            <div className="absolute bottom-2 left-2 text-sm bg-black/70 px-3 py-1 text-white rounded-lg">Stranger</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-left">
          <button className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition transform hover:scale-105" onClick={startVideoCall}>
            Start Video Call
          </button>
          <button className={`px-6 py-3 ${isVideoOn ? "bg-gray-500" : "bg-green-500"} hover:opacity-80 text-white font-semibold rounded-lg transition transform hover:scale-105`} onClick={toggleVideo}>
            {isVideoOn ? "Turn Off Video" : "Turn On Video"}
          </button>
          <button className={`px-6 py-3 ${isScreenSharing ? "bg-red-500" : "bg-yellow-500"} hover:opacity-80 text-white font-semibold rounded-lg transition transform hover:scale-105`} onClick={isScreenSharing ? stopScreenShare : startScreenShare}>
            {isScreenSharing ? "Stop Screen Share" : "Start Screen Share"}
          </button>
          <button className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition transform hover:scale-105" onClick={handleSkip}>
            Skip
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConnectWorldWide;