import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
  container: {
    backgroundColor: "#fafafa",
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
    fontSize: 20,
  },
  scrollTags: {
    justifyContent: "flex-start",
    flexDirection: "row",
    //flexWrap: "wrap",
    paddingHorizontal: 0,
  },
  tagText: {
    backgroundColor: "#E3F3F3",
    fontSize: 25,
    padding: 10,
    borderRadius: 100,
  },
  orangeButton: {
    alignItems: "center",
    backgroundColor: "#76A5AF",
    padding: 10,
  },
  grayButton: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10,
  },
  dropdown1BtnStyle: {
    width: "80%",
    height: 50,
    backgroundColor: "#FFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#444",
  },
  dropdown1BtnTxtStyle: {
    color: "#444",
    textAlign: "left",
    fontSize: 25,
    fontFamily: "n-bold",
  },
  dropdown1DropdownStyle: { backgroundColor: "#EFEFEF" },
  dropdown1RowStyle: {
    backgroundColor: "#EFEFEF",
    borderBottomColor: "#C5C5C5",
  },
  dropdown1RowTxtStyle: {
    color: "#444",
    textAlign: "left",
    fontSize: 25,
    fontFamily: "n-regular",
  },
  // NATHANIEL BUTTONS //
  newsCard: {
    backgroundColor: "#f2f7f7",
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
    color: "grey",
  },
  outlinedButton: {
    borderRadius: 10,
    backgroundColor: "#eeebf2",
    width: "100%",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderColor: "grey",
    borderWidth: 1,
    marginTop: 10,
    textAlign: "center",
    alignItems: "center",
  },
  filledButton: {
    borderRadius: 5,
    backgroundColor: "#d6e8ff",
    width: "100%",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderColor: "#bbd8fc",
    borderWidth: 2,
    marginTop: 10,
  },
});
