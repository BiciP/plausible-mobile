import { View, Text, Image } from "react-native";
import Card from "./Card";
import { useColors, useStyle } from "../hooks/useStyle";
import { Component } from "react";
import { PlausibleMetrics } from "../app/sites/[siteId]";
import { ScrollView } from "react-native-gesture-handler";

interface StatItem {
  title: string,
  value: number,
  icon?: any,
}

interface StatSectionCardProps {
  metric: PlausibleMetrics,
  title: string,
  items: StatItem[],
}

export default function StatSectionCard({ metric, title, items }: StatSectionCardProps) {
  const style = useStyle()
  const colors = useColors()

  const totalValue = metric === 'bounce_rate' ? 100 : items.reduce((acc, item) => acc + item.value, 0)

  return (
    <Card style={{ flex: 1, padding: 10 }} collapsible={false} shadow={{}}>
      <View style={{ marginBottom: 10 }}>
        <Text style={{ ...style.title, fontSize: 18 }}>
          {title}
        </Text>
      </View>

      <ScrollView style={{ flex: 1 }}>
        <View style={{ rowGap: 6 }}>
          {
            items.map(item => (
              <View
                key={item.title}
                style={{
                  position: 'relative',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                }}
              >
                <View style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: `${(item.value / totalValue) * 100}%`,
                  backgroundColor: colors.primary,
                  opacity: 0.2,
                  borderRadius: 4,
                }} />
                <View style={{ flexDirection: "row", columnGap: 5 }}>
                  <Text>{item.icon}</Text>
                  <Text style={{ ...style.title, fontSize: 14 }}>
                    {item.title}
                  </Text>
                </View>
                <Text style={{ ...style.title, fontSize: 14 }}>
                  {item.value}
                </Text>
              </View>
            ))
          }
          {
            items.length === 0 && (
              <View>
                <Text style={{ ...style.title, fontSize: 20, opacity: .5 }}>
                  No data
                </Text>
              </View>
            )
          }
        </View>
      </ScrollView>
    </Card>
  )
}