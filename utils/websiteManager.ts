import AsyncStorage from '@react-native-async-storage/async-storage';

export const addSite = async (site: string) => {
  try {
    const sites = await getSites();

    if (sites.includes(site)) {
      return sites;
    }

    sites.push(site);
    await AsyncStorage.setItem('@sites', JSON.stringify(sites));
    return sites;
  } catch (e) {
    console.log(e);
    return false;
  }
}

export const removeSite = async (site: string) => {
  try {
    const sites = await getSites();
    const index = sites.indexOf(site);
    if (index > -1) {
      sites.splice(index, 1);
    }
    await AsyncStorage.setItem('@sites', JSON.stringify(sites));
    return sites;
  } catch (e) {
    console.log(e);
    return false;
  }
}

export const getSites = async () => {
  try {
    const sites = await AsyncStorage.getItem('@sites');
    if (sites == null) {
      return [];
    }

    return JSON.parse(sites);
  } catch (e) {
    console.log(e);
    return [];
  }
}