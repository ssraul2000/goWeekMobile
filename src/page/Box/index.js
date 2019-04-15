import React, { Component } from "react";
import { Text, View, FlatList, TouchableOpacity } from "react-native";
import styles from "./styles";
import api from "../../services/api";
import AsyncStorage from "@react-native-community/async-storage";
import ImagePicker from 'react-native-image-picker'

import Icon from "react-native-vector-icons/MaterialIcons";
import { distanceInWords } from "date-fns";
import pt from "date-fns/locale/pt";
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
import socket from 'socket.io-client'
export default class Box extends Component {
  state = {
    box: {}
  };
  async componentDidMount() {
    const box = await AsyncStorage.getItem("@goWeekBox");
    this.subscribeToNewFiles(box)
    if (box) {
      const res = await api.get(`/box/${box}`);
      this.setState({ box: res.data });
    }
  } 
  subscribeToNewFiles =  box => {
    const io = socket("https://backendgoweek6.herokuapp.com");
    io.emmit("connectiRoom", box);
    io.on('file', data => {
      this.setState({ ...this.state.box, files: [ data, ...this.state.box.files ] })
    } )
  }
  openFile = async file => {
    try{
      const filePath = `${RNFS.DocumentDirectoryPath}/${file.title}`,;
      await RNFS.downloadFile({
        fromUrl: file.url,
        toFile: filePath,

      })
      await FileViewer.open(FileViewer);
    }catch(err){
      console.log("Arquivo não suportado!");
    }
  }
  renderItems = ({ item }) => (
    <TouchableOpacity onPress={() => this.openFile(item)} style={styles.file}>
      <View style={styles.fileInfo}>
        <Icon name="insert-drive-file" size={24} color="#A5CFFF" />
        <Text style={styles.fileTitle}> {item.title} </Text>
      </View>
      <Text style={styles.fileDate}>
        há{" "}
        {distanceInWords(item.createdAt, new Date(), {
          locale: pt
        })}{" "}
      </Text>
    </TouchableOpacity>
  );
  handleUpload = () => {
    ImagePicker.launchImageLibrary({}, async upload => {
      if(upload.error){
        console.log("ImagePicker error");
      }else if(upload.didCancel){
        console.log("Canceled by user");
      }else{
        const data = new FormData();
        const [prefix , sufix] = upload.fileName.split(".");
        const ext = sufix.toLowerCase() === "heic" ? "jpg" : sufix;
        data.append( 'file', {
          uri: upload.uri,
          type:  upload.type,
          name: `${prefix}.${ext}`
        })

        await api.post(`/box/${this.state.box._id}/file`, data);
      }
    })
  };
  render() {
    return (
      <View style={styles.container}>
        <Text style={StyleSheet.boxTitle}>{this.state.box.title}</Text>
        <FlatList
          data={this.state.box.files}
          style={styles.list}
          keyExtractor={file => file._id}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={this.renderItems}
        />
        <TouchableOpacity style={styles.fab} onPress={this.handleUpload}>
          <Icon name="cloud-upload" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
    );
  }
}
