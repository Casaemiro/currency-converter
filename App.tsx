/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import type { PropsWithChildren } from 'react';
import SelectDropdown from 'react-native-select-dropdown'
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function App(): JSX.Element {
  const [currencyObject, setCurrencyObject] = useState<any>()
  const [source, setSource] = useState<string>('')
  const [target, setTarget] = useState<string>('')
  const [sourceAmount, setSourceAmount] = useState<any>(0)
  const [convertedAmount, setConvertedAmount] = useState<any>(0)
  const currencyConverterEndpoint = 'https://api.frankfurter.app/latest'
  const fetchCurrencyLatest = () => {
    return fetch(currencyConverterEndpoint)
      .then(response => response.json())
      .then(data => {
        setCurrencyObject(data)
        return (Object.keys(data.rates))
      })
    }
    const [currencyList, setCurrencyList] = useState<string[]>([])
    useEffect(() => {
      fetchCurrencyLatest()
      .then(list => setCurrencyList(list))
    }, [])
   
    /**
     * coverts amount in source currency and returns amount in target currency
     * @param sourceCurrency currency of input amount
     * @param targetCurrency 
     * @param amount amount to be converted
     * @returns amount in targetCurrency
     */
    function convertCurrency(sourceCurrency: string, targetCurrency: string, amount: number) {
      let amountInEUR = amount/currencyObject.rates[sourceCurrency]
      // console.log(amountInEUR);
      
      let result = amountInEUR * currencyObject.rates[targetCurrency]
      return Math.round(result)
    }
    /**
     * This function checks if all the inputs required to make the currency convertion are valid
     * @returns true if valid and false if not valid
     */
    function allInputsAreValid() {
      return (source != '' && target != '' && sourceAmount !="")
    }
    useEffect(()=>{
      if(allInputsAreValid()){
        setConvertedAmount(convertCurrency(source,target,sourceAmount))
      }
    }, [target, source, sourceAmount])
    


  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
          style={backgroundStyle} >
        <View
          style={styles.mainContainer}

        >
          <View>
          <Text>Source Amount</Text>
          <TextInput style={styles.textInput}
          defaultValue={`${sourceAmount}`}
          keyboardType='numeric' onChangeText={(entry)=>{
            setSourceAmount(entry)
          }} />
          <Text>Select Source Currency</Text>
          <SelectDropdown
            data={currencyList}
            onSelect={(selectedItem, index) => {
              console.log(selectedItem, index)
              setSource(selectedItem)
            }}
            buttonTextAfterSelection={(selectedItem, index) => {

              // text represented after item is selected
              // if data array is an array of objects then return selectedItem.property to render after item is selected
              return selectedItem
            }}
            rowTextForSelection={(item, index) => {
              // text represented for each item in dropdown
              // if data array is an array of objects then return item.property to represent item in dropdown
              return item
            }}
            buttonStyle={{ width: '100%' }}
            search={true}
            searchPlaceHolder='Enter Currency'
            dropdownStyle={{borderRadius:5}}
            statusBarTranslucent={true}
          />
          </View>
          
          <View>
            <Text>Target Amount</Text>
            <TextInput style={styles.textInput
            } keyboardType='numeric' value={`${convertedAmount != 'undefined' ? convertedAmount : ""} ${target}`} />
            <Text>Select Target Currency</Text>
            <SelectDropdown
              data={currencyList}
              onSelect={(selectedItem, index) => {
                console.log(selectedItem, index)
                setTarget(selectedItem)
              }}
              buttonTextAfterSelection={(selectedItem, index) => {
                // text represented after item is selected
                // if data array is an array of objects then return selectedItem.property to render after item is selected
                return selectedItem
              }}
              rowTextForSelection={(item, index) => {
                // text represented for each item in dropdown
                // if data array is an array of objects then return item.property to represent item in dropdown
                return item
              }}
              buttonStyle={{ width: '100%' }}
              search={true}
              searchPlaceHolder='Enter Currency'
              dropdownStyle={{borderRadius:5}}
              statusBarTranslucent={true}
            />
          </View>


        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    padding: 20,
    backgroundColor: "#fff",
  },
  textInput: {
    borderWidth: 2,
    borderRadius: 5,
    marginBottom: 10,
    padding: 13
  }
});

export default App;
