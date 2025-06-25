import { useFonts } from "expo-font";
import { BowlbyOne_400Regular } from "@expo-google-fonts/bowlby-one";
import {
  Nunito_300Light,
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
  Nunito_900Black,
} from "@expo-google-fonts/nunito";

export function useFontLoader() {
  const [fontsLoaded] = useFonts({
    // Gaming/Header font - bold and impactful for titles and emphasis
    BowlbyOne_400Regular,

    // Body font - versatile and readable for all other text
    Nunito_300Light,
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    Nunito_900Black,
  });

  return fontsLoaded;
}
