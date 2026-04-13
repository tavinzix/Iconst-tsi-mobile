import { View, StyleSheet } from 'react-native';
import { ProgressBar, Text, useTheme } from 'react-native-paper';

export default function BarraForcaSenha({ senha, forca }: { senha: string; forca: 'fraca' | 'media' | 'forte' }) {
    const theme = useTheme();

    if (!senha) return null;

    const corForca = {
        fraca: '#FF5252',
        media: '#FFA500',
        forte: '#4CAF50',
    };

    const larguraForca = {
        fraca: 0.33,
        media: 0.66,
        forte: 1,
    };

    const labelForca = {
        fraca: 'Fraca',
        media: 'Média',
        forte: 'Forte',
    };

    return (
        <View style={styles.forcaContainer}>
            <View style={styles.forcaBarraContainer}>
                <ProgressBar progress={larguraForca[forca]} color={corForca[forca]} style={styles.forcaBarra} />
            </View>
            <Text style={{ color: corForca[forca], fontWeight: '600', textTransform: 'capitalize', }}>
                Força: {labelForca[forca]}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    forcaContainer: {
        marginVertical: 8,
    },
    forcaBarraContainer: {
        marginBottom: 4,
    },
    forcaBarra: {
        height: 8,
        borderRadius: 4,
    },
});
