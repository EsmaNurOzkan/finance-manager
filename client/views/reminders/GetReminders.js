import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Modal, TouchableOpacity } from 'react-native';
import { BACKEND_URL } from '@env';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import AddReminder from './AddReminder';
import UpdateReminder from './UpdateReminder'; // UpdateReminder bileşenini içe aktar
import DeleteReminder from './DeleteReminder';

const GetReminders = ({ userId }) => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState(null); // Seçilen hatırlatıcıyı saklamak için

  const fetchReminders = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/reminders/get/${userId}`);
      setReminders(response.data.reminders); // Dönüşteki reminders'ı ayarlayın
    } catch (error) {
      console.error('API isteğinde bir hata oluştu:', error);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchReminders();
  }, [userId]);

  const handleAddReminderSuccess = () => {
    fetchReminders();
    setTimeout(() => setModalVisible(false), 2000);
  };

  const handleUpdateReminderSuccess = () => {
    fetchReminders(); // Güncelleme başarılı olduğunda hatırlatıcıları yeniden yükle
    setUpdateModalVisible(false); // Modalı kapat
    setSelectedReminder(null); // Seçilen hatırlatıcıyı sıfırla
  };

  const handleDelete = async (reminderId) => {
    await DeleteReminder({
      userId,
      reminderId,
      onSuccess: fetchReminders, // Silme işlemi başarılı olduğunda hatırlatıcıları tekrar fetch et
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#0000ff" />
        <Text style={styles.loadingText}>Anımsatıcılar yükleniyor...</Text>
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
        <Icon name="add" size={30} color="#000" />
      </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <AddReminder userId={userId} onSuccess={handleAddReminderSuccess} />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Kapat</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={updateModalVisible}
        onRequestClose={() => setUpdateModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          {selectedReminder && (
            <UpdateReminder 
              userId={userId} 
              reminderId={selectedReminder._id} 
              onSuccess={handleUpdateReminderSuccess} 
              existingReminder={selectedReminder} // Mevcut hatırlatıcı bilgilerini geç
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

      {reminders.length === 0 ? (
        <Text style={styles.noRemindersText}>Anımsatıcı bulunamadı</Text>
      ) : (
        <FlatList
          data={reminders}
          keyExtractor={(item) => item._id}
          style={styles.remindersList}
          renderItem={({ item }) => {
            const isOverdue = new Date(item.dueDate) < new Date(); // End date'i geçmiş mi kontrolü
            return (
              <View
                style={[
                  styles.reminderItem,
                  { backgroundColor: isOverdue ? '#ffebee' : '#e8f5e9' }, // Kırmızı veya yeşil arka plan
                ]}
              >
                <Text style={[styles.reminderTitle, { color: isOverdue ? 'red' : 'green' }]}>
                  {item.title}
                </Text>
                <Text style={styles.reminderDescription}>{item.description}</Text>
                <Text style={styles.reminderDate}>
                  Son Tarih: {new Date(item.dueDate).toLocaleDateString()}
                </Text>
                <View style={styles.iconContainer}>
                  <TouchableOpacity
                    style={styles.editIcon}
                    onPress={() => {
                      setSelectedReminder(item); // Seçilen hatırlatıcıyı ayarla
                      setUpdateModalVisible(true); // Güncelleme modalını aç
                    }}
                  >
                    <Icon name="pencil" size={15} color="dodgerblue" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteIcon}
                    onPress={() => handleDelete(item._id)}
                  >
                    <Icon name="trash" size={15} color="crimson" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
          

        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#f9f9f9',
  },
  addButtonContainer: {
    alignItems: 'flex-end',  // Butonu sağa yaslar
    marginBottom: 5,
  },
  addButton: {
    padding: 5,  // İkon için biraz iç boşluk
  },  
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 5,
  },
  closeButton: {
    marginTop: 10,
    padding: 5,
    backgroundColor: '#ffebee',
    borderRadius: 5,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    marginTop: 5,
    color: '#666',
  },
  noRemindersText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
  remindersList: {
    maxHeight: 400,
  },
  reminderItem: {
    backgroundColor: '#ffebee',
    padding: 15,
    borderRadius: 10,
    marginBottom: 5,
    position: 'relative',
  },
  reminderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  reminderDescription: {
    fontSize: 16,
    color: '#555',
  },
  reminderDate: {
    fontSize: 14,
    color: '#777',
    marginTop: 5,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    top: 10,
  },
  editIcon: {
    marginRight: 5, // Silme ikonunun yanında boşluk bırakır
  },
  deleteIcon: {},
});

export default GetReminders;
