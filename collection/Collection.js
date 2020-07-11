import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, Platform } from "react-native";

import Board from "./Board";

import SearchBar from "./filters/SearchBar";
import SortDropDown from "./filters/SortDropDown";
import SelectedCategories from "./filters/SelectedCategories";
import AddCategories from "./filters/addCategories/AddCategories";

const Collection = (props) => {
  const [animeList, setAnimeList] = useState([]);
  const [toggleResetAnimeList, setToggleResetAnimeList] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("popularityRank");
  const { selectedCategories, setSelectedCategories } = props;
  const [sortEnabled, setSortEnabled] = useState(false);
  const animeCount = useRef(-1); //for displaying no results found

  //cant use normal variable cuz fetchdata cause re-render, and second time wont call fetchdata again, sorted remain true
  const sorted = useRef(true);
  const fetchingData = useRef(false);

  const fetchData = () => {
    if (fetchingData.current) {
      return;
    }
    fetchingData.current = true;
    const pageOffsetParam = "&page[offset]=" + animeList.length;

    let sortsearchParam;
    if (searchText !== "") {
      sortsearchParam = "&filter[text]=" + encodeURIComponent(searchText);
      sorted.current = false;
      setSortEnabled(false);
    } else {
      sortsearchParam = "&sort=" + sort;
      sorted.current = true;
      setSortEnabled(true);
    }

    let categoriesParam = "";
    if (selectedCategories && selectedCategories.length > 0) {
      let categorySlugs = selectedCategories.map((category) => category.slug);
      categoriesParam =
        "&filter[categories]=" + encodeURIComponent(categorySlugs.join());
      setSortEnabled(false);
    }

    let apiPath =
      "https://kitsu.io/api/edge/anime?page[limit]=20" +
      sortsearchParam +
      pageOffsetParam +
      categoriesParam;

    console.log("Fetching from source: " + apiPath);
    fetch(apiPath)
      .then((res) => res.json())
      .then((data) => {
        animeCount.current = data.meta.count;
        setAnimeList([...animeList, ...data.data]);
        fetchingData.current = false;
      })
      .catch((err) => {
        console.log(err);
        fetchingData.current = false;
      });
  };

  const search = (value) => {
    if (searchText !== value) {
      setSearchText(value);
    }
  };

  useEffect(() => {
    if (selectedCategories && selectedCategories.length > 0) {
      setSort("popularityRank");
    }
    setAnimeList([]);
    setToggleResetAnimeList((toggleResetAnimeList) => !toggleResetAnimeList);
  }, [searchText, sort, selectedCategories]);

  useEffect(() => {
    fetchData();
  }, [toggleResetAnimeList]);

  let hiddenStyle =
    props.anime && Platform.OS === "android"
      ? StyleSheet.create({
          hiddenContainer: {
            height: 0,
            flex: 0,
          },
        })
      : {};

  return (
    <View style={hiddenStyle.hiddenContainer}>
      <SearchBar search={search} />
      <View style={{ flexDirection: "row", backgroundColor: "#dddddd" }}>
        <SortDropDown
          selectedValue={sort}
          onValueChange={setSort}
          enabled={sortEnabled}
          sorted={sorted.current}
        />
        <AddCategories
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
        />
      </View>
      <SelectedCategories
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
      />
      <Board
        animeList={animeList}
        reachBottom={() => {
          fetchData();
        }}
        selectAnime={props.selectAnime}
        animeCount={animeCount.current}
      />
    </View>
  );
};

export default Collection;
