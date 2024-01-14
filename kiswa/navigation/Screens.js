import React, { useEffect, useState } from "react";
import { Animated, Dimensions, Easing } from "react-native";
// header for screens
import { Header, Icon } from "../components";
import { argonTheme, tabs } from "../constants";

import Articles from "../screens/Articles";
import { Block } from "galio-framework";
// drawer
import CustomDrawerContent from "./Menu";
import Elements from "../screens/Elements";
// screens
import Home from "../screens/Syeda/Home";
import Onboarding from "../screens/Syeda/Onboarding";
import Pro from "../screens/Pro";
import Login from "../screens/Login";
import Register from "../screens/Syeda/Register";
// import Profile from "../screens/Syeda/Profile";
// import React from "react";

//syeda
import Donate from "../screens/Syeda/Donate";
import CheckOut from "../screens/Syeda/CheckOut";
import LoginDonor from "../screens/Syeda/LoginDonor";
import Feedback from "../screens/Syeda/Feedback";
import DonorHistory from "../screens/Syeda/DonorHistory";
import Profile from "../screens/Syeda/Profile";
import AboutUs from "../screens/Syeda/AboutUs";
import AppOnboard from "../screens/Syeda/AppOnboard";
import DonorDash from "../screens/Syeda/DonorDash";

// Fatima Inventory
import InventoryClerkHomePage from "../screens/Fatima/InventoryClerckHomePage";
import InventoryClerkProfile from "../screens/Fatima/InventoryClerkProfile";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";

// import Login from "../screens/Login";
//Families Meimouna
import LoginFamily from "../screens/Meimouna/LoginFamily";
import RegisterFamily from "../screens/Meimouna/RegisterFamily";
import FamilyHome from "../screens/Meimouna/FamilyHome";
import FamilyRequest from "../screens/Meimouna/FamilyRequest";
import FamilyCart from "../screens/Meimouna/FamilyCart";
import ConfirmFamilyCart from "../screens/Meimouna/ConfirmFamilyCart";
import FamilyFeedback from "../screens/Meimouna/FamilyFeedback";
import FeedbackConf from "../screens/Meimouna/FeedbackConf";
import RequestHistory from "../screens/Meimouna/RequestHistory";
import RequestHistoryComp from "../screens/Meimouna/RequestHistoryComp";
import FamilyProfile from "../screens/Meimouna/FamilyProfile";

//Asmaa drivers && Admin
import Drivers from "../screens/Asmaa/Drivers";
import AdminHome from "../screens/Asmaa/AdminHome";
import DriverHome from "../screens/Asmaa/DriverHome";
import AddDriver from "../screens/Asmaa/AddDriver";
import DriveProfile from "../screens/Asmaa/DriverProfile";
import DriverHistory from "../screens/Asmaa/DriverHistory";
import DriverDash from "../screens/Asmaa/DriverDash";
import FamiliesCards from "../screens/Asmaa/FamiliesCards";
import InventoryTable from "../screens/Asmaa/InventoryTable";
import DriverMap from "../screens/Asmaa/DriverMap";
import FeedbackAdmin from "../screens/Asmaa/FeedbackAdmin";
import OrderDetails from "../screens/Asmaa/OrderDetails";
import AddClerk from "../screens/Asmaa/AddClerk";
import Clerks from "../screens/Asmaa/Clerks";
import Inventory from "../screens/Asmaa/Inventory";
import Donors from "../screens/Asmaa/Donors";
import Families from "../screens/Asmaa/Families";
import Dashboard from "../screens/Asmaa/Dashboard";
import FamilyCartDetails from "../screens/Asmaa/FamilyCartDetails";
//for onboarding
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("screen");

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

function ElementsStack(props) {
  return (
    <Stack.Navigator
      screenOptions={{
        mode: "card",
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Elements"
        component={Elements}
        options={{
          header: ({ navigation, scene }) => (
            <Header title="Elements" navigation={navigation} scene={scene} />
          ),
          cardStyle: { backgroundColor: "#F8F9FE" },
        }}
      />
      <Stack.Screen
        name="Pro"
        component={Pro}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title=""
              back
              white
              transparent
              navigation={navigation}
              scene={scene}
            />
          ),
          headerTransparent: true,
        }}
      />
    </Stack.Navigator>
  );
}

