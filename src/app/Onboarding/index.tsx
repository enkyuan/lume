// TODO: add the following steps to onboarding:
// a. pick username (verify it's unique)
// b. select institution
// c. select year
// d. select major

import React from 'react'
import { Pressable } from 'react-native'
import { Stack, useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native'

import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'

import { NotFoundScreen } from '@/app/NotFound'

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ title: 'Onboarding' }} />
      <SafeAreaView>
        <ThemedText type="title">Onboarding Screen</ThemedText>
        <Pressable onPress={() => NotFoundScreen}>
          <ThemedText type="link">Go to not found screen!</ThemedText>
        </Pressable>
      </SafeAreaView>
    </>
  );
}
