import React, { useState } from 'react'
import {
  Image,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { useNavigation } from '@react-navigation/core'
import appleAuth, {
  AppleButton,
} from '@invertase/react-native-apple-authentication'
import IMGoogleSignInButton from '../components/IMGoogleSignInButton/IMGoogleSignInButton'
import { useDispatch, Provider } from 'react-redux'
import {
  useTranslations,
  ActivityIndicator,
  Alert,
} from '../dopebase'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import colorSet from './styles'
import { setUserData } from '../redux/auth'
import { localizedErrorMessage } from '../api/ErrorCode'
import { useOnboardingConfig } from '../hooks/useOnboardingConfig'
import { useAuth } from '../hooks/useAuth'
import rootReducer from '../redux/reducers'
import { createStore } from 'redux'

const LoginScreenWrapper = () => {
  const store = createStore(rootReducer);
  <Provider store={store}>
    <LoginScreen/>
  </Provider>
}

const LoginScreen = () => {
  const store = createStore(rootReducer);
  const navigation = useNavigation()
  const authManager = useAuth()
  const dispatch = useDispatch()

  const { localized } = useTranslations()
  // const { theme, appearance } = useTheme()
  const { config } = useOnboardingConfig()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onPressLogin = () => {
    setLoading(true)
    authManager
      .loginWithEmailAndPassword(
        email && email.trim(),
        password && password.trim(),
        config,
      )
      .then(response => {
        if (response?.user) {
          const user = response.user
          dispatch(setUserData({ user }))
          Keyboard.dismiss()
          if (user?.role === 'admin') {
            navigation.reset({
              index: 0,
              routes: [{ name: 'AdminStack', params: { user } }],
            })
          } else {
            navigation.reset({
              index: 0,
              routes: [{ name: 'MainStack', params: { user } }],
            })
          }
        } else {
          setLoading(false)
          Alert.alert(
            '',
            localizedErrorMessage(response.error, localized),
            [{ text: localized('OK') }],
            {
              cancelable: false,
            },
          )
        }
      })
  }

  const onFBButtonPress = () => {
    setLoading(true)
    authManager
      .loginOrSignUpWithFacebook(config)
      .then(response => {
        setLoading(false)
        if (response?.user) {
          const user = response.user
          dispatch(setUserData({ user }))
          Keyboard.dismiss()
          if (user?.role === 'admin') {
            navigation.reset({
              index: 0,
              routes: [{ name: 'AdminStack', params: { user } }],
            })
          } else {
            navigation.reset({
              index: 0,
              routes: [{ name: 'MainStack', params: { user } }],
            })
          }
        } else {
          Alert.alert(
            '',
            localizedErrorMessage(response.error, localized),
            [{ text: localized('OK') }],
            {
              cancelable: false,
            },
          )
        }
      })
      .catch(error => {
        setLoading(false)
        console.log('error', error)
        Alert.alert(
          '',
          localizedErrorMessage(error, localized),
          [{ text: localized('OK') }],
          {
            cancelable: false,
          },
        )
      })
  }

  const onGoogleButtonPress = () => {
    setLoading(true)
    authManager
      .loginOrSignUpWithGoogle(config)
      .then(response => {
        setLoading(false)
        if (response?.user) {
          const user = response.user
          dispatch(setUserData({ user }))
          Keyboard.dismiss()
          navigation.reset({
            index: 0,
            routes: [{ name: 'MainStack', params: { user } }],
          })
        } else {
          setLoading(false)
          Alert.alert(
            '',
            localizedErrorMessage(response.error, localized),
            [{ text: localized('OK') }],
            {
              cancelable: false,
            },
          )
        }
      })
      .catch(error => {
        setLoading(false)
        Alert.alert(
          '',
          localizedErrorMessage(error, localized),
          [{ text: localized('OK') }],
          {
            cancelable: false,
          },
        )
      })
  }

  const onAppleButtonPress = async () => {
    setLoading(true)
    authManager.loginOrSignUpWithApple(config).then(response => {
      if (response?.user) {
        const user = response.user
        dispatch(setUserData({ user }))
        Keyboard.dismiss()
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainStack', params: { user } }],
        })
      } else {
        setLoading(false)
        Alert.alert(
          '',
          localizedErrorMessage(response.error, localized),
          [{ text: localized('OK') }],
          {
            cancelable: false,
          },
        )
      }
    })
  }

  const onForgotPassword = async () => {
    navigation.push('ResetPassword', {
      isResetPassword: true,
    })
  }

  const appleButtonStyle = config.isAppleAuthEnabled
    ? {
        dark: AppleButton?.Style?.WHITE,
        light: AppleButton?.Style?.BLACK,
        'no-preference': AppleButton?.Style?.WHITE,
      }
    : {}

  return (
      <View style={colorSet.container}>
        <KeyboardAwareScrollView
          style={{ flex: 1, width: '100%' }}
          keyboardShouldPersistTaps="always">
          <TouchableOpacity
            style={{ alignSelf: 'flex-start' }}
            onPress={() => navigation.goBack()}>
            <Image style={colorSet.backArrowStyle} source={require("../assets/icons/backArrow.png")} />
          </TouchableOpacity>
          <Text style={colorSet.title}>{localized('Sign In')}</Text>
          <TextInput
            style={colorSet.InputContainer}
            placeholder={localized('E-mail')}
            keyboardType="email-address"
            placeholderTextColor="#aaaaaa"
            onChangeText={text => setEmail(text)}
            value={email}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />
          <TextInput
            style={colorSet.InputContainer}
            placeholderTextColor="#aaaaaa"
            secureTextEntry
            placeholder={localized('Password')}
            onChangeText={text => setPassword(text)}
            value={password}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />
          {config.forgotPasswordEnabled && (
            <View style={colorSet.forgotPasswordContainer}>
              <TouchableOpacity onPress={() => onForgotPassword()}>
                <Text style={colorSet.forgotPasswordText}>
                  {localized('Forgot password?')}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          <TouchableOpacity
            style={colorSet.loginContainer}
            onPress={() => onPressLogin()}>
            <Text style={colorSet.loginText}>{localized('Log In')}</Text>
          </TouchableOpacity>
          {config.isFacebookAuthEnabled && (
            <>
              <Text style={colorSet.orTextStyle}> {localized('OR')}</Text>
              <TouchableOpacity
                style={colorSet.facebookContainer}
                onPress={() => onFBButtonPress()}>
                <Text style={colorSet.facebookText}>
                  {localized('Login With Facebook')}
                </Text>
              </TouchableOpacity>
            </>
          )}
          {config.isGoogleAuthEnabled && (
            <IMGoogleSignInButton
              containerStyle={colorSet.googleButtonStyle}
              onPress={onGoogleButtonPress}
            />
          )}
          {config.isAppleAuthEnabled && appleAuth.isSupported && (
            <AppleButton
              cornerRadius={25}
              style={colorSet.appleButtonContainer}
              buttonStyle={appleButtonStyle[appearance]}
              buttonType={AppleButton.Type.SIGN_IN}
              onPress={() => onAppleButtonPress()}
            />
          )}
          {config.isSMSAuthEnabled && (
            <TouchableOpacity
              style={colorSet.phoneNumberContainer}
              onPress={() => navigation.navigate('Sms', { isSigningUp: false })}>
              <Text style={colorSet.phoneNumber}>
                {localized('Login with phone number')}
              </Text>
            </TouchableOpacity>
          )}
          {loading && <ActivityIndicator />}
        </KeyboardAwareScrollView>
      </View>
  )
}

export default LoginScreenWrapper
