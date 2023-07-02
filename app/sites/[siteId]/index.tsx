import React from 'react'
import { View, Text } from 'react-native'
import { useSearchParams } from 'expo-router'

export default function SiteDashboard() {
  const { siteId } = useSearchParams()

  if (!siteId) {
    return (
      <View>
        <Text>Missing site ID</Text>
      </View>
    )
  }

  return (
    <View>
      <Text>Site Dashboard</Text>
      <Text>Site ID: {siteId}</Text>
    </View>
  )
}