import { StatusBar } from 'expo-status-bar';
import React ,{useRef} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as tf from "@tensorflow/tfjs"
import * as posenet from "@tensorflow-models/posenet"
import Webcam from "react-webcam"
//utilites
import {drawKeypoints,drawSkeleton} from './utilites'
export default function App() {
  //webcamref
  const webcamRef=useRef(null);
  const canvasRef=useRef(null);
  //load posenet
  const runPosenet=async ()=>{
    const net=await posenet.load({
      inputResolution:{width:640,height:480},
      scale:0.5
    })
    //setinterval
    setInterval(()=>{
      detect(net)
    },100);
  }
  const detect =async(net)=>{
    if(typeof webcamRef.current!=="undefined" && webcamRef.current !==null && webcamRef.current.video.readyState===4){
      //get video properties
      const video=webcamRef.current.video
      const videoWidth=webcamRef.current.video.videoWidth;
      const videoHeight=webcamRef.current.video.videoHeight;
      
      //set video width
      webcamRef.current.video.width=videoWidth
      webcamRef.current.video.height=videoHeight

      //Make detections
      const pose=await net.estimateSinglePose(video);
      // console.log(pose);
      //all manually show point
      drawCanvas(pose,video,videoWidth,videoHeight,canvasRef);

    }
  }
  //run pose
  runPosenet();
  //drwa functions
  const drawCanvas=(pose,video,videoWidth,videoHeight,canvas)=>{
    const ctx=canvas.current.getContext('2d');
    canvas.current.width=videoWidth;
    canvas.current.height=videoHeight;
    drawKeypoints(pose['keypoints'],0.5,ctx);
    drawSkeleton(pose['keypoints'],0.5,ctx);
  }
  return (
    <View style={styles.container}>
     <Webcam 
     ref={webcamRef}
     style={{position:"absolute",marginLeft:"auto",marginRight:"auto",left:0,right:0,textAlign:"center",
    zIndex:9,width:640,height:480}}></Webcam>
     <canvas 
     ref={canvasRef}
       style={{position:"absolute",marginLeft:"auto",marginRight:"auto",left:0,right:0,textAlign:"center",
       zIndex:9,width:640,height:480}}
     ></canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
