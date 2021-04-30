import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';

//const DATA = AsyncStorage.getItem('test')





export default function App() {
  console.disableYellowBox = true;
  const [list, setList] = useState([]);
  const [text, setText] = useState('');

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('test')
      if (jsonValue != null) {
        setList(JSON.parse(jsonValue).list)
      } else {
        setList([])
      }
      //alert(jsonValue != null ? JSON.parse(jsonValue).list : null)
      //console.log(JSON.parse(jsonValue))
      //return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // error reading value
    }
  }
  const saveData = async (id) => {
    try {
      const oldData = await AsyncStorage.getItem('test');//retrieve old data
      const jsonOldData = JSON.parse(oldData);//parse the string to JSON object
      let JSON_Val;
      //alert(jsonOldData)
      if (jsonOldData === null) {//first time
        //alert('empty')
        JSON_Val = JSON.stringify({
          list: [
            { id: id }
          ]
        })
        AsyncStorage.setItem('test', JSON_Val)
      } else {//subsequent times added with old data
        console.log(jsonOldData.list);
        JSON_Val = JSON.stringify({
          list: [
            ...jsonOldData.list,//merge old with new obj
            { id: id }
          ]
        })
        AsyncStorage.setItem('test', JSON_Val)
      }
      getData()
    } catch (e) {
      // saving error
    }
  }
  useEffect(() => {
    getData()
  }, [])


  const clearStorage = async () => {
    try {
      await AsyncStorage.removeItem('test')
      getData()
    } catch (e) {
      console.log(e)
    }
  }


  const renderItem = ({ item }) => {//do {item} so you dont need to do item.item...
    console.log(item)
    return (
      <View style={styles.renderItem}>
        <Text style={{ textAlign: 'center' }}>{item.id}</Text>
      </View>
    )
  }

  return (
      <SafeAreaView style={styles.container} >
        <TouchableOpacity
          style={styles.spacing}
          onPress={() => saveData(`id -> ${Math.ceil(Math.random() * 1000000)}`)}>
          <Text>CLICK TO SAVE RANDOM</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.spacing}
          onPress={clearStorage}>
          <Text>CLEAR LIST</Text>
        </TouchableOpacity>

        <Text style={{ marginVertical: 10 }}> ENTER CUSTOM ID: </Text>
        <TextInput
          style={styles.input}
          onChangeText={text => setText(text)} />

        <TouchableOpacity
          style={styles.spacing}
          onPress={() => {
            console.log(text)
            saveData(`id -> ${text}`)
          }}>
          <Text>SAVE CUSTOM</Text>
        </TouchableOpacity>

        <FlatList
          data={list}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    //backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  renderItem: {
    backgroundColor: '#ccc',
    width: '100%',
    height: 50,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20
  },

  spacing: {
    marginVertical: 25,
    backgroundColor: '#ccc',
    height: 50,
    width: '48%',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15
  },

  input: {
    width: '70%',
    borderBottomColor: 'black',
    borderBottomWidth: 1
  }
});
