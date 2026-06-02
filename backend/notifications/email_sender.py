import smtplib
from email.mime.text import MIMEText

from app.config import settings


def send_email_notification(to_email, subject, body):
    try:
        msg = MIMEText(body)

        msg["Subject"] = subject
        msg["From"] = settings.EMAIL_USERNAME
        msg["To"] = to_email

        server = smtplib.SMTP(
            settings.EMAIL_HOST,
            settings.EMAIL_PORT
        )

        server.starttls()

        server.login(
            settings.EMAIL_USERNAME,
            settings.EMAIL_PASSWORD
        )

        server.sendmail(
            settings.EMAIL_USERNAME,
            [to_email],
            msg.as_string()
        )

        server.quit()

        return True

    except Exception:
        return False