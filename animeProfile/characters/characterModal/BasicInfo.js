import React from "react";
import { View, Text, Image, Platform } from "react-native";

const imageNotFoundUrl =
  "https://www.teknozeka.com/wp-content/uploads/2020/03/wp-header-logo-21.png";

const BasicInfo = (props) => {
  const { character } = props;
  const { names, image, otherNames } = character.attributes;

  const imageOutput = image ? image.original : imageNotFoundUrl;

  const namesString =
    names.en && names.ja_jp ? `${names.en} / ${names.ja_jp}` : `${names.en}`;
  const otherNamesString = otherNames ? otherNames.join(", ") : null;

  const Names = (props) => {
    const { content, label } = props;
    if (!content) {
      return null;
    } else {
      return (
        <View style={{ marginBottom: 10 }}>
          <View>
            <Text
              style={{ fontWeight: Platform.OS === "ios" ? "600" : "bold" }}
            >
              {label}
            </Text>
          </View>
          <View style={{}}>
            <Text style={{}}>{content}</Text>
          </View>
        </View>
      );
    }
  };

  return (
    <View style={{ flexDirection: "row" }}>
      <Image
        source={{ uri: imageOutput }}
        style={{ width: 112.5, height: 175 }}
        resizeMode="cover"
      />
      <View style={{ flex: 1, borderWidth: 0, marginLeft: 10 }}>
        <Names label="Name (EN/JP)" content={namesString} />
        <Names label="Other Names" content={otherNamesString} />
      </View>
    </View>
  );
};

export default BasicInfo;
