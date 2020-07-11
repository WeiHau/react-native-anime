import React from "react";
import { Text, TouchableOpacity, Dimensions } from "react-native";

const dimensions = Dimensions.get("window");
const screenWidth = Math.round(dimensions.width);
const screenHeight = Math.round(dimensions.height);

const CategoryCheckBox = React.memo(
  (props) => {
    const { category, selected } = props;

    const onPress = () => {
      if (props.selected) {
        props.removeCategory(category);
      } else {
        props.addCategory(category);
      }
    };

    return (
      <TouchableOpacity
        style={{
          alignItems: "center",
          backgroundColor: selected ? "orange" : "#aaaaaa",
          width: "45%",
          marginHorizontal: "2.5%",
          marginVertical: 2,
          borderRadius: 12,
          padding: 3,
        }}
        onPress={onPress}
      >
        <Text numberOfLines={1}>{category.title}</Text>
      </TouchableOpacity>
    );
  },
  (prevProps, nexProps) => {
    prevProps.selected === nexProps.selected;
  }
);

export default CategoryCheckBox;
