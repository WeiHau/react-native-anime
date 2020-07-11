import React from "react";
import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native";

const imageNotFoundUrl =
  "https://www.teknozeka.com/wp-content/uploads/2020/03/wp-header-logo-21.png";

const CharacterCards = (props) => {
  const { charactersData, shownCharactersCount, setSelectedCharacter } = props;
  let shownCharacters = charactersData.slice(0, shownCharactersCount);
  let returnVal = shownCharacters.map((character) => {
    const { names, image } = character.attributes;

    const imageOutput = image ? image.original : imageNotFoundUrl;

    let cardWidth, cardHeight;
    //image size w225 h350

    return (
      <View
        key={character.id}
        style={{
          width: "24%",
          marginHorizontal: ".5%",
          marginBottom: 8,
          borderWidth: 1,
          borderColor: "white",
          elevation: 0.5,
          shadowOffset: { width: 0, height: 0 },
          shadowColor: "black",
          shadowOpacity: 0.2,
          backgroundColor: "white",
        }}
        onLayout={(e) => {
          cardWidth = e.nativeEvent.layout.width;
          //cardHeight = Math.round((cardWidth / 9) * 14);
        }}
      >
        <TouchableOpacity
          onPress={() => {
            setSelectedCharacter(character);
          }}
        >
          <Image
            source={{ uri: imageOutput }}
            style={{ height: 120, width: cardWidth }}
            resizeMode="cover"
          />
          <Text numberOfLines={1} style={{}}>{`${names.en}`}</Text>
        </TouchableOpacity>
      </View>
    );
  });

  return returnVal;
};

export default CharacterCards;
