import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Animated,
  ImageBackground,
  TouchableWithoutFeedback,
} from "react-native";

const CardModal = (props) => {
  const {
    canonicalTitle,
    averageRating,
    popularityRank,
    ratingRank,
    startDate,
  } = props.anime.attributes;
  const year = startDate.substring(0, 4);

  const slideAnim = useRef(new Animated.Value(200)).current;

  useEffect(() => {
    //Animated.timing(slideAnim, { toValue: 300, duration: 2000 }).start();
    Animated.spring(slideAnim, {
      toValue: -25,
      friction: 7,
      tension: 60,
      useNativeDriver: true,
      //bounciness: 8,
      //speed:16
      // damping: 10,
      // stiffness: 80,
      // mass: 1,
    }).start();
  }, []);

  return (
    <Animated.View
      style={[styles.cardModal, { transform: [{ translateY: slideAnim }] }]}
    >
      <View
        style={{
          borderBottomWidth: 1,
          marginHorizontal: "5%",
          marginBottom: 5,
          paddingVertical: 8,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            textAlign: "center",
            fontWeight: "600",
            color: "black",
          }}
        >
          {canonicalTitle}
        </Text>
        <Text
          style={{ textAlign: "center", color: "#333333", fontWeight: "100" }}
        >
          {year}
        </Text>
      </View>
      <View style={{ marginHorizontal: "5%" }}>
        {averageRating !== null && (
          <Text
            style={{
              color: "#069075",
              fontSize: 16,
              alignSelf: "flex-end",
              marginBottom: 5,
            }}
          >
            {averageRating + "%"}
          </Text>
        )}
        {popularityRank !== null && (
          <Text>{"#" + popularityRank + " Most Popular"}</Text>
        )}
        {ratingRank !== null && (
          <Text>{"#" + ratingRank + " Highest Rated"}</Text>
        )}
      </View>
    </Animated.View>
  );
};

//{/* title, Year, averageRating, popularityRank, ratingRank */}

const Card = (props) => {
  const { attributes } = props.anime;
  const [modalVisible, setModalVisible] = useState(false);

  let imgUrl = attributes.posterImage
    ? attributes.posterImage.medium
    : "https://media.kitsu.io/anime/poster_images/10577/medium.jpg?1460247156";

  let card = modalVisible ? (
    <CardModal modalVisible={modalVisible} anime={props.anime} />
  ) : (
    <View style={styles.animeTitle}>
      <Text
        numberOfLines={1}
        style={{
          textAlign: "center",
          fontWeight: "600",
          color: "#333333",
          backgroundColor: "rgba(255,255,255,0.8)",
        }}
      >
        {attributes.canonicalTitle}
      </Text>
    </View>
  );

  return (
    <View style={styles.card}>
      <TouchableWithoutFeedback
        style={{ width: "100%" }}
        onLongPress={() => {
          setModalVisible(true);
        }}
        onPressOut={() => {
          setModalVisible(false);
        }}
        onPress={() => {
          props.selectAnime(props.anime);
        }}
      >
        <View
          style={{
            flex: 1,
            alignItems: "center",
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <ImageBackground
            source={{ uri: imgUrl }}
            style={styles.cardImage}
            resizeMode={"contain"}
          >
            {card}
          </ImageBackground>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const Board = (props) => {
  const { animeList, animeCount } = props;
  const numColumns = 2;

  let board;
  if (animeCount < 1) {
    const msg = animeCount === -1 ? "Loading..." : "No result found";
    board = (
      <View
        style={{
          height: 300,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>{msg}</Text>
      </View>
    );
  } else {
    board = (
      <View>
        <FlatList
          style={styles.boardFlatList}
          contentContainerStyle={styles.boardContentFlatList}
          data={props.animeList}
          renderItem={({ item }) => {
            return (
              <Card
                anime={item}
                key={item.id}
                selectAnime={props.selectAnime}
              />
            );
          }}
          keyExtractor={(anime) => anime.id}
          numColumns={numColumns}
          onEndReached={() => {
            props.reachBottom();
          }}
          onEndReachedThreshold={0.2}
          ListFooterComponent={() => {
            const msg =
              animeList.length !== animeCount ? "Loading..." : "End of results";
            return (
              <Text
                style={{
                  alignSelf: "center",
                  margin: 15,
                  color: "#cccccc",
                  fontSize: 16,
                }}
              >
                {msg}
              </Text>
            );
          }}
        />
      </View>
    );
  }

  return <View>{board}</View>;
};

export default Board;

///Using SCROLLVIEW
// const isCloseToBottom = ({
//   layoutMeasurement,
//   contentOffset,
//   contentSize,
// }) => {
//   const paddingToBottom = 30;
//   return (
//     layoutMeasurement.height + contentOffset.y >=
//     contentSize.height - paddingToBottom
//   );
// };

// const animes = animeList.map((anime) => {
//   return <Card anime={anime} key={anime.id} />;
// });
// return (
//   // <ScrollView
//   //   onScroll={({ nativeEvent }) => {
//   //     if (isCloseToBottom(nativeEvent)) {
//   //       props.reachBottom();
//   //     }
//   //   }}
//   //   scrollEventThrottle={0}
//   // >
//   //   <View style={styles.board}>{animes}</View>
//   // </ScrollView>
// );

import { StyleSheet, Dimensions } from "react-native";

const screenWidth = Math.round(Dimensions.get("window").width);
const dimensions = Dimensions.get("window");
//"width":390,"height":554
const imageWidth = (dimensions.width * 45) / 100;
const ratio = imageWidth / 390;
const imageHeight = 554 * ratio;

const styles = StyleSheet.create({
  board: {
    justifyContent: "center",
    flexDirection: "row",
    width: "100%",
    flexWrap: "wrap",
    marginTop: 10,
    paddingBottom: 150,
  },
  card: {
    alignItems: "center",
    width: "50%",
    marginBottom: 10,
  },
  cardImage: {
    width: imageWidth,
    height: imageHeight,
  },
  boardContentFlatList: {
    paddingBottom: 300,
  },
  boardFlatList: {
    paddingTop: 15,
  },
  animeTitle: {
    width: imageWidth,
    flex: 1,
    justifyContent: "flex-end",
  },
  cardModal: {
    //flex: 1,
    //alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.8)",
    height: imageHeight + 50,
  },
});
