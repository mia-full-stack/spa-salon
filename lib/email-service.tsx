// Email notification service
export interface EmailNotification {
  to: string
  subject: string
  html: string
}

export async function sendBookingConfirmation(booking: {
  userName: string
  userEmail: string
  serviceType: string
  serviceDuration: string
  date: string
  time: string
  price: string
}) {
  const clientEmail: EmailNotification = {
    to: booking.userEmail,
    subject: "Подтверждение записи в спа-салон",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); color: #d4af37; padding: 30px; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; border: 1px solid #ddd; }
            .details { background: white; padding: 20px; margin: 20px 0; border-left: 4px solid #d4af37; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            h1 { margin: 0; font-size: 28px; }
            .label { font-weight: bold; color: #1a1a1a; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Спасибо за запись!</h1>
            </div>
            <div class="content">
              <p>Здравствуйте, ${booking.userName}!</p>
              <p>Ваша запись успешно подтверждена. Мы ждем вас в нашем спа-салоне.</p>
              
              <div class="details">
                <h2 style="margin-top: 0; color: #d4af37;">Детали записи:</h2>
                <p><span class="label">Услуга:</span> ${booking.serviceType}</p>
                <p><span class="label">Продолжительность:</span> ${booking.serviceDuration}</p>
                <p><span class="label">Дата:</span> ${new Date(booking.date).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}</p>
                <p><span class="label">Время:</span> ${booking.time}</p>
                <p><span class="label">Стоимость:</span> ${booking.price}</p>
              </div>
              
              <p><strong>Важная информация:</strong></p>
              <ul>
                <li>Пожалуйста, приходите за 10 минут до начала сеанса</li>
                <li>Если вам нужно отменить или перенести запись, свяжитесь с нами заранее</li>
                <li>Рекомендуем не есть за 1-2 часа до массажа</li>
              </ul>
              
              <p>Наш адрес: г. Москва, ул. Примерная, д. 123</p>
              <p>Телефон: +7 (495) 123-45-67</p>
            </div>
            <div class="footer">
              <p>С уважением, команда спа-салона</p>
              <p>Это автоматическое письмо, пожалуйста, не отвечайте на него</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }

  const adminEmail: EmailNotification = {
    to: "admin@spa-salon.com", // Замените на реальный email администратора
    subject: `Новая запись: ${booking.userName} - ${booking.serviceType}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #1a1a1a; color: #d4af37; padding: 20px; }
            .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
            .label { font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Новая запись в системе</h2>
            </div>
            <div class="content">
              <h3>Информация о клиенте:</h3>
              <p><span class="label">Имя:</span> ${booking.userName}</p>
              <p><span class="label">Email:</span> ${booking.userEmail}</p>
              
              <h3>Детали записи:</h3>
              <p><span class="label">Услуга:</span> ${booking.serviceType}</p>
              <p><span class="label">Продолжительность:</span> ${booking.serviceDuration}</p>
              <p><span class="label">Дата:</span> ${new Date(booking.date).toLocaleDateString("ru-RU")}</p>
              <p><span class="label">Время:</span> ${booking.time}</p>
              <p><span class="label">Стоимость:</span> ${booking.price}</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }

  try {
    // Отправка email через API route
    await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emails: [clientEmail, adminEmail] }),
    })
    return { success: true }
  } catch (error) {
    console.error("Failed to send emails:", error)
    return { success: false, error }
  }
}