function ArticlesStack(props) {
  return (
    <Stack.Navigator
      screenOptions={{
        mode: "card",
        headerShown: "screen",
      }}
    >
      <Stack.Screen
        name="Articles"
        component={Articles}
        options={{
          header: ({ navigation, scene }) => (
            <Header title="Articles" navigation={navigation} scene={scene} />
          ),
          cardStyle: { backgroundColor: "#F8F9FE" },
        }}
      />
      <Stack.Screen
        name="Pro"
        component={Pro}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title=""
              back
              white
              transparent
              navigation={navigation}
              scene={scene}
            />
          ),
          headerTransparent: true,
        }}
      />
    </Stack.Navigator>
  );
}

function AdminStack(props) {
  return (
    <Stack.Navigator
      initialRouteName="AdminHome"
      screenOptions={{
        mode: "card",
        headerShown: "screen",
      }}
    >
      <Stack.Screen
        name="AdminHome"
        component={AdminHome}
        options={{
          header: ({ navigation, scene }) => (
            <Header title="Home Page" navigation={navigation} scene={scene} />
          ),
          //   cardStyle: { backgroundColor: "#F8F9FE" },
        }}
      />
    </Stack.Navigator>
  );
}
//Asmaa
function DriverStack(props) {
  return (
    <Stack.Navigator initialRouteName="DriverHome">
      {/* <Stack.Screen name="Drivers" component={Drivers} /> */}
      <Stack.Screen name="DriverHome" component={DriverHome} />

      <Stack.Screen
        name="AddDriver"
        component={AddDriver}
        options={{ title: "AddDriver" }}
      />
      <Stack.Screen name="DriveProfile" component={DriveProfile} />
    </Stack.Navigator>
  );
}

//Asmaa
function Admin(props) {
  return (
    <Stack.Navigator
      initialRouteName="AdminHome"
      screenOptions={{
        mode: "card",
        headerShown: "screen",
      }}
    >
      <Stack.Screen
        name="AdminHome"
        component={AdminHome}
        option={{
          title: "AdminHome",
          headerStyle: {
            backgroundColor: "darkblue",
          },
          headerTintColor: "white",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />

      <Stack.Screen
        name="AddClerk"
        component={AddClerk}
        options={{ title: "AddClerk" }}
      />

      <Stack.Screen name="Donors" component={Donors} />
      <Stack.Screen name="Families" component={Families} />
      <Stack.Screen name="Clerks" component={Clerks} />
      <Stack.Screen name="Inventory" component={Inventory} />
    </Stack.Navigator>
  );
}

function HomeStack(props) {
  return (
    <Stack.Navigator
      screenOptions={{
        mode: "card",
        headerShown: "screen",
      }}
    >
      {/* /********* Syeda**********/}
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
          header: ({ navigation, scene }) => (
            <Header
              title="Home"
              search
              options
              navigation={navigation}
              scene={scene}
            />
          ),
          cardStyle: { backgroundColor: "#F8F9FE" },
        }}
      />
      {/* <Stack.Screen name="Donate" component={Donate} /> */}
      <Stack.Screen
        name="Pro"
        component={Pro}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title=""
              back
              white
              transparent
              navigation={navigation}
              scene={scene}
            />
          ),
          headerTransparent: true,
        }}
      />
    </Stack.Navigator>
  );
}

function DonateStack(props) {
  // stack for all name="Donate"
  <Stack.Navigator
    screenOptions={{
      mode: "card",
      headerShown: "screen",
    }}
    // initialRouteName="Donate"
  >
    <Stack.Screen
      name="Donate"
      component={Donate}
      options={{
        headerBackTitle: "fff",
        header: ({ navigation, scene }) => (
          <Header
            title="Donate"
            search
            options
            navigation={navigation}
            scene={scene}
          />
        ),
        cardStyle: { backgroundColor: "#F8F9FE" },
      }}
    />
  </Stack.Navigator>;
}

