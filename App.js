import { StatusBar } from "expo-status-bar";
import React from "react";
import Loading from "./Loading";
import * as Location from "expo-location";
import { Alert } from "react-native";
import axios from "axios";
import Weather from "./Weather";

const API_KEY = "2a58fda3e9c9082a87078e03940f0bdc";

export default class extends React.Component {
  state = {
    isLoading: true,
  };

  getWeather = async (latitude, longitude) => {
    try {
      const {
        data: {
          main: { temp },
          weather,
        },
      } = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
      );
      this.setState({
        isLoading: false,
        condition: weather[0].main,
        temp,
      });
    } catch (error) {
      Alert.alert("Network failure");
    }
  };
  getLocation = async () => {
    try {
      await Location.requestForegroundPermissionsAsync();
      const {
        coords: { latitude, longitude },
      } = await Location.getCurrentPositionAsync();
      this.getWeather(latitude, longitude);
      // Send to API & get weather
    } catch (error) {
      Alert.alert("Can't find you.", "So sad");
    }
  };
  componentDidMount() {
    this.getLocation();
  }
  render() {
    const { isLoading, condition, temp } = this.state;
    // console.log(this.state);
    return isLoading ? (
      <Loading />
    ) : (
      <Weather condition={condition} temp={Math.round(temp)} />
    );
  }
}
