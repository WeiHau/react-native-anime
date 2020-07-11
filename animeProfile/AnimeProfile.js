import React, { useRef, useEffect } from "react";
import {
  Dimensions,
  View,
  Text,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  Animated,
  BackHandler,
} from "react-native";

import Categories from "./Categories";
import Details from "./Details";
import About from "./About";
import Characters from "./characters/Characters";

const dimensions = Dimensions.get("window");
const screenWidth = Math.round(dimensions.width);
const screenHeight = Math.round(dimensions.height);

const InfoCard = (props) => {
  return (
    <View
      style={[
        {
          zIndex: 10,
          position: "relative",
          bottom: 20,
          borderWidth: 8,
          borderColor: "white",
          borderRadius: 8,
          backgroundColor: "white",
          shadowOffset: { width: 0, height: 0 },
          shadowColor: "black",
          shadowOpacity: 0.2,
          elevation: 5,
          marginBottom: 10,
        },
        { ...props.style },
      ]}
    >
      {props.children}
    </View>
  );
};

const ScrollContent = (props) => {
  return (
    <View style={{}}>
      <ScrollView bounces={false}>
        <View
          style={{
            height: 200,
            backgroundColor: "rgba(0,0,0,0.3)",
            justifyContent: "flex-end",
          }}
        />
        <View
          style={{
            paddingHorizontal: 15,
            paddingBottom: 20,
            minHeight: screenHeight - 200,
            backgroundColor: "white",
            elevation: 1,
          }}
        >
          <InfoCard>
            <About anime={props.anime} />
          </InfoCard>
          <InfoCard>
            <Categories
              anime={props.anime}
              setSelectedCategories={props.setSelectedCategories}
              onBack={props.onBack}
            />
          </InfoCard>
          <InfoCard>
            <Details anime={props.anime} />
          </InfoCard>
          <InfoCard>
            <Characters anime={props.anime} />
          </InfoCard>
        </View>
      </ScrollView>
    </View>
  );
};

const ContentContainer = (props) => {
  const { coverImage } = props.anime.attributes;

  const coverImageUrl = coverImage
    ? coverImage.original
    : "https://kitsu.io/images/default_cover-22e5f56b17aeced6dc7f69c8d422a1ab.png";

  return (
    <ImageBackground
      source={{ uri: coverImageUrl }}
      imageStyle={{ height: 200 }}
      style={{ height: screenHeight, backgroundColor: "grey" }}
      resizeMode={"cover"}
    >
      <View
        style={{
          backgroundColor: "rgba(0,0,0,0.2)",
          position: "absolute",
          borderRadius: 20,
          zIndex: 2,
        }}
      >
        <TouchableOpacity onPress={props.onBack} style={{ padding: 10 }}>
          <Text style={{ color: "white" }}>&lt;&lt;</Text>
        </TouchableOpacity>
      </View>
      <ScrollContent
        anime={props.anime}
        setSelectedCategories={props.setSelectedCategories}
        onBack={props.onBack}
      />
    </ImageBackground>
  );
};

const AnimeProfile = (props) => {
  if (!props.anime) {
    return null;
  }

  const slideAnim = useRef(new Animated.Value(screenWidth)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        onBack();
        return true;
      }
    );

    return () => backHandler.remove();
  }, []);

  const onBack = () => {
    Animated.timing(slideAnim, {
      toValue: screenWidth,
      duration: 250,
      useNativeDriver: true,
    }).start(props.onBack);
  };

  return (
    <Animated.View
      style={{
        zIndex: 10,
        transform: [{ translateX: slideAnim }],
        flex: 1,
      }}
    >
      <ContentContainer
        anime={props.anime}
        onBack={onBack}
        setSelectedCategories={props.setSelectedCategories}
      />
    </Animated.View>
  );
};

export default AnimeProfile;
