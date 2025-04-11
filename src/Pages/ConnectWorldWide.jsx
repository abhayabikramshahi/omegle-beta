import React, { useState, useRef, useEffect } from "react";

const ConnectWorldWide = () => {
  const [peerConnection, setPeerConnection] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    const getUserMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing media devices:", err);
      }
    };
    getUserMedia();
  }, []);

  const startVideoCall = async () => {
    try {
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream);
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
      console.error("Error setting up WebRTC connection:", err);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getTracks().find((track) => track.kind === "video");
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOn(videoTrack.enabled);
      }
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
    <div className="flex h-screen justify-center items-center bg-white text-black font-sans">
      <div className="flex flex-col w-full max-w-5xl p-10 gap-8 bg-gray-100 rounded-2xl shadow-xl">
        <div className="grid grid-cols-2 gap-8">
          <div className="relative aspect-video bg-gray-300 rounded-2xl overflow-hidden shadow-lg border-2 border-gray-400">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              className="absolute inset-0 w-full h-full object-cover rounded-2xl"
            />
            <div className="absolute bottom-2 left-2 text-sm bg-black/70 px-3 py-1 text-white rounded-lg">You</div>
          </div>
          <div className="relative aspect-video bg-gray-300 rounded-2xl overflow-hidden shadow-lg border-2 border-gray-400">
            {isConnected && (
              <video
                ref={remoteVideoRef}
                autoPlay
                className="absolute inset-0 w-full h-full object-cover rounded-2xl"
              />
            )}
            <div className="absolute bottom-2 left-2 text-sm bg-black/70 px-3 py-1 text-white rounded-lg">Stranger</div>
          </div>
        </div>
        <div className="flex flex-col items-start gap-4">
          <button
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition transform hover:scale-105"
            onClick={startVideoCall}
          >
            Start Video Call
          </button>
          <button
            className={`px-6 py-3 ${isVideoOn ? "bg-gray-500" : "bg-green-500"} hover:opacity-80 text-white font-semibold rounded-lg transition transform hover:scale-105`}
            onClick={toggleVideo}
          >
            {isVideoOn ? "Turn Off Video" : "Turn On Video"}
          </button>
          <button
            className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition transform hover:scale-105"
            onClick={handleSkip}
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConnectWorldWide;