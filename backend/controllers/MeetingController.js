// backend/controllers/meetingController.js
const jwt = require("jsonwebtoken");
// Remove node-fetch import - use built-in fetch in Node.js 18+

exports.getToken = (req, res) => {
  console.log('Getting token for request:', req.body);
  console.log('VIDEOSDK_API_KEY:', process.env.VIDEOSDK_API_KEY);
  console.log('VIDEOSDK_API_SECRET exists:', !!process.env.VIDEOSDK_API_SECRET);
  
  const { roomId } = req.body;

  const payload = {
    apikey: process.env.VIDEOSDK_API_KEY,
    permissions: ["allow_join", "allow_mod"],
  };

  if (roomId) {
    payload.roomId = roomId;
  }

  if (!process.env.VIDEOSDK_API_SECRET) {
    console.error('VIDEOSDK_API_SECRET is not set');
    return res.status(500).json({ error: 'VideoSDK configuration missing' });
  }

  const token = jwt.sign(payload, process.env.VIDEOSDK_API_SECRET, {
    expiresIn: "120m",
    algorithm: "HS256",
  });

  console.log('Token generated successfully');
  res.json({ token });
};

exports.createRoom = (req, res) => {
  console.log('Creating room with request:', req.body);
  
  const { token } = req.body;

  const url = `${process.env.VIDEOSDK_API_ENDPOINT}/rooms`;

  const options = {
    method: "POST",
    headers: { Authorization: token },
  };

  fetch(url, options)
    .then((response) => response.json())
    .then((result) => {
      console.log('Room created successfully:', result);
      const { roomId } = result;
      res.json({ roomId });
    })
    .catch((error) => {
      console.error("Error creating room:", error);
      res.status(500).json({ error: "Failed to create room" });
    });
};

exports.startRecording = (req, res) => {
  const { token, roomId } = req.body;

  const url = `${process.env.VIDEOSDK_API_ENDPOINT}/recordings/start`;

  const options = {
    method: "POST",
    headers: { Authorization: token, "Content-Type": "application/json" },
    body: JSON.stringify({
      roomId,
    }),
  };

  fetch(url, options)
    .then((response) => response.json())
    .then((result) => {
      console.log('Recording started:', result);
      res.sendStatus(200);
    })
    .catch((err) => {
      console.error('Error starting recording:', err);
      res.sendStatus(500);
    });
};

exports.stopRecording = (req, res) => {
  const { token, roomId } = req.body;

  const url = `${process.env.VIDEOSDK_API_ENDPOINT}/recordings/stop`;

  const options = {
    method: "POST",
    headers: { Authorization: token, "Content-Type": "application/json" },
    body: JSON.stringify({
      roomId,
    }),
  };

  fetch(url, options)
    .then(() => {
      console.log('Recording stopped successfully');
      res.sendStatus(200);
    })
    .catch((err) => {
      console.error('Error stopping recording:', err);
      res.sendStatus(500);
    });
};