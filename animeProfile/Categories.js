import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity } from "react-native";

const Categories = (props) => {
  const { categories } = props.anime.relationships;
  const [categoryData, setCategoryData] = useState();
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
  const apiPath = categories.links.related;
  useEffect(() => {
    fetchData(apiPath).then((data) => {
      if (!unmounted.current) setCategoryData(data.data);
    });
  }, []);

  useEffect(() => {
    return () => {
      unmounted.current = true;
    };
  }, []);

  const categoryArray = categoryData
    ? categoryData.map((category) => {
        return {
          id: category.id,
          title: category.attributes.title,
          slug: category.attributes.slug,
        };
      })
    : [];

  const categoryCards = categoryArray.map((category, index) => {
    return (
      <View
        style={{
          backgroundColor: "#dddddd",
          borderRadius: 10,
          paddingVertical: 4,
          paddingHorizontal: 6,
          margin: 2,
        }}
        key={category.id}
      >
        <TouchableOpacity
          onPress={() => {
            props.onBack();
            props.setSelectedCategories([category]);
          }}
        >
          <Text>{category.title}</Text>
        </TouchableOpacity>
      </View>
    );
  });

  const returnVal =
    categoryArray.length > 0 ? (
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {categoryCards}
      </View>
    ) : (
      <Text>Loading...</Text>
    );

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
        Tags/Categories
      </Text>
      {returnVal}
    </View>
  );
};

export default Categories;
