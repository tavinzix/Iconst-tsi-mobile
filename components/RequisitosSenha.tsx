import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { REQUISITOS_SENHA } from '@/utils/validarSenha';

export default function RequisitossenaBox({ requisitos }: any) {
    const theme = useTheme();

    return (
        <View style={{ ...styles.requisitosBox, backgroundColor: theme.colors.surface }}>
            <Text style={{ ...styles.requisitosTitulo, fontWeight: '600' }}> Requisitos da senha: </Text>
            <View style={styles.requisitosList}>
                {REQUISITOS_SENHA.map((req: any) => (
                    <Text key={req.id} style={{ ...styles.requisitoItem, color: requisitos[req.id] ? '#4CAF50' : theme.colors.onSurfaceVariant, }}>
                        {requisitos[req.id] ? '✓' : '○'} {req.label}
                    </Text>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    requisitosBox: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        marginVertical: 12,
        borderColor: '#E0E0E0',
    },
    requisitosTitulo: {
        marginBottom: 8,
    },
    requisitosList: {
        gap: 6,
    },
    requisitoItem: {
        fontSize: 13,
    },
});
