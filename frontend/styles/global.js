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
    fontSize: 20,
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
  orangeButton: {
    alignItems: "center",
    backgroundColor: "coral",
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
  dropdown1BtnTxtStyle: { color: "#444", textAlign: "left" },
  dropdown1DropdownStyle: { backgroundColor: "#EFEFEF" },
  dropdown1RowStyle: {
    backgroundColor: "#EFEFEF",
    borderBottomColor: "#C5C5C5",
  },
  dropdown1RowTxtStyle: { color: "#444", textAlign: "left" },
  // NATHANIEL BUTTONS //
  paperInput: {
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
    height: 20,
    color: 'grey'
  },
  paperButton: {
    width:'50%',
    height: '40px',
    marginTop:'5px'
  }
});
