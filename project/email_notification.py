import smtplib
from email.message import EmailMessage


def email_send(subject, content, receiver):
    gmail_user = 'nono.z14c@gmail.com'
    gmail_password = 'XntVXoL9gadkqbJupT'

    msg = EmailMessage()
    msg['From'] = "nono.z14c@gmail.com"
    msg['Subject'] = subject
    msg['To'] = receiver
    msg.set_content(content)

    try:
        server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
        server.ehlo()
        server.login(gmail_user, gmail_password)
        server.send_message(msg)
        server.quit()
        print("email sent")
    except:
        print("Something went wrong...")
