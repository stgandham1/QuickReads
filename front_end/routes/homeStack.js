import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";
import Home from "../screens/home";
import ReviewDetail from "../screens/reviewDetails";
const screens = {
  Home: {
    screen: Home,
    navigationOptions: {
      title: "HomePage",
    },
  },
  ReviewDetail: {
    screen: ReviewDetail,
    navigationOptions: {
      title: "Details",
    },
  },
};

const HomeStack = createStackNavigator(screens, {
  defaultNavigationOptions: {
    headerTintColor: "#444",
    headerStyle: { backgroundColor: "#eee", height: 60 },
  },
});

export default createAppContainer(HomeStack);
