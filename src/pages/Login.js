/**
 * Created by ljunb on 2017/2/22.
 */
import React, {PureComponent} from "react";
import {Image, Platform, Text, TextInput, ToastAndroid, TouchableOpacity, View} from "react-native";
import Header from "../components/LoginHeader";
import {inject, observer} from "mobx-react/native";
import Storage from "../store/MyStorage";
import Toast from 'react-native-root-toast'
import StyleSheet from "../common/StyleSheet";

@inject('app')
@observer
export default class Login extends PureComponent {

    componentWillMount() {
        const {app} = this.props
        app.barStyle === 'light-content' && app.updateBarStyle('default')
        this.state = {
            loginText: '登录',
            registerText: '马上加入',
            noAccount: '没有以上帐号?',
            usernamePlaceHoler: '请输入帐号',
            passwordPlaceHoler: '请输入密码',
            username : null,
            password: null
        }

        this.post = (url,data,callback) => {
            let formData = new FormData()
            for(let attr in data){
                formData.append(attr,data[attr])
            }

            let options = {
                method: 'POST',
                headers: {},
                body: formData
            }

            fetch(url,options).then((response) => response.text()).then((responseText) => {
                callback(JSON.parse(responseText))
            }).done()
        }
    }


    onBack = () => {
        const {navigator, onResetBarStyle} = this.props
        onResetBarStyle && onResetBarStyle()
        navigator.pop()
    }

    onPress = () =>{
        const {navigator} = this.props
        let username = this.state.username
        let password = this.state.password
        data = {
            username: username,
            password: password
        }
        url = gIntent.ip+'/api/login'
        this.post(url,data,(datas)=>{
            let message = datas.message
            let status = datas.status
            let data = datas.data
            if(Platform.OS === 'ios'){
                // Add a Toast on screen.
                let toast = Toast.show(message, {
                    duration: Toast.durations.LONG,
                    position: Toast.positions.CENTER,
                    shadow: true,
                    animation: true,
                    hideOnPress: true,
                    delay: 0,
                    onShow: () => {
                        // calls on toast\`s appear animation start
                    },
                    onShown: () => {
                        // calls on toast\`s appear animation end.
                    },
                    onHide: () => {
                        // calls on toast\`s hide animation start.
                    },
                    onHidden: () => {
                        // calls on toast\`s hide animation end.
                    }
                });

                // You can manually hide the Toast, or it will automatically disappear after a `duration` ms timeout.
                setTimeout(function () {
                    Toast.hide(toast);
                }, 1000);
            }else if(Platform.OS === 'android'){
                ToastAndroid.show(message,ToastAndroid.SHORT)
            }

            if(status == "0"){
                Storage.save('data',JSON.stringify(data),null)
                setTimeout(() =>{
                    navigator.push({id : "TabBarView"})
                },500)
                this.props.isConnected = true
            }else{
                this.state.password = ""
            }
        })
    }


    _renderAccountView = (account, key) => {
        const {name, icon} = account
        return (
            <TouchableOpacity
                activeOpacity={0.75}
                key={`${name}-${key}`}
                onPress={()=>alert(name)}
                style={styles.accountItem}
            >
                <Image style={{width: 50, height: 50, marginBottom: 5}} source={icon}/>
                <Text style={{color: '#999999', fontSize: 13}}>{name}</Text>
            </TouchableOpacity>
        )
    }

    render() {
        var param = "";

        return (
            <View style={{flex: 1, backgroundColor: '#f5f5f5'}}>
                <Header title={this.state.loginText} onBack={this.onBack}/>
                <View style={styles.content}>
                    <View style={styles.accountWrapper}>
                        <TextInput style={styles.textInput} value={this.state.username} placeholder={this.state.usernamePlaceHoler} underlineColorAndroid='transparent' onChangeText={(text)=>{
                            this.state.username = text
                        }}></TextInput>
                    </View>
                    <View style={styles.accountWrapper}>
                        <TextInput secureTextEntry={true} style={styles.textInput} value={this.state.password} underlineColorAndroid='transparent'  placeholder={this.state.passwordPlaceHoler} onChangeText={(text) =>{
                            this.state.password = text
                        }}></TextInput>
                    </View>
                    <TouchableOpacity
                        activeOpacity={0.75}
                        style={styles.btn}
                        onPress={this.onPress}
                    >
                        <Text style={{fontSize: 16, color: '#000'}}>{this.state.loginText}</Text>
                    </TouchableOpacity>
                    <Text style={{textAlign: 'right',marginRight: 20,marginTop: 10}}>
                        <Text style={{fontSize: 16,marginRight: 10}}>{this.state.noAccount}</Text>
                        <Text style={{fontSize: 16, color: 'red',marginLeft: 10}} onPress={()=> alert('regist')}>{this.state.registerText}</Text>
                    </Text>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    content: {
        paddingTop: 50
    },
    textInput: {
        width: gScreen.width * 0.9,
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 20,
        borderColor: "#fff",
        backgroundColor: '#fff',
        justifyContent: 'center'
    },
    accountWrapper: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingTop: 15,
        paddingBottom: 30,
        justifyContent: 'space-between',
    },
    accountItem: {
        alignItems: 'center'
    },
    btn: {
        width: gScreen.width * 0.9,
        alignSelf: 'center',
        marginTop: 20,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    registerBtn: {
        width: gScreen.width * 0.9,
        marginTop: 20,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center'
    }
})