import { createStyles } from '../styles/globals'
import { lightColorsPallete, darkColorsPallete } from '../styles/colors'
import { useColorScheme } from 'react-native';

export function useStyle() {
  const colorScheme = useColorScheme();

  const colors = colorScheme === 'dark' ? darkColorsPallete : lightColorsPallete;

  return createStyles({ colors });
}

export function useColors() {
  const colorScheme = useColorScheme();

  const colors = colorScheme === 'dark' ? darkColorsPallete : lightColorsPallete;

  return colors;
}