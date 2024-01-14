import { BorderlessButton } from "react-native-gesture-handler";
import Card from "./Card";
import { useRouter } from "expo-router";
import { View, Text, useWindowDimensions } from "react-native";
import { PulseIndicator } from "react-native-indicators";
import { LineChart, TLineChartData } from "react-native-wagmi-charts";
import { useColors, useStyle } from "../hooks/useStyle";
import Linear from "../utils/shape/linear";
import Ionicons from "@expo/vector-icons/Ionicons";
import compactNumber from "../utils/compactNumber";
import SVG, { Circle } from "react-native-svg";
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import React, { useEffect } from "react";

const GRAPH_HEIGHT = 120;

interface SiteDataCompact {
  error?: boolean;
  live: number;
  last24h: number;
  current: TLineChartData;
  previous: TLineChartData;
}

interface SiteCardProps {
  origin: string;
  siteData: SiteDataCompact;
}

type RingProgressProps = {
  progress: number;
};

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const RingCircle = ({ progress = 0.5 }: RingProgressProps) => {
  const circumference = 2 * Math.PI * 24;

  const colors = useColors();
  const fill = useSharedValue(0);

  useEffect(() => {
    fill.value = withTiming(progress, { duration: 1500 });
  }, [progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDasharray: [circumference * fill.value, circumference],
  }));

  return (
    <SVG
      style={{
        flex: 1,
        position: "absolute",
        left: 0,
        top: 0,
        transform: [
          {
            rotate: "-90deg",
          },
        ],
      }}
    >
      <Circle
        r={24}
        cx={25}
        cy={25}
        fill="transparent"
        stroke={"gray"}
        strokeWidth={1}
      />

      <AnimatedCircle
        r={24}
        cx={25}
        cy={25}
        fill="transparent"
        stroke={colors.secondaryBackground}
        strokeWidth={1}
        strokeDasharray={[circumference * progress, circumference]}
      />
    </SVG>
  );
};

export default function SiteCard({ origin, siteData }: SiteCardProps) {
  const router = useRouter();
  const windowDimensions = useWindowDimensions();
  const colors = useColors();
  const style = useStyle();

  if (!siteData) return null;

  return (
    <Card
      as={siteData.error ? View : BorderlessButton}
      onPress={() => {
        if (siteData.error) return;
        router.push(`/sites/${origin}`);
      }}
      style={{
        paddingBottom: 0,
      }}
    >
      <View
        style={{
          paddingTop: 15,
          paddingHorizontal: 20,
          paddingBottom: 5,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View>
          <View
            style={{ flexDirection: "row", alignItems: "center", columnGap: 5 }}
          >
            <Text
              style={{
                color: colors.text,
                fontWeight: "bold",
                fontSize: 18,
                marginBottom: 5,
              }}
            >
              {origin}
            </Text>

            {siteData.error ? (
              <View
                style={{
                  flexDirection: "row",
                  marginBottom: 5,
                  alignItems: "center",
                }}
              >
                <Ionicons name="alert-circle" size={18} color={colors.danger} />
                <Text style={{ color: colors.danger }}>
                  Could not fetch site data
                </Text>
              </View>
            ) : null}
          </View>

          <Text style={{ color: colors.text }}>
            <Text style={{ fontWeight: "bold" }}>{siteData.last24h}</Text>{" "}
            visitors in last 24h
          </Text>
        </View>

        <View
          style={{
            // justifyContent: "center",
            alignItems: "center",
            // width: 52,
            // height: 52,
            borderWidth: 1,
            borderColor: "transparent",
            overflow: "visible",
          }}
        >
          {/* <RingCircle progress={0.5} /> */}

          <View
            style={{
              flexDirection: "row",
            }}
          >
            <Text
              style={{
                color: colors.text,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              {compactNumber(siteData.live || 0, 0)}
            </Text>
            <PulseIndicator size={14} color={"green"} style={{ flex: 0, marginLeft: 3 }} />
          </View>
        </View>
      </View>

      <View
        style={{
          height: GRAPH_HEIGHT,
        }}
      >
        {siteData.current && siteData.previous ? (
          <LineChart.Provider
            data={{
              one: siteData.current,
              two: siteData.previous,
            }}
            yRange={{
              min: 0,
              // this moves the graph line to the bottom of the graph if there are no visitors
              // otherwise, the graph line will be in the middle of the graph which looks weird
              max: Math.max(
                siteData.current.reduce(
                  (curMax, point) => Math.max(curMax, point.value),
                  1
                ),
                siteData.previous.reduce(
                  (curMax, point) => Math.max(curMax, point.value),
                  1
                )
              ),
            }}
          >
            <LineChart.Group>
              <LineChart
                id="one"
                height={GRAPH_HEIGHT}
                width={windowDimensions.width - 20}
                shape={Linear}
              >
                <LineChart.Path width={2} color={colors.primary}>
                  <LineChart.Gradient />
                </LineChart.Path>
              </LineChart>
            </LineChart.Group>
          </LineChart.Provider>
        ) : null}
      </View>
    </Card>
  );
}
