export const createTrack = async (constraints: MediaStreamConstraints)=>{
    const _stream = await navigator.mediaDevices.getUserMedia(constraints);
    return _stream.getTracks()[0];
}