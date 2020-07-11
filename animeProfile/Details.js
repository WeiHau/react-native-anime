import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

const Detail = (props) => {
  const { content, label } = props;
  if (!content) {
    return null;
  } else {
    return (
      <View
        style={{
          flexDirection: "row",
          marginBottom: 15,
        }}
      >
        <View style={{ width: "30%", alignSelf: "flex-start" }}>
          <Text style={{ fontWeight: Platform.OS === "ios" ? "600" : "bold" }}>
            {label}
          </Text>
        </View>
        <View style={{ width: "70%", alignSelf: "center" }}>
          <Text style={{}}>{content}</Text>
        </View>
      </View>
    );
  }
};

const Details = (props) => {
  const [displayAll, setDisplayAll] = useState(false);

  const {
    titles,
    status,
    abbreviatedTitles,
    showType,
    episodeCount,
    startDate,
    endDate,
    ageRating,
    ageRatingGuide,
    episodeLength,
  } = props.anime.attributes;
  const { en_jp, en_us, ja_jp } = titles;

  //for synonyms
  const synonyms = abbreviatedTitles ? abbreviatedTitles.join(", ") : null;

  //for aired
  const aired = startDate && endDate ? `${startDate} to ${endDate}` : "";

  //for rating
  let rating =
    ageRating && ageRatingGuide
      ? `${ageRating} - ${ageRatingGuide}`
      : `${ageRating}${ageRatingGuide}`;
  rating = rating !== "null" ? rating : "";

  //For total length
  let length = null,
    totalTime = episodeLength * episodeCount;
  if (totalTime !== 0) {
    let day = Math.floor(totalTime / 1440),
      hour = Math.floor((totalTime % 1440) / 60),
      minute = totalTime % 60;

    const dayString = day > 0 ? day + " day " : "";
    const hourString = hour > 0 ? hour + " hour " : "";
    const minuteString = minute > 0 ? minute + " minutes" : "";
    const lengthEach =
      episodeCount > 1 ? ` (${episodeLength} minutes each)` : "";
    length = `${dayString}${hourString}${minuteString}${lengthEach}`;
  }

  return (
    <View>
      <Text
        style={{
          fontSize: 16,
          fontWeight: "bold",
          marginTop: 5,
          marginBottom: 10,
        }}
      >
        Anime Details
      </Text>
      <Detail content={en_us} label={"English (American) "} />
      <Detail content={ja_jp} label={"Japanese "} />
      <Detail content={en_jp} label={"Japanese (Romaji) "} />
      <Detail content={synonyms} label={"Synonyms "} />
      <Detail content={showType} label={"Type "} />
      <Detail content={episodeCount} label={"Episodes "} />
      <Detail content={status} label={"Status "} />
      {displayAll && (
        <>
          <Detail content={aired} label={"Aired "} />
          <Detail content={rating} label={"Rating "} />
          <Detail content={length} label={"Total Length"} />
        </>
      )}
      <TouchableOpacity
        onPress={() => {
          setDisplayAll((displayAll) => {
            return !displayAll;
          });
        }}
      >
        <Text style={{ color: "grey", padding: 5 }}>
          {!displayAll ? "...more info" : "...less info"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Details;
