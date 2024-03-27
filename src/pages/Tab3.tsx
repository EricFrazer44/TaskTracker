import { IonButton, IonContent, IonHeader, IonInput, IonPage, IonTitle, IonToolbar, IonDatetime, IonLabel } from '@ionic/react';
import './Tab3.css';
import { doc, setDoc, collection, addDoc, getDoc } from "firebase/firestore"; 
import { db, auth } from '../firebase';
import { useState } from 'react';


const Tab3: React.FC = () => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');

  const addTask = async () => {
    if (auth.currentUser) {
      const [dateOnly, timeOnly] = date.split('T');
    
      const taskData = {
        [timeOnly]: {
          task: description,
          description
        }
      };
    
      try {
        const taskDoc = doc(db, "Tasks", auth.currentUser.uid, "dates", dateOnly);
        const docSnap = await getDoc(taskDoc);
    
        if (docSnap.exists()) {
          // If the document exists, update it
          await setDoc(taskDoc, taskData, { merge: true });
        } else {
          // If the document does not exist, create it
          await setDoc(taskDoc, taskData);
        }
      } catch (error) {
        console.error("Error adding task: ", error);
      }
    
      // Reset the form
      setDate('');
      setTime('');
      setDescription('');
    } else {
      console.error("No user is currently signed in");
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Add Task</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="tab3-content">
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Add Task</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonLabel>Date & Time</IonLabel>
        <IonDatetime
          value={date} 
          onIonChange={e => setDate(e.detail.value as string)}>
        </IonDatetime>
        <IonLabel>Description</IonLabel>
        <IonInput value={description} onIonChange={e => setDescription(e.detail.value!)}></IonInput>
        <IonButton onClick={addTask}>Add Task</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Tab3;



/* This page will be used to add tasks to the app. These tasks will be added to firestore and stored there for Tab1 to pull and display. */ 