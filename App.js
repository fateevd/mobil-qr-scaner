import React, {useEffect, useState} from 'react';
import {Button, CameraRoll, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {BarCodeScanner} from 'expo-barcode-scanner';

export default function App() {

    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [text, setText] = useState('Поиск что можно от сканировать...');
    const [positionX, setPositionX] = useState(0);
    const [positionY, setPositionY] = useState(0);
    const [sheight, setHeight] = useState(0);
    const [swidth, setWidth] = useState(0);


    const askForCameraPermission = () => {
        (async () => {
            const {status} = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })()
    }

    // Request Camera Permission
    useEffect(() => {
        askForCameraPermission();
    }, []);

    useEffect(() => {
        if (scanned) {
            setPositionX(0);
            setPositionY(0);
            setHeight(0);
            setWidth(0);

        }
    }, [scanned]);


    const handleBarCodeScanned = ({bounds, data}) => {
        const {origin, size} = bounds;
        setPositionX(origin.x);
        setPositionY(origin.y);
        setHeight(size.height);
        setWidth(size.width);
        setScanned(true);
        setText(data);

    };

    // Check permissions and return the screens
    if (hasPermission === null) {
        return (
            <View style={styles.container}>
                <Text>Requesting for camera permission</Text>
            </View>)
    }
    if (hasPermission === false) {
        return (
            <View style={styles.container}>
                <Text style={{margin: 10}}>No access to camera</Text>
                <Button title={'Allow Camera'} onPress={() => askForCameraPermission()}/>
            </View>)
    }

    return (
        <SafeAreaView>
            <View style={styles.container}>
                <View style={styles.barcodebox}>
                    <BarCodeScanner
                        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                        style={StyleSheet.absoluteFillObject}
                        barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
                    />
                    <View style={{
                        position: "absolute",
                        top: positionY,
                        left: positionX,
                        width: swidth,
                        height: sheight,
                        borderColor: 'tomato',
                        borderWidth: 3,
                    }}/>
                </View>

                {scanned && <Button title={'Сканировать QR?'} onPress={() => setScanned(false)} color='tomato'/>}
                <Text style={styles.maintext}>{text}</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
    },
    maintext: {
        fontSize: 16,
        margin: 20,
    },
    barcodebox: {
        alignItems: 'center',
        justifyContent: 'center',
        height: '87%',
        width: "100%",
    }
});