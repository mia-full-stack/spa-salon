export interface BookingEmailData {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  service: string;
  date: string;
  time: string;
  duration: string;
  price: string;
  master: string;
  language: string;
}

const translations = {
  ru: {
    clientSubject: "Подтверждение записи в Luxury Spa Salon",
    adminSubject: "Новая запись в Luxury Spa Salon",
    greeting: "Здравствуйте",
    confirmationText: "Ваша запись успешно подтверждена!",
    detailsTitle: "Детали записи:",
    service: "Услуга",
    master: "Мастер",
    date: "Дата",
    time: "Время",
    duration: "Продолжительность",
    price: "Стоимость",
    contactInfo: "Контактная информация:",
    phone: "Телефон",
    email: "Email",
    reminderText:
      "Мы ждем вас! Пожалуйста, приходите за 10 минут до начала сеанса.",
    cancelText:
      "Если вам нужно отменить или перенести запись, пожалуйста, свяжитесь с нами заранее.",
    thanksText: "Спасибо за выбор Luxury Spa Salon!",
    newBookingText: "Получена новая запись от клиента:",
    clientDetails: "Данные клиента:",
    name: "Имя",
  },
  uk: {
    clientSubject: "Підтвердження запису в Luxury Spa Salon",
    adminSubject: "Новий запис в Luxury Spa Salon",
    greeting: "Вітаємо",
    confirmationText: "Ваш запис успішно підтверджено!",
    detailsTitle: "Деталі запису:",
    service: "Послуга",
    master: "Майстер",
    date: "Дата",
    time: "Час",
    duration: "Тривалість",
    price: "Вартість",
    contactInfo: "Контактна інформація:",
    phone: "Телефон",
    email: "Email",
    reminderText:
      "Ми чекаємо на вас! Будь ласка, приходьте за 10 хвилин до початку сеансу.",
    cancelText:
      "Якщо вам потрібно скасувати або перенести запис, будь ласка, зв'яжіться з нами заздалегідь.",
    thanksText: "Дякуємо за вибір Luxury Spa Salon!",
    newBookingText: "Отримано новий запис від клієнта:",
    clientDetails: "Дані клієнта:",
    name: "Ім'я",
  },
  en: {
    clientSubject: "Booking Confirmation at Luxury Spa Salon",
    adminSubject: "New Booking at Luxury Spa Salon",
    greeting: "Hello",
    confirmationText: "Your booking has been successfully confirmed!",
    detailsTitle: "Booking Details:",
    service: "Service",
    master: "Master",
    date: "Date",
    time: "Time",
    duration: "Duration",
    price: "Price",
    contactInfo: "Contact Information:",
    phone: "Phone",
    email: "Email",
    reminderText:
      "We look forward to seeing you! Please arrive 10 minutes before your session.",
    cancelText:
      "If you need to cancel or reschedule, please contact us in advance.",
    thanksText: "Thank you for choosing Luxury Spa Salon!",
    newBookingText: "New booking received from client:",
    clientDetails: "Client Details:",
    name: "Name",
  },
  de: {
    clientSubject: "Buchungsbestätigung im Luxury Spa Salon",
    adminSubject: "Neue Buchung im Luxury Spa Salon",
    greeting: "Hallo",
    confirmationText: "Ihre Buchung wurde erfolgreich bestätigt!",
    detailsTitle: "Buchungsdetails:",
    service: "Dienstleistung",
    master: "Meister",
    date: "Datum",
    time: "Zeit",
    duration: "Dauer",
    price: "Preis",
    contactInfo: "Kontaktinformationen:",
    phone: "Telefon",
    email: "E-Mail",
    reminderText:
      "Wir freuen uns auf Sie! Bitte kommen Sie 10 Minuten vor Ihrer Sitzung.",
    cancelText:
      "Wenn Sie stornieren oder umbuchen müssen, kontaktieren Sie uns bitte im Voraus.",
    thanksText:
      "Vielen Dank, dass Sie sich für Luxury Spa Salon entschieden haben!",
    newBookingText: "Neue Buchung vom Kunden erhalten:",
    clientDetails: "Kundendetails:",
    name: "Name",
  },
};

