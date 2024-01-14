import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link, Stack, useRouter } from "expo-router";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
  useColorScheme,
  useWindowDimensions,
  Animated,
  Easing,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  BorderlessButton,
  FlatList,
  RectButton,
} from "react-native-gesture-handler";
import { LineChart } from "react-native-wagmi-charts";
import * as haptics from "expo-haptics";
import { DateTime } from "luxon";
import { PulseIndicator } from "react-native-indicators";

import { useApiContext } from "../context/auth";
import { useColors, useStyle } from "../hooks/useStyle";
import AddWebsite from "../components/AddWebsite";
import { getSites } from "../utils/websiteManager";
import { useAxios } from "../hooks/useAxios";
import { useInterval } from "../hooks/useInterval";
import Ionicons from "@expo/vector-icons/Ionicons";
import SiteCard from "../components/SiteCard";
import { useAtom } from "jotai";
import { pagesAtom } from "../store";
import SVG, { Line } from "react-native-svg";

export default function Index() {
  const refreshInterval = 1000 * 60;

  const { apiKey, baseUrl } = useApiContext();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const windowDimensions = useWindowDimensions();
  const router = useRouter();
  const colors = useColors();
  const style = useStyle();
  const axios = useAxios();

  const [sites, setSites] = useState<string[]>([]);
  const [pages, setPages] = useAtom(pagesAtom);
  const [reloading, setReloading] = useState<boolean>(false);

  const barWidth = useRef(new Animated.Value(0)).current;
  const progressPercent = barWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", `100%`],
  });

  const refreshTiemout = () => {
    let to = setTimeout(fetchhSites, refreshInterval);
    barWidth.setValue(0);
    Animated.timing(barWidth, {
      toValue: 100,
      duration: refreshInterval,
      useNativeDriver: false,
      easing: Easing.linear,
    }).start();
  };

  const fetchhSites = async () => {
    setReloading(true);
    let siteData: { [key: string]: any } = {};

    for (const site of sites) {
      try {
        const res = await axios.get("/api/v1/stats/timeseries", {
          params: {
            site_id: site,
            period: "30d",
          },
        });

        const live = await axios.get("/api/v1/stats/realtime/visitors", {
          params: {
            site_id: site,
          },
        });

        const today = await axios.get("/api/v1/stats/timeseries", {
          params: {
            site_id: site,
            period: "day",
          },
        });

        const yesterday = await axios.get("/api/v1/stats/timeseries", {
          params: {
            site_id: site,
            period: "day",
            date: DateTime.now().minus({ days: 1 }).toFormat("yyyy-MM-dd"),
          },
        });

        let last24h = 0;
        let last24hCutoff =
          DateTime.now().minus({ hours: 24 }).toUnixInteger() * 1000;
        let todayData = today.data.results;
        let yesterdayData = yesterday.data.results;

        for (let datapoint of todayData) {
          last24h += datapoint.visitors;
        }

        for (let datapoint of yesterdayData) {
          let date = new Date(datapoint.date).getTime();
          if (date < last24hCutoff) continue;
          last24h += datapoint.visitors;
        }

        siteData[site] = {
          live: live.data,
          last24h,
          current: res.data.results.map((result: any) => {
            return {
              timestamp: new Date(result.date).getTime(),
              value: result.visitors,
            };
          }),
          previous: [],
        };
      } catch (err) {
        console.log(err);
        siteData[site] = {
          error: true,
          live: 0,
          last24h: "-",
          current: [{ timestamp: 0, value: 0 }],
          previous: [{ timestamp: 0, value: 0 }],
        };
      }

      setReloading(false);
      refreshTiemout();
    }

    setPages(siteData);
  };

  useEffect(() => {
    if (!apiKey) return;
    fetchhSites();
  }, [sites, apiKey, baseUrl]);

  // useInterval(() => {
  //   fetchhSites();
  // }, 1000 * 60 * 1);

  useEffect(() => {
    (async () => {
      const sites = await getSites();
      setSites(sites);
    })();
  }, []);

  return (
    <>
      <Stack.Screen
        options={{
          title: "Websites",
          headerRight: () => (
            <BorderlessButton
              onPress={() => {
                router.push("/settings");
              }}
            >
              <Ionicons
                name={Platform.OS === "ios" ? "ios-cog" : "md-cog"}
                size={24}
                color={colors.text}
              />
            </BorderlessButton>
          ),
        }}
      />

      {/* TODO: This 43 number is very odd, but it works :) */}
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          paddingTop: insets.top + 43,
        }}
      >
        <View style={{ height: 3 }}>
          <Animated.View
            style={{
              backgroundColor: colors.primary,
              height: "100%",
              width: progressPercent,
            }}
          ></Animated.View>
        </View>

        <Text>{reloading ? "rel" : "no-rel"}</Text>

        <View style={{ ...style.page, paddingVertical: 0 }}>
          <View
            style={{
              marginHorizontal: -20,
              flex: 1,
            }}
          >
            <FlatList
              onRefresh={() => {
                // TODO: implement refreshing
              }}
              data={sites}
              style={{
                paddingHorizontal: 20,
                paddingVertical: 10,
                flex: 1,
              }}
              renderItem={({ item }) => (
                <SiteCard origin={item} siteData={pages[item]} />
              )}
              ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            />
          </View>

          <AddWebsite
            onAdd={async () => {
              const sites = await getSites();
              setSites(sites);
            }}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  title: {},
});
