import { skeletonStyles as styles } from "./skeleton.styles"
const jointJSON = require("../../models/skeleton/joint_definitions.json")
//import Canvas from 'react-native-canvas';
import React from "react"
import { Dimensions } from "react-native"
import Svg, { Line, Circle } from "react-native-svg"

export interface SkeletonProps {
  id: string
  data: any
  style?: any
  strokeColor?: string
  showJoints?: boolean
}

/**
 * React.FunctionComponent for your hook(s) needs
 *
 * Component description here for TypeScript tips.
 */
export const Skeleton: React.FunctionComponent<SkeletonProps> = props => {
  const height = props.style.height ? props.style.height : Dimensions.get("window").width * (9 / 16)
  const width = props.style.width ? props.style.width : Dimensions.get("window").width

  var getSVG = () => {
    if (props.data) {
      let lines: any = []
      jointJSON.bonePairs.forEach((element, index) => {
        var first = element[0]
        var second = element[1]
        lines.push(
          <Line
            stroke={props.strokeColor}
            key={"line" + index}
            strokeWidth="2"
            x1={props.data[first + "_X"] * width}
            y1={props.data[first + "_Y"] * height}
            x2={props.data[second + "_X"] * width}
            y2={props.data[second + "_Y"] * height}
          ></Line>,
        )
        if(props.showJoints==true)
        lines.push( <Circle  key={"circle" + index} cx={props.data[second + "_X"] * width} cy={props.data[second + "_Y"] * height} r="3" stroke={props.strokeColor} strokeWidth="1" fill={props.strokeColor} />)
      })

      return lines
    }
  }

  return (
    <Svg style={props.style}>{getSVG()}</Svg>
  )
}
