import React, { useState } from "react";
import { Text } from "react-native";

const SpoilerContent = (props) => {
  const { content, id } = props;
  const [revealed, setRevealed] = useState(false);

  const outputText = revealed ? content : "!!SPOILER!!";

  return (
    <Text
      onPress={() => {
        setRevealed((revealed) => !revealed);
      }}
      style={{
        color: revealed ? undefined : "red",
        zIndex: 10,
        backgroundColor: "#EEEEEE",
      }}
      key={id}
    >
      {outputText}
    </Text>
  );
};

export default SpoilerContent;
