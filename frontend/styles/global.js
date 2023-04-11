import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  homeText: {
    fontFamily: "n-bold",
    fontSize: 22,
    color: "#333",
  },
  titleText: {
    textAlign: "center",
    fontFamily: "n-bold",
    fontSize: 22,
    color: "#333",
  },
  paragrph: {
    marginVertical: 8,
    lineHeight: 20,
    fontFamily: "n-regular",
  },
  scrollTags: {
    justifyContent: "flex-start",
    flexDirection: "row",
    //flexWrap: "wrap",
    paddingHorizontal: 0,
  },
  tagText: {
    backgroundColor: "#f5f5dc",
    fontSize: 20,
    padding: 10,
    borderRadius: 10,
  },
});