// function DonorHistoryStack(props) {
//   return (
//     <Stack.Navigator
//       screenOptions={{
//         mode: "card",
//         headerShown: "screen",
//       }}
//     >
//       <Stack.Screen
//         name="DonorHistory"
//         component={DonorHistory}
//         options={{
//           header: ({ navigation, scene }) => (
//             <Header
//               title="DonorHistory"
//               search
//               options
//               navigation={navigation}
//               scene={scene}
//             />
//           ),
//           cardStyle: { backgroundColor: "#F8F9FE" },
//         }}
//       />
//       <Stack.Screen
//         name="Pro"
//         component={Pro}
//         options={{
//           header: ({ navigation, scene }) => (
//             <Header
//               title=""
//               back
//               white
//               transparent
//               navigation={navigation}
//               scene={scene}
//             />
//           ),
//           headerTransparent: true,
//         }}
//       />
//     </Stack.Navigator>
//   );
// }

function ProfileStack(props) {
  return (
    <Stack.Navigator
      initialRouteName="Profile"
      screenOptions={{
        mode: "card",
        headerShown: "screen",
      }}
    >
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Pro"
        component={Pro}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title=""
              back
              white
              transparent
              navigation={navigation}
              scene={scene}
            />
          ),
          headerTransparent: true,
        }}
      />
    </Stack.Navigator>
  );
}

function AboutUsStack(props) {
  return (
    <Stack.Navigator
      screenOptions={{
        mode: "card",
        headerShown: "screen",
      }}
    >
      <Stack.Screen
        name="AboutUs"
        component={AboutUs}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title="AboutUs"
              search
              options
              navigation={navigation}
              scene={scene}
            />
          ),
          cardStyle: { backgroundColor: "#F8F9FE" },
        }}
      />
      <Stack.Screen
        name="Pro"
        component={Pro}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title=""
              back
              white
              transparent
              navigation={navigation}
              scene={scene}
            />
          ),
          headerTransparent: true,
        }}
      />
    </Stack.Navigator>
  );
}

