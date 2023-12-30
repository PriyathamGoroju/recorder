import React, { useState } from "react";

const AudioRecorder = () => {
    const [recording, setRecording] = useState(false);
    const [audioURL, setAudioURL] = useState(null);
    const [mediaRecorder, setMediaRecorder] = useState(null);

    const startRecording = () => {
        navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then((stream) => {
                const recorder = new MediaRecorder(stream);
                const chunks = [];

                recorder.ondataavailable = (e) => {
                    if (e.data.size > 0) {
                        chunks.push(e.data);
                    }
                };

                recorder.onstop = () => {
                    const blob = new Blob(chunks, { type: "audio/wav" });
                    const url = URL.createObjectURL(blob);
                    console.log('url', url)
                    setAudioURL(url);
                };

                recorder.start();
                setRecording(true);
                setMediaRecorder(recorder);
            })
            .catch((err) => {
                console.error("Error accessing microphone:", err);
            });
    };

    const stopRecording = () => {
        if (mediaRecorder && recording) {
            mediaRecorder.stop();
            setRecording(false);
        }
    };

    return (
        <>
            <div className="buttonGroup">
                <button onClick={startRecording} disabled={recording} title="click to start recording">
                    Start
                </button>
                <button onClick={stopRecording} disabled={!recording} title="click to stop recording">
                    Stop
                </button>
            </div>
            {audioURL && <audio controls src={audioURL} />}
        </>
    );
};

export default AudioRecorder;
