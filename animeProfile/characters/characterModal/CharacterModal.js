import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";

import BasicInfo from "./BasicInfo";
import SpoilerContent from "./SpoilerContent";

const CharacterModal = (props) => {
  const { character, setSelectedCharacter } = props;
  if (!character) return null;

  const formatDescription = (description) => {
    // replacing <br> with \n
    let returnVal = description.replace(/<br\s*\/?>/gm, "\n");

    //remove and reformat <p> tags
    let outerOffset = 0,
      stringArray = [];
    returnVal.replace(/<p>(.+?)<\/p>/gms, (match, contents, offset) => {
      if (outerOffset !== offset)
        stringArray.push(returnVal.slice(outerOffset, offset));
      stringArray.push(contents);
      outerOffset = offset + match.length;
    });
    stringArray.push(returnVal.substring(outerOffset, returnVal.length));
    returnVal = stringArray.join("\n");

    //replacing spoiler content with touchables, put them into an array
    outerOffset = 0;
    stringArray = [];
    returnVal.replace(
      /<(span\sclass=\\?\"spoiler\\?\"|spoiler)>(.+?)<\/(span|spoiler)>/gms,
      (match, dummy0, contents, dummy1, offset) => {
        if (outerOffset === 0)
          stringArray.push(returnVal.slice(outerOffset, offset));
        else stringArray.push("\n" + returnVal.slice(outerOffset, offset));

        stringArray.push(
          <SpoilerContent content={contents} id={stringArray.length} />
        );
        outerOffset = offset + match.length;
      }
    );
    if (outerOffset !== returnVal.length) {
      if (outerOffset === 0) {
        stringArray.push(returnVal.substring(outerOffset, returnVal.length));
      } else {
        stringArray.push(
          "\n" + returnVal.substring(outerOffset, returnVal.length)
        );
      }
    }

    returnVal = stringArray.map((text, index) => {
      return <Text key={index}>{text}</Text>;
    });

    return returnVal;
  };

  const onBack = () => {
    setSelectedCharacter(null);
  };

  const { description } = character.attributes;
  let formattedDescription = formatDescription(description);

  return (
    <Modal transparent={true} animationType={"fade"} visible={!!character}>
      <TouchableOpacity
        activeOpacity={1}
        style={{
          flex: 1,
          backgroundColor: "rgba(52, 52, 52, 0.5)",
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={onBack}
      >
        <TouchableWithoutFeedback>
          <View
            style={{
              width: "85%",
              height: "85%",
              backgroundColor: "white",
              borderRadius: 8,
            }}
          >
            <ScrollView>
              <TouchableOpacity style={{ padding: 20 }} activeOpacity={1}>
                <BasicInfo character={character} />
                <View style={{ marginTop: 10 }}>
                  <Text>{formattedDescription}</Text>
                </View>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
};

export default CharacterModal;

//Stupid implementation
// import React, { useRef, useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   ScrollView,
//   Modal,
//   TouchableWithoutFeedback,
// } from "react-native";

// import BasicInfo from "./BasicInfo";
// import ScrollingLayer from "./ScrollingLayer";
// import SpoilerContent from "./SpoilerContent";

// const CharacterModal = (props) => {
//   const { character, setSelectedCharacter } = props;
//   if (!character) return null;

//   const [hideButton, setHideButton] = useState("top");

//   // replacing <br> with \n
//   const formatDescription = (description) => {
//     let returnVal = description.replace(/<br\s*\/?>/gm, "\n");

//     //remove and reformat <p> tags
//     let outerOffset = 0,
//       stringArray = [];
//     returnVal.replace(/<p>(.+?)<\/p>/gms, (match, contents, offset) => {
//       if (outerOffset !== offset)
//         stringArray.push(returnVal.slice(outerOffset, offset));
//       stringArray.push(contents);
//       outerOffset = offset + match.length;
//     });
//     stringArray.push(returnVal.substring(outerOffset, returnVal.length));
//     returnVal = stringArray.join("\n");

//     //replacing spoiler content with touchables, put them into an array
//     outerOffset = 0;
//     stringArray = [];
//     returnVal.replace(
//       /<(span\sclass=\\?\"spoiler\\?\"|spoiler)>(.+?)<\/(span|spoiler)>/gms,
//       (match, dummy0, contents, dummy1, offset) => {
//         if (outerOffset === 0)
//           stringArray.push(returnVal.slice(outerOffset, offset));
//         else stringArray.push("\n" + returnVal.slice(outerOffset, offset));

//         stringArray.push(
//           <SpoilerContent content={contents} key={stringArray.length} />
//         );
//         outerOffset = offset + match.length;
//       }
//     );
//     if (outerOffset !== returnVal.length) {
//       if (outerOffset === 0) {
//         stringArray.push(returnVal.substring(outerOffset, returnVal.length));
//       } else {
//         stringArray.push(
//           "\n" + returnVal.substring(outerOffset, returnVal.length)
//         );
//       }
//     }

//     returnVal = stringArray.map((text, index) => {
//       return <Text key={index}>{text}</Text>;
//     });

//     return returnVal;
//   };

//   const { description } = character.attributes;
//   let formattedDescription = formatDescription(description);

//   const scrollView = useRef();
//   const positionY = useRef(0);
//   const contentHeight = useRef(0);
//   const scrollViewHeight = useRef(0);

//   const handleScroll = ({ nativeEvent }) => {
//     positionY.current = nativeEvent.contentOffset.y;
//     checkTopBottom();
//   };

//   const checkTopBottom = () => {
//     if (!contentHeight || !scrollViewHeight) {
//       return;
//     }

//     const atTop = positionY.current === 0;
//     const atBottom =
//       scrollViewHeight.current + positionY.current >= contentHeight.current - 1; //compensate that tiny offset (-1)

//     if (atBottom) {
//       setHideButton("bottom");
//     } else if (atTop) {
//       setHideButton("top");
//     } else if (hideButton !== null) {
//       setHideButton(null);
//     }
//   };

//   return (
//     <Modal transparent={true} animationType={"fade"} visible={!!character}>
//       <TouchableOpacity
//         activeOpacity={1}
//         style={{
//           flex: 1,
//           backgroundColor: "rgba(52, 52, 52, 0.5)",
//           justifyContent: "center",
//           alignItems: "center",
//           paddintTop: 20,
//         }}
//         onPress={() => {
//           setSelectedCharacter(null);
//         }}
//       >
//         <TouchableWithoutFeedback>
//           <View
//             style={{
//               width: "85%",
//               height: "85%",
//               backgroundColor: "white",
//               borderRadius: 8,
//             }}
//           >
//             <ScrollingLayer
//               scrollView={scrollView}
//               positionY={positionY}
//               direction="up"
//               hide={hideButton === "top"}
//             />
//             <ScrollingLayer
//               scrollView={scrollView}
//               positionY={positionY}
//               direction="down"
//               hide={hideButton === "bottom"}
//             />

//             <ScrollView
//               onScroll={handleScroll}
//               onLayout={(e) => {
//                 scrollViewHeight.current = e.nativeEvent.layout.height;
//                 checkTopBottom();
//               }}
//               scrollEventThrottle={100}
//               ref={scrollView}
//             >
//               <TouchableOpacity
//                 style={{ padding: 20 }}
//                 onLayout={(e) => {
//                   contentHeight.current = e.nativeEvent.layout.height;
//                   checkTopBottom();
//                 }}
//                 activeOpacity={1}
//               >
//                 <BasicInfo character={character} />
//                 <View style={{ marginTop: 10 }}>
//                   <Text>{formattedDescription}</Text>
//                 </View>
//               </TouchableOpacity>
//             </ScrollView>
//           </View>
//         </TouchableWithoutFeedback>
//       </TouchableOpacity>
//     </Modal>
//   );
// };

// export default CharacterModal;
