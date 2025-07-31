/**
 * About Page Component for Babysitter Finder SPA
 * Contains information about the application and company
 */

const AboutPage = {
    /**
     * Render the about page
     */
    render(container) {
        console.log('Rendering about page...');
        container.innerHTML = this.getTemplate();
    },

    /**
     * Get the HTML template for the about page
     */
    getTemplate() {
        return `
            <div class="container my-5">
                <!-- Hero Section -->
                <section class="text-center mb-5">
                    <h1 class="display-4 mb-3">אודות Babysitter Finder</h1>
                    <p class="lead">הפלטפורמה המובילה לחיבור בין הורים לבייביסיטרים בישראל</p>
                </section>

                <!-- Mission Section -->
                <section class="row mb-5">
                    <div class="col-lg-8 mx-auto">
                        <div class="card">
                            <div class="card-body p-5">
                                <h2 class="card-title text-center mb-4">
                                    <i class="bi bi-heart-fill text-primary me-2"></i>
                                    המשימה שלנו
                                </h2>
                                <p class="card-text text-center fs-5">
                                    אנחנו מאמינים שכל הורה זכאי למצוא בייביסיטר אמין ומקצועי בקלות ובמהירות. 
                                    המטרה שלנו היא ליצור קהילה בטוחה ואמינה שמחברת בין משפחות לבין בייביסיטרים מנוסים.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Features Grid -->
                <section class="row g-4 mb-5">
                    <div class="col-md-4">
                        <div class="text-center">
                            <div class="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 80px; height: 80px;">
                                <i class="bi bi-shield-check fs-2"></i>
                            </div>
                            <h4>בטיחות מקסימלית</h4>
                            <p class="text-muted">כל הבייביסיטרים עוברים בדיקות רקע מקיפות ואימות זהות חלוטי</p>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="text-center">
                            <div class="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 80px; height: 80px;">
                                <i class="bi bi-clock fs-2"></i>
                            </div>
                            <h4>זמינות 24/7</h4>
                            <p class="text-muted">מצאו בייביסיטר זמין בכל שעה, כל יום - גם בהודעה קצרה</p>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="text-center">
                            <div class="bg-info text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 80px; height: 80px;">
                                <i class="bi bi-chat-heart fs-2"></i>
                            </div>
                            <h4>תקשורת ישירה</h4>
                            <p class="text-muted">שוחחו ישירות עם בייביסיטרים, קבעו פגישות ובנו אמון</p>
                        </div>
                    </div>
                </section>

                <!-- Stats Section -->
                <section class="bg-light rounded p-5 mb-5">
                    <h3 class="text-center mb-4">הסטטיסטיקות שלנו</h3>
                    <div class="row text-center">
                        <div class="col-md-3">
                            <h2 class="text-primary">1,500+</h2>
                            <p class="mb-0">בייביסיטרים רשומים</p>
                        </div>
                        <div class="col-md-3">
                            <h2 class="text-success">5,000+</h2>
                            <p class="mb-0">משפחות מרוצות</p>
                        </div>
                        <div class="col-md-3">
                            <h2 class="text-info">50,000+</h2>
                            <p class="mb-0">שעות ביביסיטר</p>
                        </div>
                        <div class="col-md-3">
                            <h2 class="text-warning">98%</h2>
                            <p class="mb-0">שביעות רצון</p>
                        </div>
                    </div>
                </section>

                <!-- How It Works -->
                <section class="mb-5">
                    <h3 class="text-center mb-4">איך זה עובד?</h3>
                    <div class="row g-4">
                        <div class="col-md-4">
                            <div class="card h-100">
                                <div class="card-body text-center">
                                    <div class="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 60px; height: 60px;">
                                        <span class="fs-4 fw-bold">1</span>
                                    </div>
                                    <h5 class="card-title">הרשמה</h5>
                                    <p class="card-text">הירשמו לפלטפורמה כהורים או בייביסיטרים ובנו את הפרופיל שלכם</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="card h-100">
                                <div class="card-body text-center">
                                    <div class="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 60px; height: 60px;">
                                        <span class="fs-4 fw-bold">2</span>
                                    </div>
                                    <h5 class="card-title">חיפוש</h5>
                                    <p class="card-text">חפשו בייביסיטר לפי מיקום, זמינות, מחיר ודירוג</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="card h-100">
                                <div class="card-body text-center">
                                    <div class="bg-info text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 60px; height: 60px;">
                                        <span class="fs-4 fw-bold">3</span>
                                    </div>
                                    <h5 class="card-title">התחברות</h5>
                                    <p class="card-text">צרו קשר עם הבייביסיטר, קבעו פגישה ותתחילו לעבוד יחד</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Contact Section -->
                <section class="text-center">
                    <div class="card">
                        <div class="card-body p-5">
                            <h3 class="card-title mb-4">
                                <i class="bi bi-envelope-heart me-2"></i>
                                צרו קשר
                            </h3>
                            <p class="card-text mb-4">יש לכם שאלות? אנחנו כאן לעזור!</p>
                            <div class="row justify-content-center">
                                <div class="col-md-6">
                                    <div class="row g-3">
                                        <div class="col-12">
                                            <div class="d-flex align-items-center justify-content-center">
                                                <i class="bi bi-envelope-fill text-primary me-3 fs-4"></i>
                                                <span>info@babysitterfinder.co.il</span>
                                            </div>
                                        </div>
                                        <div class="col-12">
                                            <div class="d-flex align-items-center justify-content-center">
                                                <i class="bi bi-telephone-fill text-success me-3 fs-4"></i>
                                                <span>03-1234567</span>
                                            </div>
                                        </div>
                                        <div class="col-12">
                                            <div class="d-flex align-items-center justify-content-center">
                                                <i class="bi bi-clock-fill text-info me-3 fs-4"></i>
                                                <span>ימים א'-ו', 9:00-18:00</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        `;
    }
};

// Export the component
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AboutPage;
} else {
    window.AboutPage = AboutPage;
}

console.log('AboutPage component loaded successfully!');