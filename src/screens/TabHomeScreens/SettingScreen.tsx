import React, {useMemo} from 'react';
import {View, Button, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {changeTheme, themeState} from '../../redux/reducer/ThemeReducer';
import {RootState} from '../../redux/store/store';
import {signOut} from '../../utils/firebaseHandler';

const SettingScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const currentTheme = useSelector((state: RootState) => state.theme);
  const styles = useMemo(() => createStyle(currentTheme), [currentTheme]);
  return (
    <View style={styles.mainContainer}>
      <Button
        title="click me to change to Color0 "
        onPress={() => {
          dispatch(changeTheme({themeNumber: 0}));
        }}
      />
      <Button
        title="click me to change to Color1 dark "
        onPress={() => {
          dispatch(changeTheme({themeNumber: 1}));
        }}
      />
      <Button
        title="logout"
        onPress={async () => {
          signOut(navigation);
        }}
      />
    </View>
  );
};
export default SettingScreen;

const createStyle = (currentTheme: themeState) => {
  const styles = StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: currentTheme.background,
    },
  });
  return styles;
};
