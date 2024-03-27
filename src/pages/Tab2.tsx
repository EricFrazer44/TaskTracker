import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardContent } from '@ionic/react';
import './Tab2.css';
import Calendar from 'react-calendar';
import { useEffect, useState } from 'react';
import { Value } from 'react-calendar/dist/cjs/shared/types';
import 'react-calendar/dist/Calendar.css';

interface Holiday {
  date: string;
  localName: string;
  fixed: boolean;
}

const fetchHolidays = async () => {
  try {
    const response = await fetch('https://date.nager.at/Api/v2/NextPublicHolidays/US');
    const holidays = await response.json();
    return holidays || []; 
  } catch (error) {
    console.error('There was an error!', error);
    return []; 
  }
};

const Tab2: React.FC = () => {
  const [value, setValue] = useState(new Date());
  const [holidays, setHolidays] = useState<Holiday[]>([]);

  useEffect(() => {
    fetchHolidays().then(fetchedHolidays => {
      setHolidays(fetchedHolidays);
    });
  }, []);

  const handleDateChange = (value: Date | Date[], event: React.MouseEvent<HTMLButtonElement>) => {
    setValue(value as Date);
  };

  const currentDate = value.toISOString().split('T')[0]; // Get the current date in YYYY-MM-DD format

  const todaysHolidays = holidays.filter(holiday => holiday.date === currentDate); // Filter the holidays that are on the current date

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Calendar</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Calendar</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div className="calendar-container">
          <Calendar
            onChange={(value: Value, event: React.MouseEvent<HTMLButtonElement>) => handleDateChange(value as Date, event)}
            value={value}
          />
        </div>
        {todaysHolidays.map((holiday, index) => (
          <IonCard key={index}>
            <IonCardContent>
              <h2>{holiday.localName}</h2>
              <p>Date: {holiday.date}</p>
              <p>Fixed: {holiday.fixed ? 'Yes' : 'No'}</p>
            </IonCardContent>
          </IonCard>
        ))}
      </IonContent>
    </IonPage>
  );
};

export default Tab2;



/* This page will act as the homepage of the app. There will be a calendar with the current date easily seen by the user. I will use an external API to pull a holiday to display at the 
bottom of the page in a card. */
