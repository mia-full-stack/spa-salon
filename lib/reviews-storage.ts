// Client-side storage for reviews
export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  serviceType: string;
  createdAt: string;
  approved: boolean;
}

const REVIEWS_KEY = "spa_reviews";

export function saveReview(review: Review): void {
  const reviews = getAllReviews();
  reviews.push(review);
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
}

export function getAllReviews(): Review[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(REVIEWS_KEY);
  return data ? JSON.parse(data) : [];
}

export function getApprovedReviews(): Review[] {
  return getAllReviews().filter((review) => review.approved);
}

export function getUserReviews(userId: string): Review[] {
  return getAllReviews().filter((review) => review.userId === userId);
}

// Initialize with some sample reviews
export function initializeSampleReviews(): void {
  const existing = getAllReviews();
  if (existing.length > 0) return;

  const sampleReviews: Review[] = [
    {
      id: "review_1",
      userId: "sample_user_1",
      userName: "Лариса Павлова",
      rating: 5,
      comment:
        "Прекрасный массаж! Мастер очень профессиональный, учел все мои пожелания. После сеанса чувствую себя обновленной. Обязательно вернусь еще!",
      serviceType: "Классический массаж",
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      approved: true,
    },
    {
      id: "review_2",
      userId: "sample_user_2",
      userName: "Марина Пакулова",
      rating: 5,
      comment:
        "Лимфодренажный массаж превзошел все ожидания! Отеки ушли, кожа стала более упругой. Атмосфера в салоне очень приятная и расслабляющая.",
      serviceType: "Лимфодренажный массаж",
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      approved: true,
    },
    {
      id: "review_3",
      userId: "sample_user_3",
      userName: "Дмитрий Соколов",
      rating: 5,
      comment:
        "Отличный спортивный массаж! После интенсивных тренировок это именно то, что нужно. Мастер знает свое дело, все мышцы проработаны качественно.",
      serviceType: "Спортивный массаж",
      createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
      approved: true,
    },
    {
      id: "review_4",
      userId: "sample_user_4",
      userName: "Елена Смирнова",
      rating: 5,
      comment:
        "Массаж лица - это волшебство! Кожа сияет, морщинки разгладились, овал лица подтянулся. Результат виден сразу после первого сеанса!",
      serviceType: "Массаж лица",
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      approved: true,
    },
    {
      id: "review_5",
      userId: "sample_user_5",
      userName: "Ольга Николаева",
      rating: 5,
      comment:
        "Очень довольна! Приятная атмосфера, внимательный персонал, профессиональный подход. Рекомендую всем, кто ищет качественный массаж.",
      serviceType: "Классический массаж",
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      approved: true,
    },
  ];

  localStorage.setItem(REVIEWS_KEY, JSON.stringify(sampleReviews));
}
