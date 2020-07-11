import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  FlatList,
  ScrollView,
} from "react-native";

import CategoryCheckBox from "./CategoriesCheckBox";

const Header = (props) => {
  return (
    <View style={{ overflow: "hidden", paddingBottom: 3 }}>
      <View style={{ elevation: 3, backgroundColor: "#fff" }}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            marginHorizontal: 5,
            marginBottom: 10,
          }}
        >
          {"Tags/Categories"}
        </Text>
      </View>
    </View>
  );
};

const AllCategories = (props) => {
  const {
    categoriesData,
    getCategories,
    selectedCategories,
    addCategory,
    removeCategory,
  } = props;

  const renderItem = ({ item }) => {
    let selected = false;
    if (
      selectedCategories &&
      selectedCategories.some(
        (selectedCategory) => selectedCategory.id === item.id
      )
    )
      selected = true;
    return (
      <CategoryCheckBox
        category={item}
        addCategory={addCategory}
        removeCategory={removeCategory}
        selected={selected}
      />
    );
  };

  return (
    <TouchableOpacity style={{}} activeOpacity={1}>
      <FlatList
        data={categoriesData}
        style={{ height: "70%" }}
        contentContainerStyle={{ paddingBottom: 0 }}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        onEndReached={getCategories}
        onEndReachedThreshold={0.2}
      />
    </TouchableOpacity>
  );
};

const SelectedCategories = (props) => {
  const { selectedCategories, removeCategory } = props;

  let returnVal = selectedCategories.map((category) => {
    return (
      <Text
        onPress={() => {
          removeCategory(category);
        }}
        key={category.id}
        style={{
          backgroundColor: "orange",
          margin: 1,
          paddingHorizontal: 3,
          borderRadius: 4,
        }}
      >
        {category.title}
      </Text>
    );
  });

  return (
    <View>
      <View style={{ overflow: "hidden", paddingTop: 3 }}>
        <View style={{ elevation: 10, backgroundColor: "#fff" }}>
          <Text style={{ paddingTop: 10 }}>{"Selected:"}</Text>
        </View>
      </View>
      <ScrollView>
        <TouchableOpacity style={{ flex: 1 }} activeOpacity={1}>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {returnVal}
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const ConfirmButton = (props) => {
  return (
    <View style={{ alignItems: "center", marginTop: 10 }}>
      <TouchableOpacity
        style={{
          alignItems: "center",
          padding: 8,
          backgroundColor: "#cccccc",
          width: "30%",
          borderRadius: 12,
        }}
        onPress={props.onPress}
      >
        <Text>Confirm</Text>
      </TouchableOpacity>
    </View>
  );
};

const AddCategoriesModal = (props) => {
  const [categoriesData, setCategoriesData] = useState([]);
  const { selectedCategories, setSelectedCategories } = props;
  const [localSelectedCategories, localSetSelectedCategories] = useState(
    selectedCategories
  );

  const fetchData = async (apiPath) => {
    try {
      let res = await fetch(apiPath);
      let data = await res.json();
      return data;
    } catch (err) {
      console.log(`Error when fetching data for categories: ${err}`);
    }
  };

  let fetchingData = false;
  const getCategories = async () => {
    if (!fetchingData) {
      fetchingData = true;
      let apiPath = `https://kitsu.io/api/edge/categories?sort=title&page[limit]=20&page[offset]=${categoriesData.length}`;
      let data = await fetchData(apiPath);
      data = data.data.map((x) => {
        return {
          id: x.id,
          title: x.attributes.title,
          slug: x.attributes.slug,
        };
      });
      setCategoriesData([...categoriesData, ...data]);
      //setCategoriesData(categoriesData.slice(0, 20));
      fetchingData = false;
    }
  };

  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      getCategories();
      return;
    }
  }, []);

  const addCategory = (category) => {
    localSetSelectedCategories([...localSelectedCategories, category]);
  };

  const removeCategory = (category) => {
    localSetSelectedCategories(
      localSelectedCategories.filter((item) => item.id !== category.id)
    );
  };

  const closeModal = () => {
    props.hideModal();
  };

  const confirmCategories = () => {
    setSelectedCategories(localSelectedCategories);
    props.hideModal();
  };

  return (
    <Modal
      transparent={true}
      animationType={"fade"}
      visible={props.modalVisible}
      onShow={() => {
        localSetSelectedCategories(selectedCategories);
      }}
    >
      <TouchableOpacity
        activeOpacity={1}
        style={{
          flex: 1,
          backgroundColor: "rgba(52, 52, 52, 0.5)",
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={closeModal}
      >
        <TouchableWithoutFeedback>
          <View
            style={{
              width: "85%",
              height: "85%",
              backgroundColor: "white",
              borderRadius: 8,
              overflow: "hidden",
              justifyContent: "space-around",
              padding: 10,
            }}
          >
            <Header />
            <AllCategories
              categoriesData={categoriesData}
              getCategories={getCategories}
              selectedCategories={localSelectedCategories}
              addCategory={addCategory}
              removeCategory={removeCategory}
            />
            <SelectedCategories
              selectedCategories={localSelectedCategories}
              removeCategory={removeCategory}
            />
            <ConfirmButton onPress={confirmCategories} />
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
};

export default AddCategoriesModal;
