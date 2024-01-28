import { I18nManager, StyleSheet, Platform } from 'react-native'

// const dynamicStyles = (theme, colorScheme) => {
const colorSet = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: "#ffffff",
  },
  orTextStyle: {
    color: "#151723",
    marginTop: 40,
    marginBottom: 10,
    alignSelf: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#6546d7',
    marginTop: 25,
    marginBottom: 20,
    alignSelf: 'stretch',
    textAlign: 'left',
    marginLeft: 30,
  },
  loginContainer: {
    width: '70%',
    backgroundColor: '#6546d7',
    borderRadius: 25,
    padding: 10,
    marginTop: 30,
    alignSelf: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: '#ffffff',
  },
  placeholder: {
    color: 'red',
  },
  InputContainer: {
    height: 42,
    borderWidth: 1,
    borderColor: '#f5f5f5',
    backgroundColor: "#ffffff",
    paddingLeft: 20,
    color: "#151723",
    width: '80%',
    alignSelf: 'center',
    marginTop: 20,
    alignItems: 'center',
    borderRadius: 25,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },

  facebookContainer: {
    width: '70%',
    backgroundColor: '#4267B2',
    borderRadius: 25,
    padding: 10,
    marginTop: 30,
    alignSelf: 'center',
    alignItems: 'center',
  },
  googleButtonStyle: {
    alignSelf: 'center',
    marginTop: 15,
    padding: 5,
    elevation: 0,
  },
  appleButtonContainer: {
    width: '70%',
    height: 40,
    marginTop: 16,
    alignSelf: 'center',
  },
  facebookText: {
    color: '#ffffff',
    fontSize: 14,
  },
  phoneNumberContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  phoneNumber: {
    color: "#151723",
  },
  forgotPasswordContainer: {
    width: '80%',
    alignSelf: 'center',
    alignItems: 'flex-end',
    marginTop: 8,
  },
  forgotPasswordText: {
    fontSize: 14,
    padding: 4,
    color: '#151723',
  },
  backArrowStyle: {
    resizeMode: 'contain',
    tintColor: '#6546d7',
    width: 25,
    height: 25,
    marginTop: Platform.OS === 'ios' ? 50 : 20,
    marginLeft: 10,
    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
  },
})
// }

export default colorSet
