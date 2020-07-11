import React, { useRef } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";

import { Feather } from "@expo/vector-icons";

const SearchBar = (props) => {
  const textInputRef = useRef();

  return (
    <View style={styles.searchBar}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search..."
        onEndEditing={(e) => {
          props.search(e.nativeEvent.text);
        }}
        ref={textInputRef}
      />
      <TouchableOpacity
        onPress={() => {
          textInputRef.current.clear();
          if (!textInputRef.current.isFocused()) {
            props.search("");
          }
        }}
      >
        <Feather name="delete" size={24} color="grey" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  searchBar: {
    height: 30,
    paddingHorizontal: 10,
    marginTop: 10,
    borderBottomWidth: 1,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  searchInput: {
    flex: 1,
    fontSize: 20,
  },
});
