import React, { useCallback, useEffect, useState } from "react";
import { Link, Stack, useRouter } from "expo-router";
import { View, Text, Pressable, StyleSheet, Platform, useColorScheme, useWindowDimensions } from "react-native";
import { SafeAreaView, SafeAreaInsetsContext } from "react-native-safe-area-context";
import { BorderlessButton, FlatList, RectButton } from "react-native-gesture-handler";
import { LineChart } from 'react-native-wagmi-charts';
import * as haptics from 'expo-haptics';
import { DateTime } from "luxon";
import { PulseIndicator } from 'react-native-indicators';

import { useApiContext } from "../context/auth";
import { useColors, useStyle } from "../hooks/useStyle";
import AddWebsite from "../components/AddWebsite";
import { getSites } from "../utils/websiteManager";
import { useAxios } from "../hooks/useAxios";
import { useInterval } from "../hooks/useInterval";
import Ionicons from "@expo/vector-icons/Ionicons";
import SiteCard from "../components/SiteCard";

function invokeHaptic() {
  haptics.impactAsync(haptics.ImpactFeedbackStyle.Light);
}

export default function Index() {
  const { apiKey } = useApiContext()
  const insets = React.useContext(SafeAreaInsetsContext);
  const colorScheme = useColorScheme()
  const windowDimensions = useWindowDimensions()
  const router = useRouter();
  const colors = useColors()
  const style = useStyle()
  const axios = useAxios()

  const [sites, setSites] = useState<string[]>([])
  const [siteData, setSiteData] = useState<{ [key: string]: any }>({})
  const [reloading, setReloading] = useState<boolean>(false)

  const fetchhSites = async () => {
    let siteData: { [key: string]: any } = {}

    for (const site of sites) {
      const res = await axios.get('/api/v1/stats/timeseries', {
        params: {
          site_id: site,
          period: '7d',
        }
      })

      const prev = await axios.get('/api/v1/stats/timeseries', {
        params: {
          site_id: site,
          period: '7d',
          date: DateTime.now().minus({ days: 7 }).toFormat('yyyy-MM-dd')
        }
      })

      const live = await axios.get('/api/v1/stats/realtime/visitors', {
        params: {
          site_id: site,
        }
      })

      siteData[site] = {
        live: live.data,
        current: res.data.results.map((result: any) => {
          return {
            timestamp: new Date(result.date).getTime(),
            value: result.visitors,
          }
        }),
        previous: prev.data.results.map((result: any) => {
          return {
            timestamp: new Date(result.date).getTime(),
            value: result.visitors,
          }
        })
      }
    }

    setSiteData(siteData)
  }

  const fetchLive = async () => {
    let newSiteData: { [key: string]: any } = JSON.parse(JSON.stringify(siteData))

    for (const site of sites) {
      const res = await axios.get('/api/v1/stats/realtime/visitors', {
        params: {
          site_id: site,
        }
      })

      if (newSiteData[site] == null) {
        newSiteData[site] = {
          live: res.data,
        }
      } else {
        newSiteData[site].live = res.data
      }
    }

    setSiteData(newSiteData)
  }

  useEffect(() => {
    if (!apiKey) return
    fetchhSites()
  }, [sites, apiKey])

  useInterval(() => {
    fetchLive()
  }, 1000 * 10)

  useEffect(() => {
    (async () => {
      const sites = await getSites()
      setSites(sites)
    })()
  }, [])

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Websites',
          headerRight: () => (
            <BorderlessButton onPress={() => {
              router.push('/settings')
            }}>
              <Ionicons
                name={Platform.OS === 'ios' ? 'ios-cog' : 'md-cog'}
                size={24}
                color={colors.text}
              />
            </BorderlessButton>
          ),
        }}
      />

      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View style={{ ...style.page, marginTop: 20 }}>
          <View style={{
            marginHorizontal: -20,
            flex: 1,
          }}>
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
                <SiteCard
                  origin={item}
                  siteData={siteData[item]}
                />
              )}
            />
          </View>

          <AddWebsite
            onAdd={(site) => { }}
          />
        </View>
      </SafeAreaView>
    </>
  )
}

const styles = StyleSheet.create({
  title: {
  }
})