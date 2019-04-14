import React, { Component } from "react";
import styles from "./styles";
import logo from "../../assets/logo.png";
import { Text, View, Image, TextInput, TouchableOpacity } from "react-native";
import api from "../../services/api";
import AsyncStorage from "@react-native-community/async-storage";
export default class Main extends Component {
  state = {
    newBox: ""
  };
  async componentDidMount() {
    const box = await AsyncStorage.getItem("@goWeekBox");
    if (box) {
      this.props.navigation.navigate("Box");
    }
  }
  handleCreateBox = async () => {
    const res = await api.post("/box", {
      title: this.state.newBox
    });
    await AsyncStorage.setItem("@goWeekBox", res.data._id);
    this.props.navigation.navigate("Box");
  };
  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.logo} source={logo} />
        <TextInput
          style={styles.input}
          placeholder="Crie um box"
          placeholderTextColor="#999"
          autoCapitalize="none"
          autoCorrect={false}
          underlineColorAndroid="transparent"
          valur={this.state.newBox}
          onChangeText={text => this.setState({ newBox: text })}
        />
        <TouchableOpacity onPress={this.handleCreateBox} style={styles.button}>
          <Text style={styles.textButton}>Criar</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
