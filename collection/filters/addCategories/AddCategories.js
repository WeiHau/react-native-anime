import React, { useState } from "react";
import { TouchableOpacity } from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import AddCategoriesModal from "./AddCategoriesModal";

const AddCategories = (props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { selectedCategories, setSelectedCategories } = props;

  return (
    <TouchableOpacity
      style={{
        width: "15%",
        backgroundColor: "#bbbbbb",
        alignItems: "center",
        justifyContent: "center",
        borderTopLeftRadius: 40,
        borderBottomLeftRadius: 40,
      }}
      onPress={() => {
        setModalVisible(true);
      }}
    >
      <MaterialCommunityIcons name="tag-plus" size={40} color="#333333" />
      <AddCategoriesModal
        modalVisible={modalVisible}
        hideModal={() => {
          setModalVisible(false);
        }}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
      />
    </TouchableOpacity>
  );
};

export default AddCategories;
