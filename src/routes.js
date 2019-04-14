import { createAppContainer, createSwitchNavigator } from "react-navigation";
import Main from "./page/Main";
import Box from "./page/Box";
const Routes = createAppContainer(
  createSwitchNavigator({
    Main,
    Box
  })
);

export default Routes;
