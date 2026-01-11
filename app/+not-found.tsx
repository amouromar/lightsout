import { Link, Stack } from 'expo-router';
import { Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Container } from '@/components/Container';

export default function NotFoundScreen() {
  return (
    <View className={styles.container}>
      <Stack.Screen options={{ title: 'Oops!', headerShown: false }} />
      <Container>
        <View className="flex-1 items-center justify-center">
          <View className="mb-6 h-24 w-24 items-center justify-center rounded-3xl border border-white/5 bg-surface">
            <MaterialCommunityIcons name="alert-circle-outline" size={48} color="#6366f1" />
          </View>

          <Text className={styles.title}>Something&apos;s missing</Text>
          <Text className="mb-8 mt-2 max-w-[250px] text-center font-outfit text-gray-400">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </Text>

          <Link href="/" className={styles.link}>
            <View className="flex-row items-center rounded-full bg-primary px-8 py-4 shadow-lg">
              <MaterialCommunityIcons
                name="home-variant"
                size={20}
                color="white"
                className="mr-2"
              />
              <Text className={styles.linkText}>Return Home</Text>
            </View>
          </Link>
        </View>
      </Container>
    </View>
  );
}

const styles = {
  container: `flex flex-1 bg-background`,
  title: `text-2xl font-outfit-bold text-white`,
  link: `mt-4`,
  linkText: `text-base font-outfit-bold text-white ml-2`,
};
