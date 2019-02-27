import React, {
  Component
} from 'react'
import {
  Platform,
  TouchableOpacity,
  BackHandler,
  View,
  Text,
  StyleSheet,
  Alert,
  // WebView
} from 'react-native'
import { WebView } from "react-native-webview";


export default class App extends Component {
  constructor(props) {
    super(props);
    this.webView = null;
    this.state = {
      canGoBack: false,
      canGoForward: false,
      isPrevent: false,
      url: '',
      status: '',
      loading: false,
      messagesReceivedFromWebView: 0,
      message: ''
    };
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackPress = () => {
    const { canGoBack, isPrevent } = this.state
    console.log(`canGoBack:${canGoBack}, isPrevent:${isPrevent}`)
    // webview isPrevented
    if (isPrevent) {
      this.setState({
        isPrevent: false
      })
      this._postMessage()
    } else if (canGoBack && !isPrevent) { // webview can go back and not prevent
      this.webView.goBack();
    } else {    // webview can't go back, exit app
      BackHandler.exitApp()
    }
    return true;
  }

  onNavigationStateChange = (navState) => {
    console.log(navState)
    this.setState({
      canGoBack: navState.canGoBack,
      canGoForward: navState.canGoForward,
      url: navState.url,
      status: navState.title,
      loading: navState.loading,
    });
  }

  // react native ======> webView 向html发送数据
  _postMessage = (data = { isPrevent: false }) => {
    this.webView.postMessage(JSON.stringify(data));
  }

  // react native <====== webview 接收HTML发出的数据
  _onMessage = (event) => {
    let callBackData = JSON.parse(event.nativeEvent.data)
    console.log(callBackData);
    if (callBackData.isPrevent) {
      this.setState({
        isPrevent: callBackData.isPrevent
      })
    }
  }

  render() {
    const injectedJavascript = `(function() {
    window.postMessage = function(data) {
      window.ReactNativeWebView.postMessage(data);
    };
  })()`;
    return (
      <View
        style={ styles.box }>
        <WebView ref={ (webView) => this.webView = webView }
                 originWhitelist={ ['*'] }
                 javaScriptEnabled={ true }
                 domStorageEnabled={ true }
                //  injectedJavaScript={ injectedJavascript }
                 onNavigationStateChange={ this.onNavigationStateChange }
                 scrollEnabled={ false }
                 onMessage={ this._onMessage }
                 source={ { uri: 'http://192.168.10.44:3000/' } }
                 // source={ { uri: `https://youzan.github.io/vant/mobile.html#/zh-CN/` } }
                 // source={Platform.OS === 'ios' ? require('./index.html') : {uri: 'file:///android_asset/index.html'}}
                 style={ {
                   width: '100%',
                   height: '50%'
                 } }
        />
        <TouchableOpacity
          activeOpacity={ 0.5 }
          onPress={ () => this._postMessage() }
          style={ [{ backgroundColor: '#38acff', marginTop: 10, padding: 5, marginLeft: 5 }] }>
          <Text>rn to html</Text>
        </TouchableOpacity>
      </View>);
  }
}

const styles = StyleSheet.create({
  box: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  }
});
