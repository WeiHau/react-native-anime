import React from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";

const dimensions = Dimensions.get("window");
const screenWidth = Math.round(dimensions.width);
const screenHeight = Math.round(dimensions.height);

const SelectedCategories = (props) => {
  if (!props.selectedCategories || props.selectedCategories.length < 1) {
    return null;
  }

  const { selectedCategories, setSelectedCategories } = props;

  let returnVal = selectedCategories.map((category) => {
    return (
      <Text
        onPress={() => {
          setSelectedCategories(
            selectedCategories.filter(
              (selectedCategory) => selectedCategory.id !== category.id
            )
          );
        }}
        key={category.id}
        style={{
          margin: 1,
          marginHorizontal: 2,
          paddingHorizontal: 3,
          paddingVertical: 2,
          borderRadius: 4,
          backgroundColor: "#dddddd",
        }}
      >
        {category.title}
      </Text>
    );
  });

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: "#eeeeee",
      }}
    >
      <View>
        <Text>{`Tags: `}</Text>
      </View>
      <View
        style={{
          flexDirection: "row",
        }}
      >
        <>{returnVal}</>
      </View>
    </View>
  );
};

export default SelectedCategories;
