import React, { useState } from "react";
import { View, Image, Text, Dimensions, TouchableOpacity } from "react-native";

const dimensions = Dimensions.get("window");
const screenWidth = Math.round(dimensions.width);

const Poster = (props) => {
  let imgUrl = props.source
    ? props.source.medium
    : "https://media.kitsu.io/anime/poster_images/10577/medium.jpg?1460247156";

  const posterWidth = (dimensions.width * 28) / 100; //28%
  const ratio = posterWidth / 390;
  const posterHeight = 554 * ratio;

  return (
    <View
      style={{
        width: posterWidth,
        height: posterHeight,
        borderRadius: 8,
        overflow: "hidden",
      }}
    >
      <Image
        source={{ uri: imgUrl }}
        style={{ flex: 1, height: undefined, width: undefined }}
        resizeMode={"contain"}
      />
    </View>
  );
};

const RnR = (props) => {
  const {
    canonicalTitle,
    averageRating,
    popularityRank,
    ratingRank,
    startDate,
  } = props.anime.attributes;

  const year = startDate ? ` | ${startDate.substring(0, 4)}` : "";

  return (
    <View
      style={{
        padding: "5%",
      }}
    >
      <View
        style={{
          width: (screenWidth * 50) / 100,
          paddingBottom: 5,
        }}
      >
        <Text>
          <Text
            style={{
              fontWeight: Platform.OS === "ios" ? "600" : "bold",
              fontSize: 16,
            }}
          >
            {canonicalTitle}
          </Text>
          <Text style={{ fontWeight: "100", fontSize: 16 }}>{year}</Text>
        </Text>
      </View>
      {averageRating !== null && (
        <Text
          style={{
            color: "#069075",
            fontSize: 14,
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
  );
};

const Synopsis = (props) => {
  if (!props.synopsis) {
    return null;
  }

  const [readStatus, setReadStatus] = useState(0); //-1 being readless enabled, 1 being readmore enabled, 0 being none
  const maxLine = 3;

  return (
    <View>
      <TouchableOpacity
        disabled={readStatus === 0}
        onPress={() => {
          setReadStatus((readStatus) => {
            return readStatus === 1 ? -1 : 1;
          });
        }}
      >
        <Text
          numberOfLines={readStatus === 1 ? maxLine : undefined}
          onTextLayout={(e) => {
            //if number of lines now exceeds maxline, and readmore isnt enabled
            //set numoflines to maxline in text, and enable readmore (initial)
            //if readmore is clicked, change numoflines to undefined
            //if number of lines now exceeds maxline, and readmore is enabled,
            //enable readless
            //if readless is clicked, changed numoflines to maxline

            if (e.nativeEvent.lines.length > maxLine && readStatus === 0) {
              setReadStatus(1);
            }
          }}
        >
          {props.synopsis}
        </Text>
        {readStatus !== 0 && (
          <Text style={{ color: "grey", padding: 5 }}>
            {readStatus === 1 ? "...read more" : "...read less"}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const About = (props) => {
  const { posterImage, synopsis } = props.anime.attributes;

  return (
    <View>
      <View style={{ flexDirection: "row", marginBottom: 10 }}>
        <Poster source={posterImage} />
        <RnR anime={props.anime} />
      </View>
      <View>
        <Synopsis synopsis={synopsis} />
      </View>
    </View>
  );
};

export default About;
