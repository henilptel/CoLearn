import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  MeetingProvider, 
  useMeeting, 
  useParticipant,
  Constants
} from '@videosdk.live/react-sdk';
import { startRecording, stopRecording } from '../apis/meeting';

interface MeetingProps {
  roomId: string;
  token: string;
  participantName: string;
  onMeetingEnd: () => void;
}

const Participant: React.FC<{ participantId: string }> = ({ participantId }) => {
  const micRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { webcamStream, micStream, webcamOn, micOn, isLocal, displayName } = useParticipant(participantId);

  useEffect(() => {
    if (micRef.current && micOn && micStream) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(micStream.track);
      micRef.current.srcObject = mediaStream;
      micRef.current.play().catch(console.error);
    }
  }, [micStream, micOn]);

  useEffect(() => {
    if (videoRef.current && webcamOn && webcamStream) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(webcamStream.track);
      videoRef.current.srcObject = mediaStream;
    }
  }, [webcamStream, webcamOn]);

  return (
    <div className="participant-video">
      <audio ref={micRef} autoPlay playsInline muted={isLocal} />
      <video 
        ref={videoRef}
        autoPlay 
        playsInline 
        muted={isLocal}
        style={{ 
          width: '100%', 
          height: '100%', 
          objectFit: 'cover',
          borderRadius: '8px',
          display: webcamOn ? 'block' : 'none'
        }}
      />
      {!webcamOn && (
        <div className="no-video-placeholder">
          <div className="participant-avatar">
            {displayName?.charAt(0)?.toUpperCase() || 'U'}
          </div>
        </div>
      )}
      <div className="participant-name">
        {displayName || 'Unknown User'}
      </div>
    </div>
  );
};

const MeetingRoom: React.FC<MeetingProps> = ({ roomId, token, participantName, onMeetingEnd }) => {
  const [hasJoined, setHasJoined] = useState(false);
  const [joinAttempted, setJoinAttempted] = useState(false);
  
  const { participants, localParticipant, toggleMic, toggleWebcam, localMicOn, localWebcamOn, leave, join } = useMeeting({
    onMeetingJoined: () => {
      console.log('Meeting joined successfully');
      setHasJoined(true);
    },
    onMeetingLeft: () => {
      console.log('Meeting left');
      onMeetingEnd();
    },
    onError: (error) => {
      console.error('Meeting error:', error);
      // If join fails, try again after a short delay
      if (!joinAttempted) {
        setTimeout(() => {
          console.log('Retrying join...');
          join();
        }, 2000);
      }
    },
    onParticipantJoined: (participant) => {
      console.log('Participant joined:', participant);
    },
    onParticipantLeft: (participant) => {
      console.log('Participant left:', participant);
    }
  });

  // Auto-join the meeting when component mounts
  useEffect(() => {
    if (!joinAttempted && join) {
      console.log('Attempting to join meeting...');
      setJoinAttempted(true);
      join();
    }
  }, [join, joinAttempted]);

  const handleEndCall = () => {
    console.log('Ending call...');
    stopRecording(token, roomId).catch(console.error);
    leave();
  };

  // Show loading state while joining
  if (!hasJoined) {
    return (
      <div className="meeting-loading">
        <h3>Joining meeting...</h3>
        <p>Please wait while we connect you to the session.</p>
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
        <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#999' }}>
          Room ID: {roomId}
        </div>
      </div>
    );
  }

  return (
    <div className="meeting-room">
      <div className="meeting-header">
        <h2>Skill Swap Session</h2>
        <span className="meeting-id">Room ID: {roomId}</span>
      </div>
      
      <div className="participants-grid">
        {[...participants.keys()].map((participantId) => (
          <Participant key={participantId} participantId={participantId} />
        ))}
      </div>
      
      <div className="meeting-controls">
        <button 
          onClick={toggleMic}
          className={`control-btn ${localMicOn ? 'active' : 'inactive'}`}
        >
          {localMicOn ? '🎤' : '🔇'} {localMicOn ? 'Mute' : 'Unmute'}
        </button>
        
        <button 
          onClick={toggleWebcam}
          className={`control-btn ${localWebcamOn ? 'active' : 'inactive'}`}
        >
          {localWebcamOn ? '📹' : '📷'} {localWebcamOn ? 'Turn Off Camera' : 'Turn On Camera'}
        </button>
        
        <button 
          onClick={handleEndCall}
          className="control-btn end-call"
        >
          📞 End Call
        </button>
      </div>
    </div>
  );
};

const Meeting: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { roomId, token, participantName, requestId } = location.state || {};
  
  const [micEnabled, setMicEnabled] = useState(true);
  const [webcamEnabled, setWebcamEnabled] = useState(true);

  useEffect(() => {
    if (!roomId || !token) {
      console.error('Missing meeting parameters:', { roomId, token });
      navigate('/requests');
      return;
    }
    
    console.log('Starting meeting with:', { roomId, token, participantName });
    
    // Start recording when meeting begins
    startRecording(token, roomId).catch(console.error);
  }, [roomId, token, navigate, participantName]);

  const handleMeetingEnd = () => {
    console.log('Meeting ended, navigating back to requests');
    navigate('/requests');
  };

  if (!roomId || !token) {
    return (
      <div className="meeting-loading">
        <h3>Invalid meeting parameters</h3>
        <p>Redirecting to requests...</p>
      </div>
    );
  }

  return (
    <MeetingProvider
      config={{
        meetingId: roomId,
        micEnabled,
        webcamEnabled,
        name: participantName || 'Unknown User',
        mode: Constants.modes.CONFERENCE,
      }}
      token={token}
      joinWithoutUserInteraction={true}
    >
      <MeetingRoom 
        roomId={roomId}
        token={token}
        participantName={participantName}
        onMeetingEnd={handleMeetingEnd}
      />
    </MeetingProvider>
  );
};

export default Meeting;