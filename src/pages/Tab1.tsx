import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/react';
import { useEffect, useState, useRef } from 'react';
import { collection, onSnapshot, query, orderBy, startAfter, getDocs, limit } from 'firebase/firestore';
import { auth, db } from '../firebase';

type TaskType = {
  date: string;
  tasks: { time: string; description: string }[];
};

const Tab1: React.FC = () => {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [disableInfiniteScroll, setDisableInfiniteScroll] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const lastTaskRef = useRef<any>(null);

  const loadMoreTasks = async () => {
    if (auth.currentUser) {
      const q = query(
        collection(db, "Tasks", auth.currentUser.uid, "dates"),
        limit(10)
      );
  
      const taskSnapshot = await getDocs(q);
      if (!taskSnapshot.empty) {
        const newTasks = taskSnapshot.docs.map(doc => {
          const data = doc.data();
          const tasks = Object.keys(data).map(time => ({ time, description: data[time].description }));
          return { date: doc.id, tasks };
        });
        lastTaskRef.current = taskSnapshot.docs[taskSnapshot.docs.length - 1];
        setTasks([...tasks, ...newTasks]);
      } else {
        setDisableInfiniteScroll(true);
      }
    }
  };

  useEffect(() => {
    console.log("useEffect hook executed"); // Log when the useEffect hook is executed
    if (auth.currentUser) {
      console.log("Current user ID:", auth.currentUser.uid); // Log the current user ID
      const q = query(collection(db, "Tasks", auth.currentUser.uid, "dates"), limit(10));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        console.log("Snapshot data:", snapshot.docs.map(doc => doc.data())); // Log the data
        if (!snapshot.empty) {
          const newTasks = snapshot.docs.map(doc => {
            const data = doc.data();
            const tasks = Object.keys(data).map(time => ({ time, description: data[time].description }));
  
            return { date: doc.id, tasks };
          });
          lastTaskRef.current = snapshot.docs[snapshot.docs.length - 1];
          setTasks(newTasks);
        } else {
          console.log("Snapshot is empty"); // Log if the snapshot is empty
        }
        setLoading(false); // Set loading to false after the tasks are set
      });
  
      // Cleanup function
      return () => unsubscribe();
    } else {
      console.log("No user is currently authenticated"); // Log if no user is authenticated
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show a loading spinner or placeholder
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tasks</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
      {tasks.map((task) => (
        <IonCard key={task.date}>
          <IonCardHeader>
            <IonCardTitle>{task.date}</IonCardTitle> {/* Display the date */}
          </IonCardHeader>
          {task.tasks.map(({ time, description }) => (
            <IonCardContent key={time}>
              {/* Display the time and description */}
              <div>
                <h2>{time}</h2>
                <p>{description}</p>
              </div>
            </IonCardContent>
          ))}
        </IonCard>
      ))}
      </IonContent>
    </IonPage>
  );
};

export default Tab1;




/* This page will be for displaying the days as cards with an endless scroll. Each day will show 2 task randomly selected if found for that day. */