const overlayJSON = require('./overlaydata.json')
//const jointJSON = require("./joint_definitions.json")
var frames = overlayJSON.frames
const jointList = overlayJSON.joint_list//jointJSON.joints
export var payload = {}
export var framedata =[]
var jointListCoordinates = []

jointList.map((obj)=>{
    jointListCoordinates.push(obj+"_X");
    jointListCoordinates.push(obj+"_Y");
})


frames.forEach((element) => {
    var payload = {};
    element.joints.forEach((obj,index) => {
        const key = jointListCoordinates[index];
        payload[key] = obj;
    })
    framedata.push(payload)
});
// frames.joints.forEach((obj,index) => {
//     const key = jointListCoordinates[index];
//     payload[key] = obj;
// });

//export const framedata = payload
