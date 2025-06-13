import axios from 'axios';
import { BACKEND_URL } from '@env';

const DeleteReminder = async ({ userId, reminderId, onSuccess }) => {
  try {
    await axios.delete(`${BACKEND_URL}/api/reminders/delete/${userId}/${reminderId}`);
    console.log('Hatırlatıcı başarıyla silindi');
    if (onSuccess) {
      onSuccess(); // Silme işlemi başarılı olduğunda callback'i tetikle
    }
  } catch (error) {
    console.error('Hatırlatıcı silinirken bir hata oluştu:', error);
    throw error;
  }
};

export default DeleteReminder;
