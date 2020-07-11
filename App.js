import React, { useState } from "react";
import { View, Text, StyleSheet, Modal } from "react-native";

import Collection from "./collection/Collection";
import AnimeProfile from "./animeProfile/AnimeProfile";

const App = (props) => {
  const [selectedAnime, setSelectedAnime] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);

  return (
    <View style={styles.container}>
      <AnimeProfile
        anime={selectedAnime}
        onBack={() => {
          setSelectedAnime(null);
        }}
        setSelectedCategories={setSelectedCategories}
      />
      <Collection
        selectAnime={setSelectedAnime}
        anime={selectedAnime}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
      />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    flex: 1,
  },
});