export function generateClientEmail(data: BookingEmailData): string {
  const t =
    translations[data.language as keyof typeof translations] || translations.en;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); color: #d4af37; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #d4af37; }
          .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
          .detail-label { font-weight: bold; color: #666; }
          .detail-value { color: #333; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
          .highlight { color: #d4af37; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 28px;">Luxury Spa Salon</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Premium Massage Experience</p>
          </div>
          <div class="content">
            <h2 style="color: #1a1a1a;">${t.greeting}, ${data.clientName}!</h2>
            <p style="font-size: 16px;">${t.confirmationText}</p>
            
            <div class="details">
              <h3 style="margin-top: 0; color: #1a1a1a;">${t.detailsTitle}</h3>
              <div class="detail-row">
                <span class="detail-label">${t.service}:</span>
                <span class="detail-value">${data.service}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">${t.master}:</span>
                <span class="detail-value">${data.master}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">${t.date}:</span>
                <span class="detail-value">${data.date}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">${t.time}:</span>
                <span class="detail-value">${data.time}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">${t.duration}:</span>
                <span class="detail-value">${data.duration}</span>
              </div>
              <div class="detail-row" style="border-bottom: none;">
                <span class="detail-label">${t.price}:</span>
                <span class="detail-value highlight">${data.price}</span>
              </div>
            </div>

            <div class="details">
              <h3 style="margin-top: 0; color: #1a1a1a;">${t.contactInfo}</h3>
              <div class="detail-row">
                <span class="detail-label">${t.phone}:</span>
                <span class="detail-value">+49 (171) 213-95-73</span>
              </div>
              <div class="detail-row" style="border-bottom: none;">
                <span class="detail-label">${t.email}:</span>
                <span class="detail-value">info@luxuryspa.com</span>
              </div>
            </div>

            <p style="background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #d4af37;">
              <strong>💆‍♀️ ${t.reminderText}</strong>
            </p>

            <p style="font-size: 14px; color: #666;">${t.cancelText}</p>
            
            <p style="font-size: 16px; margin-top: 30px;"><strong>${t.thanksText}</strong></p>
          </div>
          <div class="footer">
            <p>Luxury Spa Salon | Hannover, Germany</p>
            <p>📍 Example strase, 1 | 📞 +49 (171) 213-95-73</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function generateAdminEmail(data: BookingEmailData): string {
  const t =
    translations[data.language as keyof typeof translations] || translations.en;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); color: #d4af37; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #d4af37; }
          .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
          .detail-label { font-weight: bold; color: #666; }
          .detail-value { color: #333; }
          .alert { background: #d4af37; color: #1a1a1a; padding: 15px; border-radius: 8px; text-align: center; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 28px;">🔔 ${t.adminSubject}</h1>
          </div>
          <div class="content">
            <div class="alert">
              ${t.newBookingText}
            </div>
            
            <div class="details">
              <h3 style="margin-top: 0; color: #1a1a1a;">${t.detailsTitle}</h3>
              <div class="detail-row">
                <span class="detail-label">${t.service}:</span>
                <span class="detail-value">${data.service}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">${t.master}:</span>
                <span class="detail-value">${data.master}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">${t.date}:</span>
                <span class="detail-value">${data.date}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">${t.time}:</span>
                <span class="detail-value">${data.time}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">${t.duration}:</span>
                <span class="detail-value">${data.duration}</span>
              </div>
              <div class="detail-row" style="border-bottom: none;">
                <span class="detail-label">${t.price}:</span>
                <span class="detail-value">${data.price}</span>
              </div>
            </div>

            <div class="details">
              <h3 style="margin-top: 0; color: #1a1a1a;">${t.clientDetails}</h3>
              <div class="detail-row">
                <span class="detail-label">${t.name}:</span>
                <span class="detail-value">${data.clientName}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">${t.phone}:</span>
                <span class="detail-value">${data.clientPhone}</span>
              </div>
              <div class="detail-row" style="border-bottom: none;">
                <span class="detail-label">${t.email}:</span>
                <span class="detail-value">${data.clientEmail}</span>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}
