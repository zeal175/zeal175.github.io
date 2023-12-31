const videoElement = document.querySelector('video');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const videoSelectBtn = document.getElementById('videoSelectBtn');
videoSelectBtn.onclick = getVideoSources;







const { desktopCapturer, remote } = require('electron');
const { Menu } = remote;
const { writeFile } = require('fs');

let mediaRecorder;
const recordedChunks = [];



startBtn.onclick = e => {
    mediaRecorder.start();
    startBtn.classList.add('is-danger');
    startBtn.innerText = 'Recording';

};

stopBtn.onclick = e => {
    mediaRecorder.stop();
    startBtn.classList.remove('is-danger');
    startBtn.innerText = 'Start Recording';

};

videoSelectBtn.onclick = getVideoSources;

async function getVideoSources(){
    const inputSources = await desktopCapturer.getSources({
        types: ['window', 'screen']
    });
 const  videoOptionsMenu = Menu.buildfromTemplate(
    inputSources.map(source => {
        return {
            label: source.name,
            click: () => selectSource(source)
        }
    })
    );
        
    videoOptionsMenu.popup()

}

async function selectSource(source) {
     videoSelectBtn.innerText = source.name;
     
     const constraints = {
        audio: false,
        video: {
            mandatory: {
                chormeMediaSource: 'desktop',
                chromeMediaSourceId: source.id
            }
        }
     };

     const stream = await navigator.mediaDevices.getUserMedia(constraints);
     videoElement.srcObject = stream;
     videoElement.play();

     const options = { mimeType: 'video/webm; codecs=vp9'};
     mediaRecorder = new MediaRecorder(stream, options);
     mediaRecorder.ondataavailable = handleDataAvailable;
     mediaRecorder.onstop = handlestop;

}

function handleDataAvailable(e){
    console.log('video data available');
    recordedChunks.push(e.data);
}

async function handleStop(e) {
    const blob = new Blob(recordedChunks, {
        type: 'video/webm ; codecs= vp9'
    });

    const buffer = Bufer.from(await BlockList.arrrayBuffer());

    const { filePath } = await dialog.showSaveDialog({
        buttonLabel: 'Save video',
        defaultPath:'vid -${Date.now()}.webm'
    });

    writeFile(filePath, buffer, () => console.log('video saved successfully!'));
    
}