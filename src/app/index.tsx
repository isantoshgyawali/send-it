import { useEffect, useState } from "react";
import { router } from "expo-router";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import Menu from "@/store/components/menu";
import {Feather} from "@expo/vector-icons"
import { TemplateProps, UserProps, useBearStore } from "@/store/zustandStore";
import { UserDbOperations } from "@/store/db/User";
import { TemplateDbOperations } from "@/store/db/Templates";

export default function Page() {
    const [isVisible, setVisible] = useState<boolean>(false)
    const [email, setEmail] = useState<string>()
    const [name, setName] = useState<string>()
    const [activeInput, setActiveInput] = useState<'email' | 'name'>('email')
    const [templateIndex, setTemplateIndex] = useState<number>(0)

    const setTemplates = useBearStore((state) => state.setTemplates)
    const setUserData = useBearStore((state) => state.setUserData)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    {data: users, error},
                    { data: userData, error: userError },
                    { data: templates, error: templateError }
                ]= await Promise.all([
                        UserDbOperations.getAllUser(),
                        UserDbOperations.getUser("sideone1917@gmail.com"),
                        TemplateDbOperations.getAllTemplates(),
                    ]);

                if (userError) console.log("User Fetch Error: ", userError);
                if (templateError) console.log("Template Fetch Error: ", templateError);

                if (userData) setUserData(userData);
                if (templates) setTemplates(templates);
            } catch (error) {
                console.log("Unexpected Error: ", error);
            }
        };

        fetchData();
    }, []);

    const Templates = [
        {"id" : 1, "title": "hello hello", "content": "Something Something..."},
        {"id" : 2, "title": "there there", "content": "Anything Anything..."},
    ]

    return (
        <ScrollView className="flex flex-1">
            <View className="w-full p-10 h-auto flex-row justify-between top-0">
                <Text className="font-black text-blue-500 text-2xl">Let's GO!</Text>
                <TouchableOpacity onPress={() => setVisible(true)}>
                    <Feather name="grid" size={24}/>
                </TouchableOpacity>
            </View>
            <View className="flex-1 p-10 flex items-center">
                <View className="w-3/4">
                    <TextInput
                        placeholder="Receiving E-mail"
                        onFocus={() => setActiveInput('email')}
                        keyboardType="email-address"
                        value={email}
                        onChangeText={(item) => setEmail(item)}
                        placeholderTextColor={activeInput === "email" ? "#3b82f6" : "#0007"}
                        className={`border-2 ${activeInput === "email" ? 'border-blue-500 text-blue-500' : 'border-gray-200'} border-b-4 px-5 rounded-xl`}
                    />
                    <TextInput
                        placeholder="Receiver Name"
                        placeholderTextColor={activeInput === "name" ? "#3b82f6" : "#0007"}
                        onFocus={() => setActiveInput('name')}
                        className={`border-2 ${activeInput === "name" ? 'border-blue-500 text-blue-500' : 'border-gray-200'} border-b-4 px-5 rounded-xl mt-5`}
                    />

                    <Text className="text-sm mt-5 text-gray-400">
                        choose the template you wish to use. You may view and edit before 
                        sending it or scheduling it. You can define upto 3 additional templates.
                    </Text>
                </View>

                <View className="flex-wrap flex-row mt-10 gap-5">
                    {/* Adding one empty index at end */}
                    {[...Templates, null].map((item, i, arr) => {
                        if(item) {
                            return (
                                <TouchableOpacity
                                    key={i}
                                    onPress={() => i !== arr.length - 1 && setTemplateIndex(i)}
                                    className={`h-44 w-[47%] border ${templateIndex === i? 'border-blue-500 bg-blue-50' : 'border-gray-500 bg-gray-50'} rounded-3xl`}
                                >
                                    {i === arr.length - 1 ? (
                                        <View className="flex-1 items-center justify-center">
                                            <Text className="text-4xl text-gray-500">+</Text>
                                        </View> 
                                    ) : (
                                            <View className="px-5 py-4 items-center">
                                                <Text className={`font-bold text-base ${templateIndex === i ? 'text-blue-500' : 'text-gray-500'}`}>Template {i+1}</Text>
                                                <View className={`h-px w-full my-2 ${templateIndex === i ? 'bg-blue-300' : 'bg-gray-300'}`}></View>
                                                <View className="">
                                                    <Text className={`font-bold ${templateIndex === i ? 'text-black' : 'text-gray-500'}`}>Title: {item.title}</Text>
                                                    <Text className="font-bold text-gray-400">Content: {item.content}</Text>
                                                </View>
                                            </View>
                                        )
                                    }
                                </TouchableOpacity>
                            )
                        }
                    })}
                </View>

                <TouchableOpacity 
                    className="flex-row w-full items-center mt-10 justify-center bg-blue-400 p-2 rounded-xl"
                    onPress={() => router.push({
                        pathname: '/next',
                        params: {'name': name, "templateIndex": templateIndex}
                    })}
                >
                    <Text className="text-lg font-extrabold text-white mr-3">Next</Text>
                    <Feather name="arrow-right" size={20} color={"white"}/>
                </TouchableOpacity>
            </View>

            <Menu isVisible={isVisible} onClose={() => setVisible(false)}/>
        </ScrollView>
    );
}
