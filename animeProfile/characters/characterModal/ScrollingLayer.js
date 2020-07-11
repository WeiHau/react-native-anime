import React, { useRef, useState, useEffect } from "react";
import { TouchableOpacity, Platform, Dimensions } from "react-native";

const dimensions = Dimensions.get("window");
const screenHeight = Math.round(dimensions.height);

const ScrollingLayer = (props) => {
  const { scrollView, positionY, hide } = props;

  const scrollSpeed = Platform.OS === "ios" ? 250 : 20;
  const value = props.direction === "up" ? -scrollSpeed : scrollSpeed;
  const verticalPosition =
    props.direction === "up" ? { top: 0 } : { bottom: 0 };

  const scrollInterval = useRef();
  const startScroll = (value) => {
    scrollInterval.current = setInterval(() => {
      if (!hide) {
        scrollView.current.scrollTo({
          y: positionY.current + value,
          animated: Platform.OS === "ios",
        });
      } else {
        clearInterval(scrollInterval.current);
      }
    }, 10);
  };
  const stopScroll = () => {
    clearInterval(scrollInterval.current);
  };

  return (
    <TouchableOpacity
      onPressIn={() => {
        startScroll(value);
      }}
      onPressOut={() => {
        stopScroll();
      }}
      style={[
        {
          zIndex: hide ? 0 : 10,
          //borderWidth: 1,
          height: Math.round((screenHeight * 10) / 100),
          position: "absolute",
          left: 0,
          right: 0,
        },
        verticalPosition,
      ]}
    />
  );
};

export default ScrollingLayer;
