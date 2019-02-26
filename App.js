import React, {
  Component
} from 'react'
import {
  Platform,
  TouchableOpacity,
  Dimensions,
  BackHandler,
  View,
  Text,
  StyleSheet,
  Alert,
  WebView
} from 'react-native'
// import { WebView } from "react-native-webview";


const ScreenWidth = Dimensions.get('window').width;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.webView = null;
    this.state = {
      flag: false,
      isLogin: false,
      canGoBack: false,
      canGoForward: false,
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
    if (this.state.canGoBack) {
      this.refWeb.goBack();
    } else {
      this.props.navigation.goBack(null)
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

  _onShouldStartLoadWithRequest = (event) => {
    // Implement any custom loading logic here, don't forget to return!
    return true;
  };

  // react native ======> webView 向html发送数据
  _postMessage = () => {
    this.webView.postMessage("react native ====> webView");
  }

  // react native <====== webview 接收HTML发出的数据
  _onMessage(event) {
    console.log("webview", event);
    Alert.alert(event.nativeEvent.data)
  }

  render() {
    // let injectedJavaScript = `window.alert('this is injectedJavaScript')`
    let injectedJavaScript = `document.getElementsByTagName('button')[0].addEventListener('click', function() {
   window.alert('this is injectedJavaScript') });`
    return (
      <View
        style={ styles.box }>
        <WebView ref={ (webView) => this.webView = webView }
                 javaScriptEnabled={ true }
                 domStorageEnabled={ true }
                 injectedJavaScript={ injectedJavaScript }
                 onNavigationStateChange={ this.onNavigationStateChange }
                 scrollEnabled={ false }
                 onMessage={ this._onMessage }
                 source={ { uri: `https://youzan.github.io/vant/mobile#/zh-CN/` } }
                 style={ {
                   width: '100%',
                   height: '50%'
                 } }
        />
        <TouchableOpacity
          activeOpacity={ 0.5 }
          onPress={ this._postMessage }
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
  },
  container: {
    width: ScreenWidth
  }
});