export default function OnboardingStack(props) {
  const [firstLaunch, setFirstLaunch] = useState(null);
  useEffect(() => {
    async function setData() {
      const appData = await AsyncStorage.getItem("appLaunched");
      if (appData == null) {
        setFirstLaunch(true);
        AsyncStorage.setItem("appLaunched", "false");
      } else {
        //setFirstLaunch(true); //i am changing it to true to see the onboarding screen
        //this is what it should be //setFirstLaunch(false);
        setFirstLaunch(true);
      }
    }
    setData();
  }, []);
  return (
    firstLaunch != null && (
      <Stack.Navigator
        screenOptions={{
          mode: "card",
          headerShown: false,
        }}
      >
        {firstLaunch && (
          <Stack.Screen
            options={{ headerShown: false }}
            name="AppOnboard"
            component={AppOnboard}
          />
        )}

        <Stack.Screen
          name="Onboarding"
          component={Onboarding}
          option={{
            headerTransparent: true,
          }}
        />

        <Stack.Screen name="App" component={AppStack} />

        {/* /********* Fatima**********/}
        {/* inventory clerk home page */}
        <Stack.Screen
          name="InventoryClerkHomePage"
          component={InventoryClerkHomePage}
        />
        {/* <Stack.Screen name="AdminHome" component={AdminHome} /> */}
        {/* /********* Asmaa - Admin **********/}
        {/* inventory clerk profile */}
        <Stack.Screen
          name="InventoryClerkProfile"
          component={InventoryClerkProfile}
        />

        {/* <Stack.Screen name="AdminHome" component={AdminHome} /> */}
        <Stack.Screen name="AddClerk" component={AddClerk} />
        <Stack.Screen name="Clerks" component={Clerks} />
        <Stack.Screen name="Inventory" component={Inventory} />
        <Stack.Screen name="FamiliesCards" component={FamiliesCards} />
        <Stack.Screen name="InventoryTable" component={InventoryTable} />

        {/* /********* Asmaa - Admin **********/}
        <Stack.Screen name="AdminHome" component={AdminHome} />
        {/* /********* Asmaa - Driver **********/}
        <Stack.Screen name="DriverHome" component={DriverHome} />
        <Stack.Screen name="AddDriver" component={AddDriver} />
        <Stack.Screen name="DriveProfile" component={DriveProfile} />
        <Stack.Screen name="Donors" component={Donors} />
        <Stack.Screen name="Profile" component={Profile} />

        <Stack.Screen name="Families" component={Families} />
        <Stack.Screen name="DriverHistory" component={DriverHistory} />
        <Stack.Screen name="DriverDash" component={DriverDash} />
        <Stack.Screen name="DriverMap" component={DriverMap} />
        <Stack.Screen name="FeedbackAdmin" component={FeedbackAdmin} />
        <Stack.Screen name="Drivers" component={Drivers} />
        <Stack.Screen
          name="OrderDetails"
          component={OrderDetails}
          options={{
            headerShown: true,
            title: "",
            headerBackTitle: "Back",
            headerTintColor: "#3C4DBD",
          }}
        />

        {/* /*********  LogIn **********/}
        {/* <Stack.Screen name="Login" component={Login} /> */}
        {/* /*********  Login - Register **********/}
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen
          name="Donate"
          component={Donate}
          options={{
            headerShown: true,
            title: "",
            headerBackTitle: "Cancel",
            // headerTintColor: "#5e1e7f",
          }}
        />
        <Stack.Screen name="CheckOut" component={CheckOut} />
        <Stack.Screen name="Feedback" component={Feedback} />
        <Stack.Screen
          name="DonorHistory"
          component={DonorHistory}
          options={{
            headerShown: true,
            title: "",
            headerBackTitle: "Back",
            // headerTintColor: "#5e1e7f",
          }}
        />
        <Stack.Screen
          name="AboutUs"
          component={AboutUs}
          options={
            {
              // headerShown: true,
            }
          }
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            headerShown: false,
            title: "",
            headerBackTitle: "Back",
            // headerTintColor: "#5e1e7f",
          }}
        />
        <Stack.Screen name="LoginDonor" component={LoginDonor} />

        {/* /*********  Meimouna - Family **********/}
        <Stack.Screen name="RegisterFamily" component={RegisterFamily} />
        <Stack.Screen name="FamilyHome" component={FamilyHome} />
        <Stack.Screen name="FamilyRequest" component={FamilyRequest} />
        <Stack.Screen name="LoginFamily" component={LoginFamily} />
        <Stack.Screen name="FamilyCart" component={FamilyCart} />
        <Stack.Screen name="ConfirmFamilyCart" component={ConfirmFamilyCart} />
        <Stack.Screen name="FamilyFeedback" component={FamilyFeedback} />
        <Stack.Screen name="FeedbackConf" component={FeedbackConf} />
        <Stack.Screen name="RequestHistory" component={RequestHistory} />
        <Stack.Screen
          name="FamilyCartDetails"
          component={FamilyCartDetails}
          options={{
            headerShown: true,
            title: "",
            headerBackTitle: "Back",
            // headerTintColor: "#5e1e7f",
          }}
        />

        <Stack.Screen
          name="RequestHistoryComp"
          component={RequestHistoryComp}
        />
        <Stack.Screen name="FamilyProfile" component={FamilyProfile} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="DonorDash" component={DonorDash} />
      </Stack.Navigator>
    )
  );
}

function AppStack(props) {
  return (
    <Drawer.Navigator
      style={{ flex: 1 }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      drawerStyle={{
        backgroundColor: "white",
        width: width * 0.8,
      }}
      drawerContentOptions={{
        activeTintcolor: "white",
        inactiveTintColor: "#000",
        activeBackgroundColor: "transparent",
        itemStyle: {
          width: width * 0.75,
          backgroundColor: "transparent",
          paddingVertical: 16,
          paddingHorizonal: 12,
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
          overflow: "hidden",
        },
        labelStyle: {
          fontSize: 18,
          marginLeft: 12,
          fontWeight: "normal",
        },
      }}
      initialRouteName="Home"
    >
      <Drawer.Screen
        name="Home"
        component={HomeStack}
        options={{
          headerShown: false,
        }}
      />
      {/* <Drawer.Screen
        name="AboutUs"
        component={AboutUsStack}
        options={{
          headerShown: false,
        }}
      /> */}
      {/* <Drawer.Screen
        name="Donate"
        component={DonateStack}
        options={{
          headerShown: false,
        }}
      /> */}
      {/* <Drawer.Screen
        name="DonorHistory"
        component={DonorHistoryStack}
        options={{
          headerShown: false,
        }}
      /> */}
      <Drawer.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          headerShown: false,
        }}
      />
      {/* syeda */}
    </Drawer.Navigator>
  );
}
