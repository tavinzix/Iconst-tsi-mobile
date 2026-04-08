import tema from '@/utils/tema';
import { Tabs } from 'expo-router'
import { Text, View, StyleSheet } from 'react-native'
import { Icon, useTheme } from "react-native-paper";

export default function TabLayout() {
    const theme = useTheme();

    return (
        <Tabs screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: tema.colors.primary,
            tabBarInactiveTintColor: '#aaa',
            tabBarLabelStyle: {
                fontSize: 11,
                fontWeight: '500',
            },
        }}>
          
            <Tabs.Screen name="home" options={{
                title: 'Inicio',
                tabBarIcon: ({ focused }) => (
                    <View style={{ alignItems: 'center' }}>
                        <Icon source="home" size={20} color={focused ? theme.colors.primary : theme.colors.outline} />
                        {focused && (<View style={styles.abaAtiva} />)}
                    </View>
                ),
            }}/>

            <Tabs.Screen name="categorias" options={{
                title: 'Categorias',
                tabBarIcon: ({ focused }) => (
                    <View style={{ alignItems: 'center' }}>
                        <Icon source="view-grid" size={20} color={focused ? theme.colors.primary : theme.colors.outline} />
                        {focused && (<View style={styles.abaAtiva} />)}
                    </View>
                ),
            }}/>

            {/* TODO: adicionar badge com quantidade de itens no carrinho */}
            <Tabs.Screen name="carrinho" options={{
                title: 'Carrinho',
                tabBarIcon: ({ focused }) => (
                    <View style={{ alignItems: 'center' }}>
                        <Icon source="cart-outline" size={20} color={focused ? theme.colors.primary : theme.colors.outline} />
                        {focused && (<View style={styles.abaAtiva} />)}
                    </View>
                ),
            }}/>

            <Tabs.Screen name="pedidos" options={{
                title: 'Pedidos',
                tabBarIcon: ({ focused }) => (
                    <View style={{ alignItems: 'center' }}>
                        <Icon source="receipt-text-outline" size={20} color={focused ? theme.colors.primary : theme.colors.outline} />
                        {focused && (<View style={styles.abaAtiva} />)}
                    </View>
                ),
            }}/>

            <Tabs.Screen name="perfilUsuario" options={{
                title: 'Perfil',
                tabBarIcon: ({ focused }) => (
                    <View style={{ alignItems: 'center' }}>
                        <Icon source="account" size={20} color={focused ? theme.colors.primary : theme.colors.outline} />
                        {focused && (<View style={styles.abaAtiva} />)}
                    </View>
                ),
            }}/>
        </Tabs>
    )
}

const styles = StyleSheet.create({
    abaAtiva: {
        width: 10,
        height: 4,
        borderRadius: 2,
        backgroundColor: tema.colors.primary,
        marginTop: 2,
    },
})