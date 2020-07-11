import React, { useState, useRef } from "react";
import {
  Animated,
  View,
  Text,
  Picker,
  Button,
  TouchableOpacity,
  Modal,
  Platform,
  Dimensions,
} from "react-native";

import { FontAwesome } from "@expo/vector-icons";

const dimensions = Dimensions.get("window");
const screenWidth = Math.round(dimensions.width);
const screenHeight = Math.round(dimensions.height);

const SortDropDown = (props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [sortValue, setSortValue] = useState(props.selectedValue);

  const slideAnim = useRef(new Animated.Value(0)).current;

  const sortOptions = [
    { label: "Popularity", value: "popularityRank" },
    { label: "Rating", value: "ratingRank" },
    { label: "Date (latest)", value: "-startDate" },
  ];

  const sortOptionsJsx = sortOptions.map((sortOption) => {
    return (
      <Picker.Item
        key={sortOption.value}
        label={sortOption.label}
        value={sortOption.value}
      />
    );
  });

  const onSortSelect = () => {
    Animated.timing(slideAnim, {
      toValue: Math.round(-((screenHeight * 4) / 10)),
      duration: 400,
      useNativeDriver: true,
    }).start();
    setModalVisible(true);
  };

  const endSortSelect = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
    });
  };

  const iosDropDown = (
    <View>
      <Modal transparent={true} visible={modalVisible}>
        <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
          <View
            style={{
              height: screenHeight,
              backgroundColor: "rgba(52, 52, 52, 0.5)",
            }}
          >
            <TouchableOpacity style={{ flex: 1 }} onPress={endSortSelect} />
          </View>
          <View
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
            }}
          >
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Button color="red" title="Cancel" onPress={endSortSelect} />
              <Button
                title="Confirm"
                onPress={() => {
                  if (props.selectedValue !== sortValue) {
                    props.onValueChange(sortValue);
                  }
                  endSortSelect();
                }}
              />
            </View>
            <Picker
              enabled={false}
              selectedValue={sortValue}
              onValueChange={(value, index) => {
                setSortValue(value);
              }}
              style={{ height: 30 }}
              itemStyle={{ backgroundColor: "rgba(255, 255, 255, 0.95)" }}
            >
              {sortOptionsJsx}
            </Picker>
          </View>
        </Animated.View>
      </Modal>
      <TouchableOpacity
        disabled={!props.enabled}
        onPress={onSortSelect}
        style={{
          backgroundColor: "#dddddd",
          height: 50,
          justifyContent: "center",
          paddingHorizontal: 10,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{ justifyContent: "center", paddingLeft: 5 }}>
            <FontAwesome name="sort" size={24} color="#333333" />
          </View>
          {props.sorted ? (
            <Text>
              {"  " +
                sortOptions.filter((x) => x.value === props.selectedValue)[0]
                  .label}
            </Text>
          ) : (
            <Text>{"  Relevance"}</Text>
          )}
        </View>

        {!props.enabled && (
          <Text style={{}}>{" (Can't sort after search/tag filter)"}</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  const androidDropDown = (
    <View>
      <View style={{ flexDirection: "row" }}>
        <View style={{ justifyContent: "center", paddingLeft: 10 }}>
          <FontAwesome name="sort" size={24} color="#333333" />
        </View>
        {props.sorted ? (
          <View style={{ flex: 1 }}>
            <Picker
              enabled={props.enabled}
              selectedValue={props.selectedValue}
              onValueChange={props.onValueChange}
              style={{ backgroundColor: "#dddddd" }}
            >
              {sortOptionsJsx}
            </Picker>
          </View>
        ) : (
          <Text
            style={{
              padding: 10,
              backgroundColor: "#dddddd",
            }}
          >
            {"Relevance"}
          </Text>
        )}
      </View>
      {!props.enabled && (
        <Text style={{ paddingLeft: 10, backgroundColor: "#dddddd" }}>
          {"(Can't sort after search/tag filter)"}
        </Text>
      )}
    </View>
  );

  const sortDropDown = Platform.OS === "ios" ? iosDropDown : androidDropDown;

  return <View style={{ flex: 1 }}>{sortDropDown}</View>;
};

export default SortDropDown;
