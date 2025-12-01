const studyPlanTemplate = `       
       <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Congrats on Your New Study Plan!</title>
            <style>
                /* Base styling */
                body {
                    margin: 0;
                    padding: 0;
                    font-family: Arial, Helvetica, sans-serif;
                    color: #333;
                    line-height: 1.5;
                    background-color: #f9f9f9;
                }
                
                /* Email container */
                .email-container {
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    padding: 30px;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
                }
                
                /* Header */
                .header {
                    text-align: center;
                    margin-bottom: 30px;
                }
                
                .logo {
                    width: 200px;
                    height: auto;
                    margin-bottom: 15px;
                }
                
                /* Content sections */
                .content-section {
                    padding: 0 0 20px 0;
                }
                
                /* Hero section */
                .hero {
                    background-color: #f2e6ff;
                    border-radius: 8px;
                    padding: 30px;
                    text-align: center;
                    margin-bottom: 30px;
                }
                
                .hero-title {
                    font-size: 28px;
                    color: #5a287d;
                    margin-top: 0;
                    margin-bottom: 15px;
                }
                
                .hero-subtitle {
                    font-size: 18px;
                    color: #333;
                    margin-top: 0;
                }
                
                .study-plan-badge {
                    background-color: #ffd166;
                    color: #333;
                    padding: 8px 16px;
                    border-radius: 20px;
                    font-weight: bold;
                    display: inline-block;
                    margin: 15px 0;
                }
                
                /* Typography */
                h1 {
                    color: #333;
                    font-size: 24px;
                    margin-bottom: 15px;
                }
                
                h2 {
                    color: #5a287d;
                    font-size: 20px;
                    margin-top: 25px;
                    margin-bottom: 15px;
                }
                
                p {
                    margin: 10px 0;
                    font-size: 16px;
                }
                
                /* List styling */
                ul {
                    padding-left: 20px;
                    margin: 20px 0;
                }
                
                li {
                    margin-bottom: 12px;
                }
                
                /* Button/CTA styling */
                .cta-button {
                    display: block;
                    background-color: #5a287d;
                    color: white;
                    text-align: center;
                    padding: 14px 20px;
                    text-decoration: none;
                    border-radius: 6px;
                    font-weight: bold;
                    font-size: 16px;
                    margin: 25px auto;
                    width: 200px;
                }
                
                /* Tips section */
                .tips-section {
                    background-color: #f0f7ff;
                    border-radius: 8px;
                    padding: 20px;
                    margin: 25px 0;
                }
                
                /* Footer */
                .footer {
                    padding-top: 30px;
                    border-top: 1px solid #eaeaea;
                    color: #777;
                    font-size: 14px;
                    text-align: center;
                }
                
                .social-links {
                    margin: 15px 0;
                }
                
                .social-link {
                    display: inline-block;
                    margin: 0 10px;
                    width: 30px;
                    height: 30px;
                    background-color: #5a287d;
                    border-radius: 50%;
                    color: white;
                    text-align: center;
                    line-height: 30px;
                    text-decoration: none;
                }
                
                /* Emoji */
                .emoji {
                    font-size: 18px;
                }

                /* Responsive */
                @media screen and (max-width: 480px) {
                    .email-container {
                        padding: 15px;
                    }
                    
                    .hero {
                        padding: 20px 15px;
                    }
                    
                    .hero-title {
                        font-size: 24px;
                    }
                    
                    .hero-subtitle {
                        font-size: 16px;
                    }
                    
                    h1 {
                        font-size: 22px;
                    }
                    
                    h2 {
                        font-size: 18px;
                    }
                    
                    p, li {
                        font-size: 15px;
                    }
                    
                    .cta-button {
                        width: 100%;
                        padding: 12px 15px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <!-- Header -->
                <div class="header">
                    <img class="logo" src="https://ik.imagekit.io/5hv70bbh5/Frame_1321314433-removebg-preview.png?updatedAt=1747252578885" alt="SIMBI Logo">
                </div>
                
                <!-- Hero Section -->
                <div class="hero">
                    <h1 class="hero-title">Congratulations, {{name}}! <span class="emoji">🎉</span></h1>
                    <p class="hero-subtitle">You've just created your shiny new study plan</p>
                    <div class="study-plan-badge">{{studyPlan}}</div>
                </div>
                
                <!-- Content Section -->
                <div class="content-section">
                    <p>Hey there superstar,</p>
                    
                    <p>You've just taken a <strong>major step</strong> toward academic greatness! Your new study plan <strong>"{{studyPlanName}}"</strong> is all set up and ready to help you crush your goals.</p>
                    
                    <h2>What happens next?</h2>
                    
                    <ul>
                        <li>SIMBI will break your study plan into <strong>manageable sessions</strong></li>
                        <li>You'll earn <strong>tokens and rewards</strong> as you complete study sessions</li>
                        <li>SIMBI will <strong>adapt to your progress</strong> and help you overcome any obstacles</li>
                        <li>You'll receive <strong>gentle reminders</strong> to keep you on track (and maybe an occasional friendly roast!)</li>
                    </ul>
                    
                    <div class="tips-section">
                        <h2>Pro Tips for Success:</h2>
                        <ul>
                            <li><strong>Consistency wins:</strong> Even 20-minute study sessions add up over time</li>
                            <li><strong>Use your SIMBI toolkit:</strong> Create flashcards, summaries, and practice quizzes</li>
                            <li><strong>Don't break the chain:</strong> Try to study a little bit every day</li>
                        </ul>
                    </div>
                    
                    <p>Ready to dive into your first study session?</p>
                    
                    <a href="#" class="cta-button">Start Studying Now</a>
                    
                    <p>Remember, I'm here to help you every step of the way. You've got this!</p>
                    
                    <p>Your sassiest study companion,<br>SIMBI</p>
                </div>
                
                <!-- Footer -->
                <div class="footer">
                    <p>© 2025 SIMBI Learning Technologies | <a href="#">Privacy Policy</a> | <a href="#">Unsubscribe</a></p>
                    
                    <div class="social-links">
                        <a href="#" class="social-link">f</a>
                        <a href="#" class="social-link">t</a>
                        <a href="#" class="social-link">i</a>
                    </div>
                    
                    <p><small>SIMBI is watching your study habits (in a totally non-creepy, supportive way!)</small></p>
                </div>
            </div>
        </body>
        </html>
    `;

export default studyPlanTemplate;