import { StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import {useEffect, useState} from "react";
import {clearAllStorage, getFromStorage, saveToStorage} from "@/scripts/db";
import {useRouter} from "expo-router";

export default function TabOneScreen() {
  const [user, setUser] = useState<{ name: string; age: number } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      //await clearAllStorage();
      //await saveToStorage("user", {name: "John Doe", age: 30});
      const userData = await getFromStorage<{ name: string; age: number }>("user");
      if(userData){
        setUser(userData);
      }
      else{
        alert("You is not logged in. U Finna log in twin.");
        router.push("/signup");
      }
    };
    fetchUser();
  }, []);


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Feed</Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
