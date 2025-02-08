import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";

export default function Menu({isVisible, onClose}) {
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
              <Pressable className="bg-white w-3/4 rounded-3xl shadow-lg py-8 px-7">
                <Text className="text-blue-500 font-bold text-center">
                  something@gmail.com
                </Text>
                <View className="h-px bg-gray-300 my-5"></View>

                <TouchableOpacity className="">
                  <Text className="text-center text-black font-semibold">
                    List Schedules
                  </Text>
                </TouchableOpacity>
                <View className="h-px bg-gray-300 my-5"></View>

                <TouchableOpacity>
                  <Text className="text-center text-black font-semibold">
                    Saved Emails
                  </Text>
                </TouchableOpacity>
              </Pressable>
            </View>
          </Pressable>
        </Modal>
    )
}
