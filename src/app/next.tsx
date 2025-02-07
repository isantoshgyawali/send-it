import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Feather } from "@expo/vector-icons"

export default function Next() {
    const [activeInput, setActiveInput] = useState<boolean>(true)
    const [title, setTitle] = useState<string>('')

    const params = useLocalSearchParams<{
        email: string;
        name: string;
        templateIndex: string;
    }>();
    const {email, name, templateIndex} = params

    return (
        <ScrollView className="flex-1">
            <View className="py-12 items-center justify-center">
                <View className="w-5/6">
                    <Text className="text-sm mt-5 text-gray-400">
                        Review/Edit your email before scheduling or sending. 
                    </Text>

                    <View
                        className={`border-2 p-7 ${activeInput ? 'border-blue-500 text-blue-500' : 'border-gray-200'} px-5 mt-7 rounded-xl`}
                    >
                        <View className="flex-row items-center">
                            <Text className={`font-extrabold text-xl text-blue-500`}>Template {Number(templateIndex) + 1}</Text>
                            <View className={`h-7 aspect-video my-2 bg-blue-100 ml-3 rounded-xl items-center justify-center`}>
                                <Feather name="repeat" size={15} color={"#3b82f6"}/>
                            </View>
                        </View>
                        <View className={`h-px w-full my-3 ${activeInput ? 'bg-blue-300' : 'bg-gray-300'}`}></View>

                        <View className="flex-row items-center">
                            <Text className="font-bold text-lg">Title: </Text>
                            <TextInput
                                className="flex-grow"
                                value={title}
                                onChangeText={(item) => setTitle(item)}
                                onFocus={() => setActiveInput(true)}
                                onBlur={() => setActiveInput(false)}
                                placeholderTextColor={activeInput ? "#3b82f6" : "#0007"}
                            />
                        </View>
                        <View className={`h-px w-full my-3 ${activeInput ? 'bg-blue-300' : 'bg-gray-300'}`}></View>
                        <TextInput
                            multiline
                            numberOfLines={50}
                            onFocus={() => setActiveInput(true)}
                            onBlur={() => setActiveInput(false)}
                            value={name}
                            placeholderTextColor={activeInput ? "#3b82f6" : "#0007"}
                        />
                    </View>
                    <View className="flex-row justify-between">
                        <TouchableOpacity 
                            className="flex-row w-[47%] items-center mt-10 justify-center bg-gray-100 border border-blue-500 p-2 rounded-xl"
                            onPress={() => router.push({ pathname: '/' })}
                        >
                            <Text className="text-lg font-extrabold text-blue-500 mr-3">schedule</Text>
                            <Feather name="layout" size={20} color={"#3b82f6"}/>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            className="flex-row w-[47%] items-center mt-10 justify-center bg-blue-400 p-2 rounded-xl"
                            onPress={() => router.push({ pathname: '/' })}
                        >
                            <Text className="text-lg font-extrabold text-white mr-3">Send</Text>
                            <Feather name="arrow-up-right" size={20} color={"white"}/>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}
