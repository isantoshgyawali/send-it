import { useEffect, useState } from "react";
import { Alert, Modal, Pressable, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useBearStore } from "../zustandStore";
import { UserDbOperations } from "../db/User";

export default function Menu({isVisible, onClose} : {isVisible: boolean, onClose: () => void}) {
    const user = useBearStore((state) => state.userData) 
    const setUser = useBearStore((state) => state.setUserData)

    const [visible, setVisible] = useState<boolean>(false)
    const [mail, setMail] = useState<string>(user?.email ?? '')
    const [appPassword, setAppPassword] = useState<string>('')

    useEffect(() => {
        console.log(user)
        if(user && user.email !== mail) {
            setMail(user.email)
        }
        console.log(user)
    }, [user])

    const updateUserData = async (newMail: string, newAppPassword: string) => {
        if(!user) return;
        const {data, error} = await UserDbOperations.updateUser(newMail, newAppPassword)
        if(error) {
            console.log(error)
            return 
        }

        if(data) {
            setUser(data)
        }
    }

    return (
        <Modal
            visible={isVisible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <Pressable
                className="flex-1 bg-black/30"
                onPress={onClose}
            >
                <View className="flex-1 justify-center items-center">
                    <View className="bg-white w-3/4 rounded-3xl shadow-lg py-3 px-7">
                        <TouchableOpacity 
                            className="py-5"
                            onPress={() => Alert.alert(
                                "Update mail",
                                "Do you want to update mail?",
                                [
                                    {text: "Cancel", style: "cancel"},
                                    {text: "Yeah ofc", style: "default", onPress: () => setVisible(true)}
                                ]
                            )}
                        >
                            <Text className="text-blue-500 font-bold text-center">
                                {mail}
                            </Text>
                        </TouchableOpacity>
                        <View className="h-px bg-gray-300"></View>

                        <TouchableOpacity className="py-5">
                            <Text className="text-center text-black font-semibold">
                                List Schedules
                            </Text>
                        </TouchableOpacity>
                        <View className="h-px bg-gray-300"></View>

                        <TouchableOpacity className="py-5">
                            <Text className="text-center text-black font-semibold">
                                Saved Emails
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Pressable>

            <Modal 
                visible={visible} 
                transparent 
                animationType="fade"
            >
                <Pressable 
                    className="flex-1 justify-center items-center bg-black/30"
                    onPress={() => setVisible(false)}
                >
                    <View className="bg-white w-3/4 px-5 py-10 rounded-3xl shadow-lg">
                        <Text className="text-lg font-semibold mb-3">Enter New Email</Text>
                        <TextInput
                            className="border p-2 rounded-md mb-5"
                            placeholder="Receiving E-mail"
                            keyboardType="email-address"
                            onChangeText={(item) => setMail(item)}
                        />
                        <TextInput
                            className="border p-2 rounded-md mb-5"
                            placeholder="Receiving E-mail"
                            keyboardType="email-address"
                            onChangeText={(item) => setAppPassword(item)}
                        />
                        <TouchableOpacity
                            className="bg-blue-500 p-1.5 rounded-lg"
                            onPress={async () => {
                                setVisible(false)
                                updateUserData(mail, appPassword)
                            }}
                        >
                            <Text className="text-white text-center font-black text-xl">save</Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Modal>
        </Modal>
    )
}
