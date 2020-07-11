import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity } from "react-native";

import CharacterCards from "./CharacterCards";
import CharacterModal from "./characterModal/CharacterModal";

const Characters = (props) => {
  const { characters } = props.anime.relationships;
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  if (!characters) {
    return null;
  }

  const [charactersData, setCharactersData] = useState([]);
  const nextPath = useRef(
    `https://kitsu.io/api/edge/anime/${props.anime.id}/characters?sort=role&page[limit]=20&page[offset]=0`
  );
  const [shownCharactersCount, setShownCharactersCount] = useState(0);
  const charactersCount = useRef(-1); // for displaying 'no characters found' if 0
  const unmounted = useRef(false);

  const fetchData = async (apiPath) => {
    try {
      let res = await fetch(apiPath);
      let data = await res.json();
      return data;
    } catch (err) {
      console.log(err);
    }
  };

  //   const fetchAll = async () => {
  //     let returnVal = [];
  //     let path;

  //     while (true) {
  //       path = `https://kitsu.io/api/edge/anime/${props.anime.id}/characters?sort=role&page[limit]=20&page[offset]=${returnVal.length}`;
  //       let temp = await fetchData(path);
  //       if (temp.data.length > 0) {
  //         returnVal = [...returnVal, ...temp.data];
  //       } else {
  //         return returnVal;
  //       }
  //     }
  //   };

  const getCharacters = async () => {
    let characterObjects = await fetchData(nextPath.current);

    charactersCount.current = characterObjects.meta.count;
    if (charactersCount.current === 0) {
      setShownCharactersCount(0);
      return;
    }

    nextPath.current = characterObjects.links.next;

    let characterLinks = characterObjects.data.map(
      (characterObject) => characterObject.relationships.character.links.related
    );

    let finalCharactersObject = await Promise.all(
      //fetch all details using id
      characterLinks.map(async (path) => {
        let returnVal = await fetchData(path);
        return returnVal.data;
      })
    );

    let tempArray = [...charactersData, ...finalCharactersObject];

    //possible duplicate object, hence filter
    tempArray = tempArray.filter(
      (thing, index, self) => index === self.findIndex((t) => t.id === thing.id)
    );

    if (!unmounted.current) {
      setCharactersData(tempArray);
    }
  };

  useEffect(() => {
    loadCharacters();

    return () => {
      unmounted.current = true;
    };
  }, []);

  let loadingCharacters = false;
  const loadCharacters = () => {
    if (loadingCharacters) {
      return;
    }

    if (
      shownCharactersCount >= charactersData.length - 16 &&
      nextPath.current
    ) {
      loadingCharacters = true;
      getCharacters().then(() => {
        loadingCharacters = false;
      });
    }

    setShownCharactersCount((shownCharactersCount) => shownCharactersCount + 8);
  };

  let returnVal;
  if (charactersCount.current === -1) {
    returnVal = <Text>Loading...</Text>;
  } else if (charactersCount.current === 0) {
    returnVal = <Text>No character data found</Text>;
  } else {
    returnVal = (
      <View>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          <CharacterCards
            charactersData={charactersData}
            shownCharactersCount={shownCharactersCount}
            setSelectedCharacter={setSelectedCharacter}
          />
          <CharacterModal
            character={selectedCharacter}
            setSelectedCharacter={setSelectedCharacter}
          />
        </View>
        <View style={{ justifyContent: "center", paddingHorizontal: 50 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              backgroundColor: "#eeeeee",
              marginTop: 10,
              borderRadius: 24,
              overflow: "hidden",
            }}
          >
            {shownCharactersCount > 8 && (
              <TouchableOpacity
                onPress={() => {
                  setShownCharactersCount((shownCharactersCount) => {
                    if (shownCharactersCount % 8 !== 0) {
                      return shownCharactersCount - (shownCharactersCount % 8);
                    } else {
                      return shownCharactersCount - 8;
                    }
                  });
                }}
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 10,
                  flex: 1,
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 16, color: "#666666" }}>LESS</Text>
              </TouchableOpacity>
            )}

            {shownCharactersCount < charactersData.length && (
              <TouchableOpacity
                onPress={loadCharacters}
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 10,
                  flex: 1,
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 16, color: "#666666" }}>MORE</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
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
        Characters
      </Text>
      {returnVal}
    </View>
  );
};

export default Characters;
