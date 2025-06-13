//çıkış logosu kayboluyor?
//update ıcın acılan modalde kapama tusu yok
//icon konteynır stilini getremındersdan al

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import { BACKEND_URL } from '@env';
import AddNote from './AddNote';
import UpdateNote from './UpdateNote';
import DeleteNote from './DeleteNote';

const GetNotes = ({ userId }) => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [updateModalVisible, setUpdateModalVisible] = useState(false);
    const [selectedNote, setSelectedNote] = useState(null); // Seçilen hatırlatıcıyı saklamak için



    const fetchNotes = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/api/notes/get/${userId}`);
            setNotes(response.data.notes);
        } catch (err) {
            setError('Notlar alınırken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, [userId]);

    const handleAddNoteSuccess = () => {
        fetchNotes();
        setTimeout(() => setModalVisible(false), 2000);
    };

    const handleUpdateNoteSuccess = () => {
        fetchNotes(); // Güncelleme başarılı olduğunda hatırlatıcıları yeniden yükle
        setUpdateModalVisible(false); // Modalı kapat
        setSelectedNote(null); // Seçilen hatırlatıcıyı sıfırla
      };

    const handleDelete = async (noteId) => {
        await DeleteNote({
            userId,
            noteId,
            onSuccess: fetchNotes,
        });
    };

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator color="#4CAF50" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.addButtonContainer}>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setModalVisible(true)}
                >
                    <Icon name="add" size={30} color="blue" />
                </TouchableOpacity>
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.closeButtonContainer}>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Icon name="close" size={30} color="white" />
                        </TouchableOpacity>
                    </View>
                    <AddNote userId={userId} onSuccess={handleAddNoteSuccess} />
                </View>
            </Modal>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={updateModalVisible}
                    onRequestClose={() => setUpdateModalVisible(false)}
                >
                 <View style={styles.modalContainer}>
                {selectedNote && (
                    <UpdateNote 
                    userId={userId} 
                    noteId={selectedNote._id} 
                    onSuccess={handleUpdateNoteSuccess} 
                    existingNote={selectedNote} // Mevcut hatırlatıcı bilgilerini geç
                    />
                )}
            <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setUpdateModalVisible(false)}
            >
                <Text style={styles.closeButtonText}>Kapat</Text>
            </TouchableOpacity>
            </View>
      </Modal>

            <FlatList
                data={notes}
                keyExtractor={(item) => item._id}
                style={styles.notesList}
                renderItem={({ item }) => (
                    <View style={styles.noteItem}>
                        <Text style={styles.noteContent}>{item.content}</Text>
                        <Text style={styles.noteDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
                        <View style={styles.deleteButtonContainer}>
                            <View>
                            <TouchableOpacity 
                                style={styles.editIcon} 
                                onPress={() => {
                                    setSelectedNote(item); // Seçilen hatırlatıcıyı ayarla
                                    setUpdateModalVisible(true); // Güncelleme modalını aç
                                }}
                                >
                                <Icon name="pencil" size={15} color="dodgerblue" />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.deleteButton}
                                    onPress={() => handleDelete(item._id)}
                                >
                                    <Icon name="trash" size={15} color="gray" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        backgroundColor: '#f4f6f9',
        justifyContent: 'center',  // Sayfanın ortasında konumlandırma
        alignItems: 'center',      
    },
    notesList: {
        maxHeight: 400,
        width: "90%"
      },
    noteItem: {
        backgroundColor: '#ffebee',
        padding: 15,
        borderRadius: 10,
        margin: 5,
        position: 'relative',
      },
      addButtonContainer: {
        position: 'absolute',  
        right: 90,             
        top: 40,         
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 18,
        color: 'red',
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 20,
        position: 'relative',
    },

    noteDate: {
        fontSize: 12,
        color: '#999',
        textAlign: 'right',
    },
    deleteButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    deleteButton: {
        marginTop: 4,
    },
    closeButtonContainer: {
        alignItems: 'flex-end',
    },
});

export default GetNotes;
